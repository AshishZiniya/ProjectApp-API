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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly jwt: JwtService,
  ) {}

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Current user retrieved successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access, refresh, user } = await this.auth.register(
      dto.email,
      dto.name,
      dto.password,
      dto.role,
    );
    this.setCookies(res, access, refresh);
    return { user };
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Narrow the type of cookies to a known shape
    const cookies = req.cookies as Record<string, unknown> | undefined;

    const refreshToken = cookies?.refreshToken;

    console.log('Refresh Token:', refreshToken);

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
    if (!user) throw new UnauthorizedException('User not found');

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

  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  @Post('logout')
  @HttpCode(HttpStatus.OK) // Ensure a 200 OK status is returned
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return { message: 'Logged out successfully' };
  }

  private setCookies(res: Response, access: string, refresh: string) {
    const isProduction = process.env.NODE_ENV === 'production';
    const domain = isProduction ? 'project-app-indol.vercel.app' : undefined;
    const sameSite: 'none' | 'lax' = isProduction ? 'none' : 'lax';
    const secure = isProduction;

    res.cookie('accessToken', access, {
      httpOnly: true,
      sameSite,
      secure,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain,
    });
    res.cookie('refreshToken', refresh, {
      httpOnly: true,
      sameSite,
      secure,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain,
    });
  }
}
