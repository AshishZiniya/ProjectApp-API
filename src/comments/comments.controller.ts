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

@Controller('comments')
export class CommentsController {
  constructor(private readonly comments: CommentsService) {}

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

  @UseGuards(AuthGuard('jwt'))
  @Get(':taskId/taskId') // Corrected route to match frontend
  async findByTask(@Param('taskId') taskId: string): Promise<Comment[]> {
    return this.comments.findByTask(taskId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.comments.delete(id);
    return { message: 'Comment deleted successfully' };
  }
}
