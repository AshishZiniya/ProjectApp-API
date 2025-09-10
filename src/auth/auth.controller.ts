// FileName: MultipleFiles/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Req,
  Get, // <--- IMPORT Req
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import type { Request, Response } from 'express'; // <--- IMPORT Request
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly jwt: JwtService,
  ) {}

  @Get('me')
  async getMe(@Req() req: Request) {
    const cookies = req.cookies as Record<string, unknown> | undefined;
    const accessToken = cookies?.accessToken;

    if (!accessToken || typeof accessToken !== 'string') {
      throw new UnauthorizedException('No access token');
    }

    let payload: { sub: string; email: string; role: string };
    try {
      payload = this.jwt.verify(accessToken, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.auth.validateUserById(payload.sub);
    if (!user) throw new UnauthorizedException('User not found');

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access, refresh, user } = await this.auth.register(
      dto.email,
      dto.name,
      dto.password,
    );
    this.setCookies(res, access, refresh);
    return { user };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access, refresh, user } = await this.auth.login(
      dto.email,
      dto.password,
    );
    this.setCookies(res, access, refresh);
    return { user };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Narrow the type of cookies to a known shape
    const cookies = req.cookies as Record<string, unknown> | undefined;

    const refreshToken = cookies?.refreshToken;

    if (typeof refreshToken !== 'string') {
      throw new UnauthorizedException('No refresh token');
    }

    let payload: { sub: string; email: string; role: string };
    try {
      payload = this.jwt.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.auth.validateUserById(payload.sub);
    if (!user) throw new UnauthorizedException('User  not found');

    const access = this.jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' },
    );
    const newRefresh = this.jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' },
    );

    this.setCookies(res, access, newRefresh);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK) // Ensure a 200 OK status is returned
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });
    return { message: 'Logged out successfully' };
  }

  private setCookies(res: Response, access: string, refresh: string) {
    // For development, 'lax' and 'false' are usually fine.
    // For production with different domains, consider 'none' and 'true' (requires HTTPS).
    res.cookie('accessToken', access, {
      httpOnly: true,
      sameSite: 'lax', // Can be 'none' if frontend and backend are different domains and secure: true
      secure: false, // Should be true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie('refreshToken', refresh, {
      httpOnly: true,
      sameSite: 'lax', // Can be 'none' if frontend and backend are different domains and secure: true
      secure: false, // Should be true in production with HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
