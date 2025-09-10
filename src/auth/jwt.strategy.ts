import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-jwt';
import type { JwtFromRequestFunction } from 'passport-jwt';
import type { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    const jwtSecret: string | undefined = process.env.JWT_ACCESS_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_ACCESS_SECRET environment variable is not set');
    }

    const cookieExtractor: JwtFromRequestFunction = (
      req: Request | undefined,
    ): string | null => {
      if (!req) {
        return null;
      }
      const cookies = req.cookies as Record<string, unknown> | undefined;
      if (typeof cookies?.['accessToken'] === 'string') {
        return cookies['accessToken'];
      }
      return null;
    };

    const options: StrategyOptions = {
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    };

    super(options);
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.authService.validateUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
