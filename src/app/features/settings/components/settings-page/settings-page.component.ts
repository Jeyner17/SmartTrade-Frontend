import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';
import { AlertService } from '../../../../core/services/alert.service';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { ConfirmationService } from '../../../../core/services/confirmation.service';

import {
  SystemConfiguration
} from '../../models/settings.model';
import { COUNTRIES, CURRENCIES, TAX_REGIMES, BACKUP_FREQUENCIES, DATE_FORMATS, TIME_FORMATS } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoaderComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.css'
})
export class SettingsPageComponent implements OnInit {
  // Estados de carga
  isLoading = false;
  isSaving = false;

  // Formularios
  companyForm!: FormGroup;
  fiscalForm!: FormGroup;
  businessForm!: FormGroup;
  technicalForm!: FormGroup;
  backupForm!: FormGroup;

  // Logo
  currentLogo: string | null = null;
  selectedFile: File | null = null;
  logoPreview: string | null = null;

  // Datos para selects
  countries = Object.entries(COUNTRIES).map(([code, name]) => ({ code, name }));
  currencies = Object.entries(CURRENCIES).map(([code, info]) => ({ 
    code: code, 
    symbol: info.symbol, 
    name: info.name 
  }));
  taxRegimes = Array.from(TAX_REGIMES);
  backupFrequencies = [
    { value: 'daily', label: 'Diario' },
    { value: 'weekly', label: 'Semanal' },
    { value: 'monthly', label: 'Mensual' }
  ];
  dateFormats = Object.keys(DATE_FORMATS);
  timeFormats = Array.from(Object.values(TIME_FORMATS));

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService

  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadConfiguration();
  }


  /**
   * Inicializar todos los formularios
   */
  private initializeForms(): void {
    // Formulario de Empresa
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      ruc: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(7)]],
      email: ['', [Validators.required, Validators.email]]
    });

    // Formulario Fiscal
    this.fiscalForm = this.fb.group({
      country: ['EC', Validators.required],
      currency: ['USD', Validators.required],
      taxRegime: ['Régimen General', Validators.required],
      ivaPercentage: [15, [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    // Formulario de Negocio
    this.businessForm = this.fb.group({
      minStock: [10, [Validators.required, Validators.min(0)]],
      defaultCreditDays: [30, [Validators.required, Validators.min(0)]],
      maxDiscountPercentage: [20, [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    // Formulario Técnico
    this.technicalForm = this.fb.group({
      sessionTimeoutMinutes: [120, [Validators.required, Validators.min(15)]],
      logRetentionDays: [90, [Validators.required, Validators.min(7)]],
      dateFormat: ['DD/MM/YYYY', Validators.required],
      timeFormat: ['24h', Validators.required]
    });

    // Formulario de Backups
    this.backupForm = this.fb.group({
      enabled: [true, Validators.required],
      frequency: ['daily', Validators.required],
      time: ['02:00', [Validators.required, Validators.pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)]]
    });
  }

  /**
   * Cargar configuración del servidor
   */
  loadConfiguration(): void {
    this.isLoading = true;

    this.settingsService.getAllConfiguration().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.populateForms(response.data);
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar configuración:', error);
        this.alertService.error('Error al cargar la configuración');
        this.isLoading = false;
      }
    });
  }

  /**
   * Poblar formularios con datos del servidor
   */
  private populateForms(config: SystemConfiguration): void {
    // Empresa
    if (config.company) {
      this.companyForm.patchValue(config.company);
      this.currentLogo = config.company.logo;
    }

    // Fiscal
    if (config.fiscal) {
      this.fiscalForm.patchValue(config.fiscal);
    }

    // Negocio
    if (config.business) {
      this.businessForm.patchValue(config.business);
    }

    // Técnico
    if (config.technical) {
      this.technicalForm.patchValue(config.technical);
    }

    // Backup
    if (config.backup) {
      this.backupForm.patchValue(config.backup);
    }
  }

saveAllConfiguration(): void {
  if (!this.validateAllForms()) {
    this.alertService.error('Por favor corrija los errores en el formulario');
    return;
  }

  this.isSaving = true;

  const configData = {
    company: this.companyForm.value,
    fiscal: this.fiscalForm.value,
    business: this.businessForm.value,
    technical: this.technicalForm.value
  };

  this.settingsService.updateConfiguration(configData).subscribe({
    next: (response) => {
      if (response.success) {
        this.alertService.success('Configuración guardada exitosamente');
        if (this.selectedFile) this.uploadLogo();
      }
    },
    error: (error) => {
      const errors = error?.error?.errors;

      if (errors?.length) {
        const message = errors
          .map((err: any) => `${err.field || 'Campo'}: ${err.message}`)
          .join('\n');
        this.alertService.error(`Errores de validación:\n${message}`);
      } else {
        this.alertService.error('Error al guardar la configuración');
      }
    },
    complete: () => {
      this.isSaving = false;
    }
  });
}

  
  /**
   * Validar todos los formularios
   */
  private validateAllForms(): boolean {
    this.companyForm.markAllAsTouched();
    this.fiscalForm.markAllAsTouched();
    this.businessForm.markAllAsTouched();
    this.technicalForm.markAllAsTouched();
    this.backupForm.markAllAsTouched();

    return this.companyForm.valid &&
           this.fiscalForm.valid &&
           this.businessForm.valid &&
           this.technicalForm.valid &&
           this.backupForm.valid;
  }

  /**
   * Manejar selección de archivo de logo
   */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.alertService.error('Formato de imagen no válido. Use JPG o PNG');
        return;
      }

      // Validar tamaño (2MB)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        this.alertService.error('El archivo es demasiado grande. Máximo 2MB');
        return;
      }

      this.selectedFile = file;

      // Mostrar preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Subir logo al servidor
   */
  uploadLogo(): void {
    if (!this.selectedFile) {
      this.isSaving = false;
      return;
    }

    this.settingsService.uploadLogo(this.selectedFile).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.currentLogo = response.data.logoUrl;
          this.logoPreview = null;
          this.selectedFile = null;
          this.alertService.success('Logo actualizado exitosamente');
        }
        this.isSaving = false;
      },
      error: (error) => {
        console.error('Error al subir logo:', error);
        this.alertService.error('Error al subir el logo');
        this.isSaving = false;
      }
    });
  }

  /**
   * Cancelar selección de logo
   */
  cancelLogoSelection(): void {
    this.selectedFile = null;
    this.logoPreview = null;
  }

  /**
   * Configurar backups
   */
  saveBackupConfiguration(): void {
    if (!this.backupForm.valid) {
      this.backupForm.markAllAsTouched();
      this.alertService.error('Por favor corrija los errores en la configuración de backup');
      return;
    }

    const backupConfig = this.backupForm.value;

    this.settingsService.configureBackups(backupConfig).subscribe({
      next: (response) => {
        if (response.success) {
          this.alertService.success('Configuración de backups guardada exitosamente');
        }
      },
      error: (error) => {
        console.error('Error al configurar backups:', error);
        this.alertService.error('Error al configurar backups');
      }
    });
  }

  /**
   * Helper para obtener FormControl de un FormGroup
   */
  getControl(form: FormGroup, fieldName: string): FormControl {
    return form.get(fieldName) as FormControl;
  }

  /**
   * Helper para verificar errores en campos
   */
  hasError(form: FormGroup, field: string, error: string): boolean {
    const control = form.get(field);
    return !!(control && control.hasError(error) && control.touched);
  }

  /**
   * Helper para obtener mensaje de error
   */
  getErrorMessage(form: FormGroup, field: string): string {
    const control = form.get(field);
    
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (control.hasError('email')) {
      return 'Email inválido';
    }

    if (control.hasError('minlength')) {
      const minLength = control.errors['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }

    if (control.hasError('maxlength')) {
      const maxLength = control.errors['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }

    if (control.hasError('min')) {
      const min = control.errors['min'].min;
      return `Valor mínimo: ${min}`;
    }

    if (control.hasError('max')) {
      const max = control.errors['max'].max;
      return `Valor máximo: ${max}`;
    }

    if (control.hasError('pattern')) {
      return 'Formato inválido';
    }

    return 'Campo inválido';
  }

  /**
   * Helper para verificar si un campo es válido
   */
  isFieldValid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control && control.valid && control.touched);
  }

  /**
   * Helper para verificar si un campo es inválido
   */
  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}