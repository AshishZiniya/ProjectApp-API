// comments.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Delete,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { User } from 'src/users/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

  @ApiOperation({ summary: 'Create a comment for a task' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully.',
    type: Comment,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard('jwt'))
  @Post(':taskId')
  async create(
    @Param('taskId') taskId: string,
    @Body('body') body: string,
    @Req() req: Request, // Get the request to access the authenticated user
  ): Promise<Comment> {
    const user = req?.user as User; // Assuming req.user contains the authenticated user
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    return this.comments.create(taskId, body, user);
  }

  @ApiOperation({ summary: 'Get comments for a specific task' })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully.',
    type: [Comment],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard('jwt'))
  @Get('task/:taskId')
  async findByTask(@Param('taskId') taskId: string): Promise<Comment[]> {
    return this.comments.findByTask(taskId);
  }

  @ApiOperation({ summary: 'Delete a comment by ID' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Comment not found.' })
  @ApiBearerAuth('JWT')
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.comments.delete(id);
    return { message: 'Comment deleted successfully' };
  }
}
