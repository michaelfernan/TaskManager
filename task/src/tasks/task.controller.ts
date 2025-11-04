import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, HttpCode, HttpStatus, BadRequestException
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskInput, UpdateTaskInput, TaskList } from './task.dto';
import { Task } from './task.entity';
import { ObjectId } from 'mongodb';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Post()
  @ApiCreatedResponse({ type: Task })
  async create(@Body() input: CreateTaskInput): Promise<Task> {
    return this.service.create(input);
  }

  @Get()
  @ApiOkResponse({ type: TaskList })
  @ApiQuery({ name: 'skip', type: Number, required: false, example: 0 })
  @ApiQuery({ name: 'take', type: Number, required: false, example: 20 })
  async findAll(@Query('skip') skip = 0, @Query('take') take = 20): Promise<TaskList> {
    const s = Number(skip) || 0;
    const t = Math.min(Number(take) || 20, 100);
    return this.service.findAll(s, t);
  }

  @Get(':id')
  @ApiOkResponse({ type: Task })
  @ApiParam({ name: 'id', type: String, example: '690a2502a861cd1657a99693' })
  async findOne(@Param('id') id: string): Promise<Task> {
    if (!ObjectId.isValid(id)) throw new BadRequestException('Invalid id');
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Task })
  @ApiParam({ name: 'id', type: String })
  async update(@Param('id') id: string, @Body() input: UpdateTaskInput): Promise<Task> {
    if (!ObjectId.isValid(id)) throw new BadRequestException('Invalid id');
    return this.service.update(id, input);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: 'Deleted' })
  @ApiParam({ name: 'id', type: String })
  async remove(@Param('id') id: string): Promise<void> {
    if (!ObjectId.isValid(id)) throw new BadRequestException('Invalid id');
    const ok = await this.service.remove(id);
    if (!ok) throw new BadRequestException('Nothing deleted (id not found)');
  }
}
