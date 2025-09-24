import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/projects/project.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tasks' })
export class Task {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Project to which the task belongs',
    type: () => Project,
  })
  @ManyToOne(() => Project, { eager: false })
  @Index()
  project: Project;

  @ApiProperty({
    description: 'Title of the task',
    example: 'Implement authentication module',
  })
  @Column({ length: 160 })
  title: string;

  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'The authentication module should support OAuth2 and JWT.',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Priority of the task (1 = High, 2 = Medium, 3 = Low)',
    example: 2,
    default: 2,
  })
  @Column({ type: 'int', default: 2 })
  priority: number;

  @ApiProperty({
    description: 'Status of the task',
    example: 'TODO',
    default: 'TODO',
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
  })
  @Column({
    type: 'enum',
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    default: 'TODO',
  })
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';

  @ApiProperty({
    description: 'Due date of the task',
    example: '2023-12-31',
    required: false,
  })
  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  @ApiProperty({
    description: 'User to whom the task is assigned',
    type: () => User,
    required: false,
  })
  @ManyToOne(() => User, { eager: false, nullable: true })
  @Index()
  assignedTo?: User;

  @ApiProperty({
    description: 'Timestamp when the task was created',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the task was last updated',
    example: '2023-01-02T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
