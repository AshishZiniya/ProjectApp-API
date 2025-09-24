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
  HttpCode,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly svc: TasksService) {}

  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List all tasks with pagination' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(AuthGuard('jwt'))
  @Get('/all')
  Alllist(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.svc.Alllist({
      page: +page,
      limit: +limit,
    });
  }

  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'List tasks with optional project filter and pagination',
  })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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

  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body()
    dto: {
      projectId: string;
      title: string;
      description?: string;
      priority?: number;
      status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
      assigneeId?: string;
      dueDate?: string;
    },
  ) {
    return this.svc.create(dto);
  }

  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<Task>) {
    return this.svc.update(id, dto);
  }

  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.delete(id);
  }
}
