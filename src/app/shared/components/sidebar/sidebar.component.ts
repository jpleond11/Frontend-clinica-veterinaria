import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  roles?: string[];
}

export const ROUTES: RouteInfo[] = [
  { path: '/animales', title: 'Animales', icon: 'pets', class: '' },
  { path: '/citas', title: 'Citas', icon: 'event', class: '' },
  { path: '/facturas', title: 'Facturas', icon: 'receipt_long', class: '' },
  { path: '/propietarios', title: 'Propietarios', icon: 'person', class: '' },
  { path: '/usuarios', title: 'Usuarios', icon: 'supervisor_account', class: '', roles: ['admin'] },
  { path: '/vacunas', title: 'Vacunas', icon: 'vaccines', class: '' },
  { path: '/veterinarios', title: 'Veterinarios', icon: 'medical_services', class: '' },
];

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => this.canAccessMenuItem(menuItem));
  }

  canAccessMenuItem(menuItem: RouteInfo): boolean {
    // Si no tiene roles definidos, todos pueden acceder
    if (!menuItem.roles || menuItem.roles.length === 0) {
      return true;
    }

    // Verificar si el usuario actual tiene alguno de los roles requeridos
    const userRole = this.authService.getUserRole();
    return userRole ? menuItem.roles.includes(userRole) : false;
  }

  isMobileMenu() {
    return window.innerWidth <= 991;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
