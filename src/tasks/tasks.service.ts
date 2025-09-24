import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { Project } from 'src/projects/project.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private tasks: Repository<Task>,
    @InjectRepository(Project) private project: Repository<Project>,
    @InjectRepository(User) private user: Repository<User>,
  ) {}

  // tasks.service.ts
  async Alllist({ page, limit }: { page: number; limit: number }) {
    const [data, total] = await this.tasks.findAndCount({
      relations: ['project'], // Still include project relation for context
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, pages: Math.ceil(total / limit) };
  }

  async list({
    projectId,
    page,
    limit,
  }: {
    projectId: string;
    page: number;
    limit: number;
  }) {
    const [data, total] = await this.tasks.findAndCount({
      where: { project: { id: projectId } },
      relations: ['project'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasks.findOne({
      where: { id },
      relations: ['project', 'assignedTo'], // Include related entities
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async create(dto: {
    projectId: string;
    title: string;
    description?: string;
    priority?: number;
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
    assigneeId?: string;
    dueDate?: string;
  }) {
    const project = await this.project.findOneByOrFail({ id: dto.projectId });
    const assignee = dto.assigneeId
      ? await this.user.findOneBy({ id: dto.assigneeId })
      : null;
    const task = this.tasks.create({
      ...dto,
      project,
      assignedTo: assignee ?? undefined,
    });
    return this.tasks.save(task);
  }

  async update(id: string, dto: Partial<Task>) {
    const existing = await this.tasks.findOneBy({ id });
    if (!existing) throw new NotFoundException();
    Object.assign(existing, dto);
    return this.tasks.save(existing);
  }

  async delete(id: string) {
    await this.tasks.delete({ id });
    return { ok: true };
  }
}
