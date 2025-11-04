import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, TaskList, Task } from './task.service';
import { TaskFormComponent } from './task-form.component';
import { ToastService } from '../../core/toast.service';


@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent, FormsModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  loading = true;
  data: TaskList = { items: [], total: 0 };

  modalOpen = false;
  editingTask?: Task;

  filterStatus: 'ALL' | 'PENDING' | 'DONE' = 'ALL';
  filterPriority: 'ALL' | Task['priority'] = 'ALL';
  sortBy: 'createdAt' | 'priority' | 'title' = 'createdAt';

  constructor(private svc: TaskService, private toast: ToastService) {}

  ngOnInit() {
    console.log('TaskListComponent inicializado. Carregando tarefas...');
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.modalOpen = false;

    console.log(
      `Aplicando filtros: Status=${this.filterStatus}, Prioridade=${this.filterPriority}, Ordem=${this.sortBy}`
    );

    this.svc.list().subscribe({
      next: (fullData) => {
        let filteredItems = fullData.items;

        // 1. FILTRO POR STATUS
        if (this.filterStatus !== 'ALL') {
          const isDone = this.filterStatus === 'DONE';
          filteredItems = filteredItems.filter((t) => t.done === isDone);
        }

        // 2. FILTRO POR PRIORIDADE
        if (this.filterPriority !== 'ALL') {
          filteredItems = filteredItems.filter(
            (t) => t.priority === this.filterPriority
          );
        }

        // 3. ORDENAÇÃO
        filteredItems = [...filteredItems];

        filteredItems.sort((a, b) => {
          if (this.sortBy === 'createdAt') {
            const dateA = new Date(a.createdAt ?? '').getTime();
            const dateB = new Date(b.createdAt ?? '').getTime();
            return dateB - dateA;
          } else if (this.sortBy === 'priority') {
            const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          } else if (this.sortBy === 'title') {
            return a.title.localeCompare(b.title);
          }
          return 0;
        });

        this.data = { items: filteredItems, total: filteredItems.length };
        this.loading = false;
        console.log(
          `Tarefas carregadas e filtradas. Total visível: ${this.data.items.length}`
        );
      },
      error: (err) => {
        console.error('❌ Erro ao carregar tarefas:', err);
        this.loading = false;
        // 🎯 SUBSTITUÍDO: alert()
        this.toast.show('Não foi possível carregar as tarefas.', 'error', 5000);
      },
    });
  }

  openCreate() {
    this.editingTask = undefined;
    this.modalOpen = true;
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.modalOpen = true;
  }

  toggleDone(task: Task) {
    const newStatus = !task.done;
    this.loading = true;

    const inputForUpdate = { done: newStatus };

    console.log(
      `Tentando atualizar tarefa ID ${task.id}. Novo status 'done': ${newStatus}`
    );
    console.log(
      'Objeto de INPUT sendo enviado ao Service (Apenas done):',
      inputForUpdate
    );

    this.svc.update(task.id, inputForUpdate).subscribe({
      next: () => {
        console.log(`✅ Sucesso! Tarefa ${task.id} atualizada.`);
        // 🎯 SUBSTITUÍDO: alert()
        this.toast.show(
          `Tarefa marcada como ${newStatus ? 'Concluída' : 'Pendente'}!`,
          'success'
        );
        this.refresh();
      },
      error: (err) => {
        console.error(
          '❌ ERRO AO ATUALIZAR STATUS DA TAREFA! Verifique a resposta do servidor:',
          err
        );
        // 🎯 SUBSTITUÍDO: alert()
        this.toast.show('Erro ao atualizar status da tarefa.', 'error');
        this.loading = false;
      },
    });
  }

  confirmDelete(task: Task) {
    // 🎯 SUBSTITUÍDO: confirm()
    // Como não criamos um Modal de Confirmação customizado, vamos manter o 'confirm' nativo,
    // mas substituímos o 'alert' de sucesso por um Toast.

    if (confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
      this.loading = true;
      this.svc.remove(task.id).subscribe({
        next: () => {
          console.log(`Tarefa ${task.id} excluída.`);
          // 🎯 SUBSTITUÍDO: alert()
          this.toast.show(
            `🗑️ Tarefa "${task.title}" excluída com sucesso!`,
            'info'
          );
          this.refresh();
        },
        error: (err) => {
          console.error('❌ Erro ao excluir tarefa:', err);
          // 🎯 SUBSTITUÍDO: alert()
          this.toast.show('Erro ao excluir tarefa.', 'error');
          this.loading = false;
        },
      });
    }
  }
}
