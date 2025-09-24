import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type UserRole = 'USER' | 'ADMIN';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({
    description: 'User ID',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User email' })
  @Column({ unique: true, length: 160 })
  email: string;

  @ApiProperty({ description: 'User password', example: 'strongPassword@123' })
  @Column({ select: false })
  password: string;

  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  @Column({ length: 120 })
  name: string;

  @ApiProperty({
    description: 'User role',
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  })
  @Column({ type: 'enum', enum: ['USER', 'ADMIN'], default: 'USER' })
  role: UserRole;

  @ApiProperty({ description: 'Account creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Password reset token' })
  @Column({ nullable: true })
  resetToken?: string;

  @ApiProperty({ description: 'Password reset token expiry' })
  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry?: Date;

  @ApiProperty({ description: 'Account last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}
