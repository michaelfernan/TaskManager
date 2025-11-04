import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CreateTaskInput, UpdateTaskInput, TaskPriority } from './task.dto';
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

  /** Permite apenas campos atualizáveis e ignora null/undefined */
  private sanitizeUpdate(input: UpdateTaskInput): Record<string, any> {
    const allowed: (keyof UpdateTaskInput)[] = [
      'title',
      'description',
      'done',
      'priority',
    ];
    const out: Record<string, any> = {};
    for (const k of allowed) {
      const v = input[k];
      if (v !== undefined && v !== null) out[k] = v;
    }
    return out;
  }

  /** Valida enum de prioridade vindo no DTO */
  private ensureValidPriority(priority?: any): TaskPriority | undefined {
    if (priority === undefined) return undefined;
    const values = Object.values(TaskPriority);
    if (!values.includes(priority)) {
      throw new BadRequestException(
        `Invalid priority. Use one of: ${values.join(', ')}`,
      );
    }
    return priority as TaskPriority;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const priority = this.ensureValidPriority(
      input.priority ?? TaskPriority.MEDIUM,
    );

    // Como Mongo + updateOne/save podem não disparar os decorators de data,
    // setamos createdAt/updatedAt por segurança.
    const now = new Date();

    const task = this.repo.create({
      title: input.title,
      description: input.description ?? null,
      done: input.done ?? false,
      priority: priority ?? TaskPriority.MEDIUM,
      createdAt: now,
      updatedAt: now,
    } as Task);

    return await this.repo.save(task);
  }

  async findAll(
    skip = 0,
    take = 20,
  ): Promise<{ items: Task[]; total: number }> {
    const [items, total] = await Promise.all([
      // "entra embaixo": ordena por createdAt ASC
      this.repo.find({ skip, take, order: { createdAt: 'asc' as const } }),
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

    // valida prioridade se vier
    if (input.priority !== undefined) this.ensureValidPriority(input.priority);

    const $set = this.sanitizeUpdate(input);

    // se nada pra atualizar, retorna o existente mesmo
    if (Object.keys($set).length === 0) {
      return existing;
    }

    // garantir updatedAt, pois updateOne não dispara @UpdateDateColumn
    $set.updatedAt = new Date();

    await this.repo.updateOne({ _id } as any, { $set });

    const updated = await this.repo.findOneBy({ _id } as any);
    if (!updated) throw new NotFoundException('Task not found after update');
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    const _id = this.toObjectId(id);
    const res = await this.repo.deleteOne({ _id } as any);
    return (res?.deletedCount ?? 0) > 0;
  }
}
