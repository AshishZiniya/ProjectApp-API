import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, type UserRole } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

interface AuthResponse {
  access: string;
  refresh: string;
  user: { id: string; email: string; name: string; role: UserRole };
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private users: Repository<User>,
    private jwt: JwtService,
  ) {}

  async register(
    email: string,
    name: string,
    password: string,
    role: UserRole,
  ): Promise<AuthResponse> {
    const existing = await this.users.findOne({ where: { email } });
    if (existing) {
      throw new UnauthorizedException('Email already exists');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = this.users.create({
      email,
      name,
      password: passwordHash,
      role,
    });
    await this.users.save(user);
    const tokens = await this.issueTokens(user);
    user.accessToken = tokens.access;
    await this.users.save(user);
    return tokens;
  }

  async login(email: string, password: string) {
    const user = await this.users
      .createQueryBuilder('u')
      .addSelect('u.password')
      .where('u.email = :email', { email })
      .getOne();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.issueTokens(user);
    user.accessToken = tokens.access;
    await this.users.save(user);
    return tokens;
  }

  async validateUserById(userId: string) {
    const user = await this.users.findOneBy({ id: userId });
    if (!user) {
      console.log('User not found for ID:', userId);
      return null;
    }
    return user;
  }

  private async issueTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
    const refresh = await this.jwt.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return {
      access,
      refresh,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
