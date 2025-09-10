import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Get()
  list(
    @Query('q') q?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.svc.findAll({ q, page: +page, limit: +limit });
  }

  @Get(':id')
  details(@Param('id') id: string) {
    return this.svc.findone(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<{ name: string; email: string }>,
  ) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
