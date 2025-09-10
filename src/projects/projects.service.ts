import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ILike, Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private projects: Repository<Project>,
    @InjectRepository(User) private users: Repository<User>,
  ) {}

  async list({
    q,
    page = 1,
    limit = 10,
  }: {
    q?: string;
    page?: number;
    limit?: number;
  }) {
    const [data, total] = await this.projects.findAndCount({
      where: q ? { name: ILike(`%${q}%`) } : {},
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, pages: Math.ceil(total / limit) };
  }

  async create(dto: { name: string; description?: string }, ownerId: string) {
    const owner = await this.users.findOneBy({ id: ownerId });

    if (!owner) {
      throw new Error('Owner not found');
    }

    return this.projects.save(this.projects.create({ ...dto, owner }));
  }

  async details(id: string) {
    const proj = await this.projects.findOne({ where: { id } });
    if (!proj) throw new NotFoundException();
    return proj;
  }

  async update(id: string, dto: Partial<Project>) {
    await this.projects.update({ id }, dto);
    return this.details(id);
  }

  async remove(id: string) {
    await this.projects.delete({ id });
    return { ok: true };
  }
}
