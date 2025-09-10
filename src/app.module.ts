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
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 6543,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Project, Task, Comment],
      synchronize: false, // never use true in production
      ssl: {
        rejectUnauthorized: false, // required for Supabase
      },
      extra: {
        // Optional but recommended for cloud connections
        channelBinding: 'require',
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
