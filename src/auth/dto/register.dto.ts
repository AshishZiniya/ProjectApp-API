import { IsEmail, IsString, MinLength } from 'class-validator';
import type { UserRole } from 'src/users/user.entity';

export class RegisterDto {
  @IsEmail() email: string;
  @IsString() @MinLength(3) name: string;
  @IsString() @MinLength(8) password: string;
  @IsString() role: UserRole;
}
