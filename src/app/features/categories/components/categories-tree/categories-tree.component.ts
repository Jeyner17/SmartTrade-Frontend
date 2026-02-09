/**
 * Componente de Árbol de Categorías
 * Sistema de Gestión Comercial
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';
import { AlertService } from '../../../../core/services/alert.service';
import { ConfirmationService } from '../../../../core/services/confirmation.service';
import { CategoryModalComponent } from '../category-modal/category-modal.component';

@Component({
  selector: 'app-categories-tree',
  standalone: true,
  imports: [CommonModule, CategoryModalComponent],
  templateUrl: './categories-tree.component.html',
  styleUrl: './categories-tree.component.css'
})
export class CategoriesTreeComponent implements OnInit {
  categories: Category[] = [];
  expandedCategories: Set<number> = new Set();
  loading = false;
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedCategory: Category | null = null;
  filterStatus: 'active' | 'inactive' | 'all' = 'active';

  constructor(
    private categoryService: CategoryService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  /**
   * Cargar categorías desde el backend
   */
  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories(this.filterStatus).subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.alertService.error('Error al cargar categorías');
        this.loading = false;
      }
    });
  }

  /**
   * Cambiar filtro de estado
   */
  onFilterChange(status: 'active' | 'inactive' | 'all'): void {
    this.filterStatus = status;
    this.loadCategories();
  }

  /**
   * Expandir/Colapsar categoría
   */
  toggleExpand(categoryId: number): void {
    if (this.expandedCategories.has(categoryId)) {
      this.expandedCategories.delete(categoryId);
    } else {
      this.expandedCategories.add(categoryId);
    }
  }

  /**
   * Verificar si una categoría está expandida
   */
  isExpanded(categoryId: number): boolean {
    return this.expandedCategories.has(categoryId);
  }

  /**
   * Abrir modal para crear nueva categoría
   */
  openCreateModal(parent?: Category): void {
    this.modalMode = 'create';
    this.selectedCategory = parent || null;
    this.showModal = true;
  }

  /**
   * Abrir modal para editar categoría
   */
  openEditModal(category: Category): void {
    this.modalMode = 'edit';
    this.selectedCategory = category;
    this.showModal = true;
  }

  /**
   * Cerrar modal
   */
  closeModal(): void {
    this.showModal = false;
    this.selectedCategory = null;
  }

  /**
   * Callback cuando se guarda el modal
   */
  onModalSave(): void {
    this.closeModal();
    this.loadCategories();
  }

  /**
   * Cambiar estado de categoría (activar/desactivar)
   */
  toggleStatus(category: Category, event: Event): void {
    event.stopPropagation();

    console.log('toggleStatus called for category:', category.name);

    const newStatus = !category.isActive;
    const action = newStatus ? 'activar' : 'desactivar';

    console.log('Showing confirmation dialog...');

    this.confirmationService.confirm(
      `¿Está seguro que desea ${action} la categoría "${category.name}"?`,
      `${action.charAt(0).toUpperCase() + action.slice(1)} Categoría`
    ).subscribe({
      next: (confirmed) => {
        console.log('Confirmation result:', confirmed);
        if (confirmed) {
          console.log('Calling toggleCategoryStatus service...');
          this.categoryService.toggleCategoryStatus(category.id, newStatus).subscribe({
            next: (response) => {
              console.log('Toggle status success:', response);
              this.alertService.success(`Categoría ${action}da exitosamente`);

              // Cambiar filtro a "all" para que el usuario vea la categoría después del cambio
              if (this.filterStatus !== 'all') {
                this.filterStatus = 'all';
              }

              this.loadCategories();
            },
            error: (error) => {
              console.error('Error al cambiar estado:', error);
              this.alertService.error(`Error al ${action} la categoría`);
            }
          });
        } else {
          console.log('User cancelled the action');
        }
      },
      error: (error) => {
        console.error('Error in confirmation observable:', error);
      }
    });
  }

  /**
   * Eliminar categoría
   */
  deleteCategory(category: Category, event: Event): void {
    event.stopPropagation();

    console.log('deleteCategory called for category:', category.name);

    this.confirmationService.confirm(
      `¿Está seguro que desea eliminar la categoría "${category.name}"?\nEsta acción no se puede deshacer.`,
      'Eliminar Categoría'
    ).subscribe({
      next: (confirmed) => {
        console.log('Delete confirmation result:', confirmed);
        if (confirmed) {
          console.log('Calling deleteCategory service...');
          this.categoryService.deleteCategory(category.id).subscribe({
            next: (response) => {
              console.log('Delete success:', response);
              this.alertService.success('Categoría eliminada exitosamente');
              this.loadCategories();
            },
            error: (error) => {
              console.error('Error al eliminar categoría:', error);
              if (error.error?.message) {
                this.alertService.error(error.error.message);
              } else {
                this.alertService.error('Error al eliminar la categoría');
              }
            }
          });
        } else {
          console.log('User cancelled delete');
        }
      },
      error: (error) => {
        console.error('Error in delete confirmation observable:', error);
      }
    });
  }

  /**
   * Ver productos de una categoría
   */
  viewProducts(category: Category, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/categories', category.id, 'products']);
  }

  /**
   * Obtener clase CSS según el estado
   */
  getStatusClass(isActive: boolean): string {
    return isActive ? 'status-active' : 'status-inactive';
  }

  /**
   * Obtener clase CSS según el nivel
   */
  getLevelClass(level: number): string {
    return `level-${level}`;
  }
}
