import { ObjectId } from 'mongodb';
import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';


@ObjectType()
@Entity('tasks')
export class Task {
@Field(() => ID)
@ObjectIdColumn()
id: ObjectId;


@Field()
@Column()
title: string;


@Field({ nullable: true })
@Column({ nullable: true })
description?: string;


@Field()
@Column({ default: false })
done: boolean;


@Field()
@CreateDateColumn({ type: 'timestamp' })
createdAt: Date;


@Field()
@UpdateDateColumn({ type: 'timestamp' })
updatedAt: Date;
}