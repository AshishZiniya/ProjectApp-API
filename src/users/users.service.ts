import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async findAll({
    q,
    page = 1,
    limit = 10,
  }: {
    q?: string;
    page?: number;
    limit?: number;
  }) {
    const [data, total] = await this.users.findAndCount({
      where: q ? { name: ILike(`%${q}%`) } : {},
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, pages: Math.ceil(total / limit) };
  }

  async findone(id: string) {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw new NotFoundException();
    return user;
  }

  async update(id: string, dto: Partial<User>) {
    await this.users.update({ id }, dto);
    return this.findone(id);
  }

  async remove(id: string) {
    const res = await this.users.delete({ id });
    if (res.affected === 0) throw new NotFoundException();
    return { ok: true };
  }
}
