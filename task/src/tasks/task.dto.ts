import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Task } from './task.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
