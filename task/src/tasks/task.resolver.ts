import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TaskList, CreateTaskInput, UpdateTaskInput } from './task.dto';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@Resolver(() => Task)
export class TaskResolver {
constructor(private readonly service: TaskService) {}


@Query(() => TaskList)
async tasks(
@Args('skip', { type: () => Int, nullable: true }) skip = 0,
@Args('take', { type: () => Int, nullable: true }) take = 20,
): Promise<TaskList> {
const { items, total } = await this.service.findAll(skip, take);
return { items, total };
}


@Query(() => Task)
task(@Args('id', { type: () => ID }) id: string) {
return this.service.findOne(id);
}


@Mutation(() => Task)
createTask(@Args('input') input: CreateTaskInput) {
return this.service.create(input);
}


@Mutation(() => Task)
updateTask(
@Args('id', { type: () => ID }) id: string,
@Args('input') input: UpdateTaskInput,
) {
return this.service.update(id, input);
}


@Mutation(() => Boolean)
removeTask(@Args('id', { type: () => ID }) id: string) {
return this.service.remove(id);
}
}