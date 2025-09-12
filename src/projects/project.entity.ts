import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'projects' })
export class Project {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Name of the project',
    example: 'My Awesome Project',
  })
  @Column({ length: 160 })
  name: string;

  @ApiProperty({
    description: 'Detailed description of the project',
    example: 'This project is intended to revolutionize the tech industry.',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Owner of the project',
    type: () => User,
  })
  @ManyToOne(() => User, { eager: true })
  owner: User;

  @ApiProperty({
    description: 'Timestamp when the project was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the project was last updated',
    example: '2023-01-02T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
