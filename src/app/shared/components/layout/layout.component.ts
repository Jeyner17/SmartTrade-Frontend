import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  currentYear = new Date().getFullYear();
  appName = 'Sistema de Gestión Comercial';
  
  // Control del sidebar
  isSidebarCollapsed = false;
  
  // Usuario (temporal)
  currentUser = {
    name: 'Jeyner Manzaba',
    role: 'Administrador',
    initials: 'JM'
  };

  // Items del menú
  menuItems = [
    {
      label: 'Inicio',
      icon: 'bi-house-door',
      route: '/dashboard',
      active: false
    },
    {
      label: 'Configuración',
      icon: 'bi-gear',
      route: '/settings',
      active: true
    },
    {
      label: 'Productos',
      icon: 'bi-box-seam',
      route: '/products',
      active: false
    },
    {
      label: 'Categorías',
      icon: 'bi-tags',
      route: '/categories',
      active: false
    },
    {
      label: 'Proveedores',
      icon: 'bi-truck',
      route: '/suppliers',
      active: false
    }
  ];

  /**
   * Toggle del sidebar
   */
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}