# Módulo de Categorías - Frontend

## 📋 Descripción

Módulo frontend completo para la gestión de categorías y subcategorías de productos en Angular. Incluye vista de árbol jerárquico, formularios de creación/edición y vista de productos por categoría.

## 🎯 Funcionalidades Implementadas

### ✅ Pantallas Desarrolladas

1. **Gestión de Categorías** (`categories-tree`)
   - Vista de árbol expandible/colapsable
   - Estructura jerárquica completa
   - Contador de productos por categoría
   - Indicadores visuales de estado (activa/inactiva)
   - Acciones: Crear, Editar, Activar/Desactivar, Eliminar
   - Filtros por estado: Activas, Inactivas, Todas

2. **Modal de Categoría** (`category-modal`)
   - Crear nueva categoría o subcategoría
   - Editar categoría existente
   - Selector de categoría padre con jerarquía visual
   - Validaciones en tiempo real
   - Estados: Activa/Inactiva

3. **Productos por Categoría** (`category-products`)
   - Navegación breadcrumb
   - Lista de productos con detalles
   - Contador total de productos
   - Tabla responsive con información clave

## 📁 Estructura del Módulo

```
src/app/features/categories/
├── components/
│   ├── categories-tree/
│   │   ├── categories-tree.component.ts
│   │   ├── categories-tree.component.html
│   │   └── categories-tree.component.css
│   ├── category-modal/
│   │   ├── category-modal.component.ts
│   │   ├── category-modal.component.html
│   │   └── category-modal.component.css
│   └── category-products/
│       ├── category-products.component.ts
│       ├── category-products.component.html
│       └── category-products.component.css
├── services/
│   └── category.service.ts
├── models/
│   └── category.model.ts
└── categories.routes.ts
```

## 🔌 Servicios

### CategoryService

Servicios disponibles:

```typescript
getAllCategories(status?: 'active' | 'inactive' | 'all'): Observable<Category[]>
getCategoryById(id: number): Observable<Category>
createCategory(data: CreateCategoryDto): Observable<Category>
updateCategory(id: number, data: UpdateCategoryDto): Observable<Category>
toggleCategoryStatus(id: number, isActive: boolean): Observable<Category>
deleteCategory(id: number): Observable<void>
getProductsByCategory(id: number): Observable<CategoryProductsResponse>
healthCheck(): Observable<any>
```

## 🛣️ Rutas

```
/categories                    → Vista de árbol de categorías
/categories/:id/products       → Productos de una categoría específica
```

## 📊 Modelos e Interfaces

### Category
```typescript
interface Category {
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
```

### CreateCategoryDto
```typescript
interface CreateCategoryDto {
  name: string;
  description?: string;
  parentId?: number;
  isActive?: boolean;
}
```

### UpdateCategoryDto
```typescript
interface UpdateCategoryDto {
  name?: string;
  description?: string;
  parentId?: number;
  isActive?: boolean;
}
```

## 🎨 Características de UI/UX

### Árbol de Categorías
- ✅ Iconos diferenciados: carpeta para categorías con hijos, etiqueta para hojas
- ✅ Indentación visual por niveles
- ✅ Animaciones suaves en hover
- ✅ Badges de estado con colores semánticos
- ✅ Botones de acción con tooltips
- ✅ Expand/collapse con animación

### Modal
- ✅ Diseño moderno con gradientes
- ✅ Validaciones en tiempo real
- ✅ Selector de padre con indentación visual
- ✅ Radio buttons para estado
- ✅ Contador de caracteres
- ✅ Animaciones de entrada/salida

### Vista de Productos
- ✅ Breadcrumb navegable
- ✅ Tabla responsive
- ✅ Badges de stock con colores semánticos
- ✅ Formato de precio internacionalizado
- ✅ Empty state cuando no hay productos

## 🔧 Dependencias

El módulo utiliza:
- **Angular 19.x** (standalone components)
- **Bootstrap 5.3** (estilos)
- **Bootstrap Icons** (iconografía)
- **RxJS** (programación reactiva)

## 🚀 Integración con Backend

El módulo se conecta automáticamente al backend a través de:

- **Proxy configuration**: `proxy.conf.json`
- **Base URL**: `/api/v1/categories`
- **HTTP Interceptors**: Manejo de errores centralizado

### Endpoints utilizados:

```
GET    /api/v1/categories                 → Listar todas
GET    /api/v1/categories/:id             → Obtener una
POST   /api/v1/categories                 → Crear
PUT    /api/v1/categories/:id             → Actualizar
PATCH  /api/v1/categories/:id/status      → Cambiar estado
DELETE /api/v1/categories/:id             → Eliminar
GET    /api/v1/categories/:id/products    → Productos
GET    /api/v1/categories/health          → Health check
```

## 📱 Responsive Design

El módulo es completamente responsive:

- **Desktop**: Vista completa con todos los elementos
- **Tablet**: Ajustes de layout y espaciado
- **Mobile**: 
  - Botones apilados verticalmente
  - Tabla convertida en cards
  - Modal a pantalla completa
  - Navegación simplificada

## 🎯 Validaciones

### Formulario de Categoría
- ✅ Nombre: requerido, 2-100 caracteres
- ✅ Descripción: opcional, máximo 500 caracteres
- ✅ Padre: opcional, no puede ser sí misma ni sus descendientes
- ✅ Estado: requerido (activa/inactiva)

## 🔐 Seguridad

- ✅ Validación de datos en frontend
- ✅ Sanitización de inputs (middleware de seguridad)
- ✅ Confirmaciones para acciones destructivas
- ✅ Manejo de errores con mensajes amigables

## 📝 Próximas Mejoras

- [ ] Paginación en lista de productos
- [ ] Búsqueda y filtrado avanzado
- [ ] Arrastrar y soltar para reorganizar
- [ ] Exportar categorías a Excel/PDF
- [ ] Importar categorías desde archivo
- [ ] Estadísticas y gráficos por categoría

## 🧪 Testing

*TODO: Agregar tests unitarios y e2e*

```bash
# Ejecutar tests
ng test

# Ejecutar e2e
ng e2e
```

## 📚 Documentación Relacionada

- [Backend API Documentation](../../../SmartTrade-Backend/src/modules/categories/README.md)
- [Frontend Architecture](../../docs/ARCHITECTURE.md)
- [Component Style Guide](../../docs/STYLE-GUIDE.md)

---

**Desarrollado con ❤️ para SmartTrade Sistema de Gestión Comercial**
