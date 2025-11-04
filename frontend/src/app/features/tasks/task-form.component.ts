import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core'; // ✅ Adicionado OnInit
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService, Task } from './task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css'],
})
// ✅ Implementado OnInit
export class TaskFormComponent implements OnInit {
  @Input() editing = false;
  @Input() task?: Task;
  @Output() saved = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  loading = false;
  showModal = true;

  // ✅ Tipagem do model corrigida. Garante que 'priority' é um dos literais de string válidos.
  model: { title: string; description: string; priority: Task['priority'] } = {
    title: '',
    description: '',
    priority: 'MEDIUM',
  };

  constructor(private svc: TaskService) {}

  ngOnInit() {
    if (this.task) {
      this.model = {
        title: this.task.title,
        // ✅ 'description' está sendo lida da task (que já foi atualizada no service)
        description: this.task.description ?? '',
        priority: this.task.priority ?? 'MEDIUM',
      };
    }
  }

  save() {
    if (!this.model.title.trim()) {
      alert('Título é obrigatório!');
      return;
    }

    this.loading = true;
    const operation$ =
      this.editing && this.task
        ? this.svc.update(this.task.id, this.model)
        : this.svc.create(this.model);

    operation$.subscribe({
      next: () => {
        this.loading = false;
        alert(this.editing ? 'Tarefa atualizada!' : 'Tarefa criada!');
        this.saved.emit();
        this.closeModal();
      },
      error: () => {
        alert('Erro ao salvar tarefa.');
        this.loading = false;
      },
    });
  }

  closeModal() {
    this.showModal = false;
    this.closed.emit();
  }
}
