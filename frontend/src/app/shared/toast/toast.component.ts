// src/app/shared/toast/toast.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastMessage, ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="message" class="toast-container" [ngClass]="message.type">
      <p class="toast-text">{{ message.text }}</p>
      <button class="close-button" (click)="toastService.clear()">×</button>
    </div>
  `,
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent implements OnInit {
  message: ToastMessage | null = null;

  constructor(public toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toastState.subscribe((msg) => {
      this.message = msg;
    });
  }
}
