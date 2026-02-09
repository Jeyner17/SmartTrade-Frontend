/**
 * Modelos e Interfaces de Categorías
 * Sistema de Gestión Comercial
 */

export interface Category {
  id: number;
  name: string;
  description?: string;
  parentId?: number;
  level: number;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
  parent?: CategoryParent;
  path?: CategoryBreadcrumb[];
}

export interface CategoryParent {
  id: number;
  name: string;
  level: number;
}

export interface CategoryBreadcrumb {
  id: number;
  name: string;
  level: number;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  parentId?: number;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  parentId?: number;
  isActive?: boolean;
}

export interface CategoryProduct {
  id: number;
  name: string;
  code: string;
  price: number;
  stock: number;
}

export interface CategoryProductsResponse {
  category: Category;
  products: CategoryProduct[];
  breadcrumb: CategoryBreadcrumb[];
  totalProducts: number;
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category | Category[];
}
