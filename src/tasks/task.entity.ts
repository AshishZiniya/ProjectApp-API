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
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Project, { eager: false }) @Index() project: Project;

  @Column({ length: 160 }) title: string;

  @Column({ type: 'text', nullable: true }) description?: string;

  @Column({ type: 'int', default: 2 }) priority: number;

  @Column({ type: 'boolean', default: false }) completed: boolean;

  @Column({ type: 'date', nullable: true }) dueDate?: Date;

  @ManyToOne(() => User, { eager: false, nullable: true })
  @Index()
  assignedTo?: User;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;
}
