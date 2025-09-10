// tasks.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
export class TasksController {
  constructor(private readonly svc: TasksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/all')
  Alllist(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.svc.Alllist({
      page: +page,
      limit: +limit,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  list(
    @Query('projectId') projectId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.svc.list({
      projectId,
      page: +page,
      limit: +limit,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Post()
  create(
    @Body()
    dto: {
      projectId: string;
      title: string;
      description?: string;
      priority?: number;
      assignedId: string;
      dueDate: string;
    },
  ) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<Task>) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.delete(id);
  }
}
