import { ApiProperty } from '@nestjs/swagger';
import { Task } from 'src/tasks/task.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'comments' })
export class Comment {
  @ApiProperty({
    description: 'Unique identifier for the comment',
    example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'The task associated with the comment',
    type: () => Task,
  })
  @ManyToOne(() => Task, { onDelete: 'CASCADE' })
  task: Task;

  @ApiProperty({
    description: 'The author of the comment',
    type: () => User,
  })
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  author: User;

  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a comment on the task.',
  })
  @Column({ type: 'text' })
  body: string;

  @ApiProperty({
    description: 'Timestamp when the comment was created',
    example: '2023-10-01T12:34:56.789Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the comment was last updated',
    example: '2023-10-02T12:34:56.789Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
