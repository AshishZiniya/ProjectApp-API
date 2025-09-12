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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('projects')
@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly svc: ProjectsService) {}

  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'List projects with optional search and pagination',
  })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Get()
  list(
    @Query('q') q = '',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.svc.list({ q, page: Number(page), limit: Number(limit) });
  }

  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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

  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get project details by ID' })
  @ApiResponse({ status: 200, description: 'Project details retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @Get(':id')
  details(@Param('id') id: string) {
    return this.svc.details(id);
  }

  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update a project by ID' })
  @ApiResponse({ status: 200, description: 'Project updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<{ name: string; description?: string }>,
  ) {
    return this.svc.update(id, dto);
  }

  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Delete a project by ID' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
