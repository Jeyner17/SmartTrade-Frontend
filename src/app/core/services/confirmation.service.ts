import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

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
  private confirmationSubject = new Subject<boolean>();

  confirm(config: ConfirmationConfig): Observable<boolean> {
    // Por ahora usar confirm nativo
    // Después podemos mejorarlo con un modal Bootstrap
    const result = window.confirm(`${config.title}\n\n${config.message}`);
    
    const subject = new Subject<boolean>();
    subject.next(result);
    subject.complete();
    
    return subject.asObservable();
  }
}