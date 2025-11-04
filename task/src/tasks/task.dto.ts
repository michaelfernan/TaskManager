// task.dto.ts
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Task } from './task.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TaskPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}
registerEnumType(TaskPriority, { name: 'TaskPriority' });

@InputType()
export class CreateTaskInput {
  @Field()
  @IsString()
  @Length(1, 120)
  @ApiProperty({ minLength: 1, maxLength: 120 })
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @ApiPropertyOptional({ maxLength: 1000 })
  description?: string;

  @Field(() => TaskPriority, { nullable: true, defaultValue: TaskPriority.MEDIUM })
  @IsOptional()
  @IsEnum(TaskPriority)
  @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority?: TaskPriority;

  // opcional: permitir criar já concluída (se você quiser)
  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({ default: false })
  done?: boolean;
}

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 120)
  @ApiPropertyOptional({ minLength: 1, maxLength: 120 })
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @ApiPropertyOptional({ maxLength: 1000 })
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  done?: boolean;

  @Field(() => TaskPriority, { nullable: true })
  @IsOptional()
  @IsEnum(TaskPriority)
  @ApiPropertyOptional({ enum: TaskPriority })
  priority?: TaskPriority;
}

@ObjectType()
export class TaskList {
  @Field(() => [Task])
  @ApiProperty({ type: () => [Task] })
  items: Task[];

  @Field()
  @ApiProperty()
  total: number;
}
