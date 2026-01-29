import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {
  toasts: ToastMessage[] = [];

  show(toast: Omit<ToastMessage, 'id'>): void {
    const id = Date.now().toString();
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration: toast.duration || 3000
    };

    this.toasts.push(newToast);

    // Auto-remover después del duration
    setTimeout(() => {
      this.remove(id);
    }, newToast.duration);
  }

  remove(id: string): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getIconClass(type: string): string {
    const icons: Record<string, string> = {
      success: 'bi-check-circle-fill',
      error: 'bi-x-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill'
    };
    return icons[type] || icons['info'];
  }

  getAlertClass(type: string): string {
    const classes: Record<string, string> = {
      success: 'alert-success',
      error: 'alert-danger',
      warning: 'alert-warning',
      info: 'alert-info'
    };
    return classes[type] || classes['info'];
  }
}