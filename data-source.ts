import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { Project } from './src/projects/project.entity';
import { Task } from './src/tasks/task.entity';
import { Comment } from './src/comments/comment.entity';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Project, Task, Comment],
  migrations: ['src/migration/*.ts'],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    channelBinding: 'require',
  },
});
