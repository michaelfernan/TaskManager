import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, TaskList, Task } from './task.service';
import { TaskFormComponent } from './task-form.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
 imports: [CommonModule, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  loading = true;
  data: TaskList = { items: [], total: 0 };

  modalOpen = false;
  editingTask?: Task;

  constructor(private svc: TaskService) {}

  ngOnInit() {
    this.refresh();
  }


  refresh() {
    this.loading = true;
    this.modalOpen = false;

    this.svc.list().subscribe({
      next: (data) => {
        this.data = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar tarefas:', err);
        this.loading = false;
        alert('Erro ao carregar a lista de tarefas.');
      },
    });
  }
  openCreate() {
    this.editingTask = undefined;
    this.modalOpen = true;
  }

  /**
   * Abre o modal para editar uma tarefa existente.
   * @param task A tarefa a ser editada.
   */
  editTask(task: Task) {
    this.editingTask = task;
    this.modalOpen = true;
  }

  /**
   * Solicita confirmação e remove a tarefa.
   * @param task A tarefa a ser removida.
   */
  confirmDelete(task: Task) {
    if (confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
      this.loading = true;
      this.svc.remove(task.id).subscribe({
        next: () => {
          alert('Tarefa excluída!');
          this.refresh();
        },
        error: () => {
          alert('Erro ao excluir tarefa.');
          this.loading = false;
        },
      });
    }
  }
}
