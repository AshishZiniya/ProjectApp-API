import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Project } from './projects/project.entity';
import { Task } from './tasks/task.entity';
import { Comment } from './comments/comment.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ep-billowing-shadow-a8nd5657-pooler.eastus2.azure.neon.tech',
      username: 'neondb_owner',
      password: 'npg_ptn5e3CYmIUR',
      database: 'neondb',
      entities: [User, Project, Task, Comment],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false, // required for Neon cloud connections
      },
      extra: {
        channelBinding: 'require', // maps to channel_binding=require
      },
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
    CommentsModule,
  ],
})
export class AppModule {}
