import { Injectable, ComponentRef, ViewContainerRef, ApplicationRef, createComponent, EnvironmentInjector } from '@angular/core';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private toastComponentRef?: ComponentRef<ToastComponent>;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {
    this.createToastComponent();
  }

  private createToastComponent(): void {
    // Crear el componente dinámicamente
    this.toastComponentRef = createComponent(ToastComponent, {
      environmentInjector: this.injector
    });

    // Adjuntar al DOM
    this.appRef.attachView(this.toastComponentRef.hostView);
    const domElement = (this.toastComponentRef.hostView as any).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElement);
  }

  success(message: string, title: string = 'Éxito'): void {
    this.toastComponentRef?.instance.show({
      type: 'success',
      title,
      message
    });
  }

  error(message: string, title: string = 'Error'): void {
    this.toastComponentRef?.instance.show({
      type: 'error',
      title,
      message
    });
  }

  warning(message: string, title: string = 'Advertencia'): void {
    this.toastComponentRef?.instance.show({
      type: 'warning',
      title,
      message
    });
  }

  info(message: string, title: string = 'Información'): void {
    this.toastComponentRef?.instance.show({
      type: 'info',
      title,
      message
    });
  }
}