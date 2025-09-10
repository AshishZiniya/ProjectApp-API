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
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Task, { onDelete: 'CASCADE' }) task: Task;
  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' }) author: User;
  @Column({ type: 'text' }) body: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
