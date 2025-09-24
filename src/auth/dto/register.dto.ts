import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import type { UserRole } from 'src/users/user.entity';

export class RegisterDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User name' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ description: 'User password' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User role',
    enum: ['USER', 'ADMIN', 'SUPERADMIN'],
    default: 'USER',
  })
  @IsString()
  role: UserRole;
}
