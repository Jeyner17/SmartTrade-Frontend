/**
 * Componente de Productos por Categoría
 * Sistema de Gestión Comercial
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { CategoryProductsResponse, CategoryBreadcrumb, CategoryProduct } from '../../models/category.model';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-products.component.html',
  styleUrl: './category-products.component.css'
})
export class CategoryProductsComponent implements OnInit {
  categoryId: number = 0;
  categoryName: string = '';
  breadcrumb: CategoryBreadcrumb[] = [];
  products: CategoryProduct[] = [];
  totalProducts: number = 0;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      if (this.categoryId) {
        this.loadProducts();
      }
    });
  }

  /**
   * Cargar productos de la categoría
   */
  loadProducts(): void {
    this.loading = true;
    this.categoryService.getProductsByCategory(this.categoryId).subscribe({
      next: (data: CategoryProductsResponse) => {
        this.categoryName = data.category.name;
        this.breadcrumb = data.breadcrumb || [];
        this.products = data.products || [];
        this.totalProducts = data.totalProducts || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.alertService.error('Error al cargar productos de la categoría');
        this.loading = false;
      }
    });
  }

  /**
   * Volver a la vista de categorías
   */
  goBack(): void {
    this.router.navigate(['/categories']);
  }

  /**
   * Navegar a una categoría del breadcrumb
   */
  navigateToCategory(categoryId: number): void {
    this.router.navigate(['/categories', categoryId, 'products']);
  }

  /**
   * Formatear precio
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }
}
