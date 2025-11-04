// src/app/shared/toast.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  text: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<ToastMessage | null>();
  toastState = this.toastSubject.asObservable();

  show(text: string, type: ToastType = 'info', duration: number = 3000) {
    this.toastSubject.next({ text, type });

    setTimeout(() => {
      this.toastSubject.next(null);
    }, duration);
  }

  clear() {
    this.toastSubject.next(null);
  }
}
