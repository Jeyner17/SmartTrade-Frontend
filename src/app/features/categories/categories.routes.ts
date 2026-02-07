/**
 * Rutas del Módulo de Categorías
 * Sistema de Gestión Comercial
 */

import { Routes } from '@angular/router';
import { CategoriesTreeComponent } from './components/categories-tree/categories-tree.component';
import { CategoryProductsComponent } from './components/category-products/category-products.component';

export const categoriesRoutes: Routes = [
  {
    path: '',
    component: CategoriesTreeComponent,
    title: 'Gestión de Categorías'
  },
  {
    path: ':id/products',
    component: CategoryProductsComponent,
    title: 'Productos por Categoría'
  }
];
