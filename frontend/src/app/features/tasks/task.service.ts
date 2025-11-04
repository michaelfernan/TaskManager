import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export type Task = {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt?: string;
};

export type TaskList = { items: Task[]; total: number };

const TASKS = gql`
  query Tasks($skip: Int, $take: Int) {
    tasks(skip: $skip, take: $take) {
      total
      items {
        id
        title
        description
        done
        priority
        createdAt
      }
    }
  }
`;

const TASK = gql`
  query Task($id: ID!) {
    task(id: $id) {
      id
      title
      description
      done
      priority
      createdAt
    }
  }
`;

const CREATE = gql`
  mutation CreateTask($input: CreateTaskInput!) {
    createTask(input: $input) {
      id
      title
      description
      done
      priority
      createdAt
    }
  }
`;

const UPDATE = gql`
  mutation UpdateTask($id: ID!, $input: UpdateTaskInput!) {
    updateTask(id: $id, input: $input) {
      id
      title
      description
      done
      priority
      createdAt
    }
  }
`;

const REMOVE = gql`
  mutation RemoveTask($id: ID!) {
    removeTask(id: $id)
  }
`;

function pickData<T>(res: { data?: T | null } | null | undefined): T {
  const data = res?.data ?? null;
  if (data == null) throw new Error('Resposta GraphQL sem dados.');
  return data;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private apollo: Apollo) {}

  list(skip = 0, take = 20): Observable<TaskList> {
    return this.apollo
      .query<{ tasks: TaskList }>({
        query: TASKS,
        variables: { skip, take },
      })
      .pipe(
        map((res) => {
          if (!res.data?.tasks) throw new Error('Resposta GraphQL sem dados.');
          return res.data.tasks;
        })
      );
  }

  get(id: string): Observable<Task> {
    return this.apollo
      .query<{ task: Task }>({
        query: TASK,
        variables: { id },
      })
      .pipe(
        map((res) => {
          if (!res.data?.task) throw new Error('Resposta GraphQL sem dados.');
          return res.data.task;
        })
      );
  }

  create(input: {
    title: string;
    description?: string;
    priority?: Task['priority'];
  }): Observable<Task> {
    return this.apollo
      .mutate<{ createTask: Task }>({
        mutation: CREATE,
        variables: { input },
        refetchQueries: [{ query: TASKS, variables: { skip: 0, take: 20 } }],
      })
      .pipe(map((res) => pickData<{ createTask: Task }>(res).createTask));
  }

  update(
    id: string,
    input: Partial<Pick<Task, 'title' | 'done' | 'priority' | 'description'>>
  ): Observable<Task> {
    return this.apollo
      .mutate<{ updateTask: Task }>({
        mutation: UPDATE,
        variables: { id, input },
        refetchQueries: [{ query: TASKS, variables: { skip: 0, take: 20 } }],
      })
      .pipe(map((res) => pickData<{ updateTask: Task }>(res).updateTask));
  }

  remove(id: string): Observable<boolean> {
    return this.apollo
      .mutate<{ removeTask: boolean }>({
        mutation: REMOVE,
        variables: { id },
        refetchQueries: [{ query: TASKS, variables: { skip: 0, take: 20 } }],
      })
      .pipe(map((res) => !!pickData<{ removeTask: boolean }>(res).removeTask));
  }
}
