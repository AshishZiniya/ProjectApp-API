import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { Task } from 'src/tasks/task.entity';
import { User } from 'src/users/user.entity';
import { CommentsGateway } from './comments.gateway';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly comments: Repository<Comment>,
    @InjectRepository(Task) private readonly tasks: Repository<Task>,
    private readonly commentsGateway: CommentsGateway,
  ) {}

  async create(taskId: string, body: string, user: User): Promise<Comment> {
    const task = await this.tasks.findOneBy({ id: taskId });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    const comment = this.comments.create({ body, task, author: user });
    const savedComment = await this.comments.save(comment); // ✅ await

    // Load relations so frontend has task + author
    const fullComment = await this.comments.findOne({
      where: { id: savedComment.id },
      relations: ['task', 'author'],
    });
    if (!fullComment) {
      throw new Error('Comment was not found after saving');
    }

    // ✅ emit only to the specific task room
    this.commentsGateway.server.to(taskId).emit('newComment', fullComment);

    return fullComment;
  }

  async findByTask(taskId: string): Promise<Comment[]> {
    return this.comments.find({
      where: { task: { id: taskId } },
      relations: ['task', 'author'],
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: string): Promise<void> {
    const result = await this.comments.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    const comment = await this.comments.findOne({
      where: { id },
      relations: ['task'],
    });

    if (comment) {
      this.commentsGateway.server
        .to(comment.task.id)
        .emit('deletedComment', id);
    }
    this.commentsGateway.server.emit('deletedComment', id);
  }
}
