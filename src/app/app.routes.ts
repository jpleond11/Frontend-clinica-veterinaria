import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'animales',
    loadComponent: () => import('./features/animal/animal-list/animal-list.component').then(m => m.AnimalListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'citas',
    loadComponent: () => import('./features/cita/cita-list/cita-list.component').then(m => m.CitaListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'facturas',
    loadComponent: () => import('./features/factura/factura-list/factura-list.component').then(m => m.FacturaListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'propietarios',
    loadComponent: () => import('./features/propietario/propietario-list/propietario-list.component').then(m => m.PropietarioListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./features/usuario/usuario-list/usuario-list.component').then(m => m.UsuarioListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'vacunas',
    loadComponent: () => import('./features/vacuna/vacuna-list/vacuna-list.component').then(m => m.VacunaListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'veterinarios',
    loadComponent: () => import('./features/veterinario/veterinario-list/veterinario-list.component').then(m => m.VeterinarioListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
