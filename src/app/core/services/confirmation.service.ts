import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ConfirmationConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  confirm(message: string, title?: string): Observable<boolean> {
    // Por ahora usar confirm nativo
    // Después podemos mejorarlo con un modal Bootstrap
    const confirmMessage = title ? `${title}\n\n${message}` : message;
    const result = window.confirm(confirmMessage);

    return of(result);
  }
}
