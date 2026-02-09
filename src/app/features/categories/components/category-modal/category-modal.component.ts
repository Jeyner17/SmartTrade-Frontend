/**
 * Modal de Categoría (Crear/Editar)
 * Sistema de Gestión Comercial
 */

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../../models/category.model';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.css'
})
export class CategoryModalComponent implements OnInit {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() category: Category | null = null; // Para editar o para crear subcategoría
  @Input() allCategories: Category[] = [];
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  categoryForm: FormGroup;
  loading = false;
  availableParents: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private alertService: AlertService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      parentId: [null],
      isActive: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.buildAvailableParents();

    if (this.mode === 'edit' && this.category) {
      // Modo edición: cargar datos existentes
      this.categoryForm.patchValue({
        name: this.category.name,
        description: this.category.description || '',
        parentId: this.category.parentId || null,
        isActive: this.category.isActive
      });
    } else if (this.mode === 'create' && this.category) {
      // Modo crear subcategoría: establecer padre
      this.categoryForm.patchValue({
        parentId: this.category.id
      });
    }
  }

  /**
   * Construir lista de categorías disponibles como padres
   */
  buildAvailableParents(): void {
    this.availableParents = [];
    this.flattenCategories(this.allCategories);

    // Si estamos editando, remover la categoría actual y sus hijos
    if (this.mode === 'edit' && this.category) {
      this.availableParents = this.availableParents.filter(cat => {
        // No puede ser padre de sí misma
        if (cat.id === this.category!.id) return false;
        // No puede ser padre de sus propios ancestros
        if (this.isDescendant(this.category!, cat)) return false;
        return true;
      });
    }
  }

  /**
   * Aplanar árbol de categorías recursivamente
   */
  flattenCategories(categories: Category[], level: number = 0): void {
    categories.forEach(cat => {
      this.availableParents.push({ ...cat, level });
      if (cat.children && cat.children.length > 0) {
        this.flattenCategories(cat.children, level + 1);
      }
    });
  }

  /**
   * Verificar si una categoría es descendiente de otra
   */
  isDescendant(parent: Category, potentialChild: Category): boolean {
    if (!parent.children || parent.children.length === 0) return false;

    for (const child of parent.children) {
      if (child.id === potentialChild.id) return true;
      if (this.isDescendant(child, potentialChild)) return true;
    }

    return false;
  }

  /**
   * Obtener indentación para mostrar jerarquía en el selector
   */
  getIndentation(level: number): string {
    return '—'.repeat(level) + ' ';
  }

  /**
   * Guardar categoría
   */
  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.markFormGroupTouched(this.categoryForm);
      return;
    }

    this.loading = true;
    const formValue = this.categoryForm.value;

    // Convertir parentId null o vacío a null explícito
    const data = {
      ...formValue,
      parentId: formValue.parentId || null
    };

    if (this.mode === 'create') {
      this.createCategory(data);
    } else {
      this.updateCategory(data);
    }
  }

  /**
   * Crear nueva categoría
   */
  private createCategory(data: CreateCategoryDto): void {
    this.categoryService.createCategory(data).subscribe({
      next: () => {
        this.alertService.success('Categoría creada exitosamente');
        this.loading = false;
        this.save.emit();
      },
      error: (error) => {
        console.error('Error al crear categoría:', error);
        const message = error.error?.message || 'Error al crear la categoría';
        this.alertService.error(message);
        this.loading = false;
      }
    });
  }

  /**
   * Actualizar categoría existente
   */
  private updateCategory(data: UpdateCategoryDto): void {
    if (!this.category) return;

    this.categoryService.updateCategory(this.category.id, data).subscribe({
      next: () => {
        this.alertService.success('Categoría actualizada exitosamente');
        this.loading = false;
        this.save.emit();
      },
      error: (error) => {
        console.error('Error al actualizar categoría:', error);
        const message = error.error?.message || 'Error al actualizar la categoría';
        this.alertService.error(message);
        this.loading = false;
      }
    });
  }

  /**
   * Cancelar y cerrar modal
   */
  onCancel(): void {
    this.cancel.emit();
  }

  /**
   * Marcar todos los campos como touched para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Verificar si un campo tiene error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.categoryForm.get(fieldName);
    return !!(field?.hasError(errorType) && field?.touched);
  }

  /**
   * Obtener título del modal
   */
  getTitle(): string {
    if (this.mode === 'create') {
      return this.category
        ? `Nueva Subcategoría de "${this.category.name}"`
        : 'Nueva Categoría';
    }
    return `Editar "${this.category?.name}"`;
  }
}
