import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CreateTaskInput, UpdateTaskInput } from './task.dto';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly repo: MongoRepository<Task>,
  ) {}

  private toObjectId(id: string): ObjectId {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id: must be a 24-char hex string');
    }
    return new ObjectId(id);
  }

  private sanitizeUpdate(input: UpdateTaskInput): Record<string, any> {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(input)) {
      if (v !== undefined && v !== null) out[k] = v;
    }
    return out;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const task = this.repo.create({ ...input, done: false });
    return await this.repo.save(task);
  }

  async findAll(
    skip = 0,
    take = 20,
  ): Promise<{ items: Task[]; total: number }> {
    const [items, total] = await Promise.all([
      this.repo.find({ skip, take, order: { createdAt: 'desc' as const } }),
      this.repo.count(),
    ]);
    return { items, total };
  }

  async findOne(id: string): Promise<Task> {
    const _id = this.toObjectId(id);
    const task = await this.repo.findOneBy({ _id } as any);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task> {
    const _id = this.toObjectId(id);

    const existing = await this.repo.findOneBy({ _id } as any);
    if (!existing) throw new NotFoundException('Task not found');

    const $set = this.sanitizeUpdate(input);
    if (Object.keys($set).length === 0) {
      return existing;
    }

    await this.repo.updateOne({ _id } as any, { $set });

    // --- aqui está o ajuste ---
    const updated = await this.repo.findOneBy({ _id } as any);
    if (!updated) {
      // extremamente improvável, mas deixa o TS feliz e cobre race conditions
      throw new NotFoundException('Task not found after update');
    }
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    const _id = this.toObjectId(id);
    const res = await this.repo.deleteOne({ _id } as any);
    return (res?.deletedCount ?? 0) > 0;
  }
}
