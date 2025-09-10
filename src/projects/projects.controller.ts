/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly svc: ProjectsService) {}

  @Get()
  list(
    @Query('q') q = '',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.svc.list({ q, page: Number(page), limit: Number(limit) });
  }

  @Post()
  async create(
    @Body() dto: { name: string; description?: string },
    @Req() req: Request & { user?: any },
  ) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User ID not found in token.');
    }

    return this.svc.create(dto, userId); // Pass userId directly, no need for ternary
  }

  @Get(':id')
  details(@Param('id') id: string) {
    return this.svc.details(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<{ name: string; description?: string }>,
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
