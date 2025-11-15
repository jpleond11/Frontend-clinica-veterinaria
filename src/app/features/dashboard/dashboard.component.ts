import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard fade-in">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="card glass">
          <div class="card-body text-center">
            <div class="welcome-icon">🐾</div>
            <h1 class="welcome-title text-title-contrast">¡Bienvenido al Sistema Veterinario!</h1>
            <p class="welcome-subtitle text-high-contrast">
              Plataforma integral para la gestión de animales, citas, facturas y más.
            </p>
          </div>
        </div>
      </div>

      <!-- Modules Grid -->
      <div class="modules-grid">
        <div class="module-card slide-in-up" *ngFor="let modulo of modulos; let i = index" [style.animation-delay]="(i + 1) * 0.1 + 's'">
          <div class="card">
            <div class="card-body text-center">
              <div class="module-icon">{{ modulo.icono }}</div>
              <h3 class="module-title">{{ modulo.titulo }}</h3>
              <p class="module-description">{{ modulo.descripcion }}</p>
              <div class="module-features">
                <span class="feature-tag" *ngFor="let f of modulo.caracteristicas">{{ f }}</span>
              </div>
              <a [routerLink]="modulo.ruta" class="btn btn-primary btn-lg">
                <span class="btn-icon">{{ modulo.iconoBoton }}</span>
                {{ modulo.textoBoton }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <div class="card glass">
          <div class="card-header">
            <h3 class="card-title">Acciones Rápidas</h3>
          </div>
          <div class="card-body">
            <div class="actions-grid">
              <button class="action-btn" *ngFor="let accion of accionesRapidas">
                <span class="action-icon">{{ accion.icono }}</span>
                <span class="action-text">{{ accion.texto }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem 0;
    }

    .welcome-section {
      margin-bottom: 3rem;
    }

    .welcome-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: bounce 2s infinite;
    }

    .welcome-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      color: #003366 !important;
    }

    .welcome-subtitle {
      font-size: 1.125rem;
      color: #003366 !important;
      margin-bottom: 0;
      font-weight: 500;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }

    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .module-card {
      transition: transform 0.3s ease;
    }

    .module-card:hover {
      transform: translateY(-5px);
    }

    .module-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .module-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--dark-color);
    }

    .module-description {
      color: #475569;
      margin-bottom: 1.5rem;
      line-height: 1.6;
      font-weight: 500;
    }

    .module-features {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .feature-tag {
      background: var(--primary-color);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 500;
    }

    .btn-icon {
      margin-right: 0.5rem;
    }

    .quick-actions {
      margin-top: 2rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: var(--radius-md);
      color: black !important;
      text-decoration: none;
      transition: all 0.3s ease;
      cursor: pointer;
      text-shadow: none;
    }

    .action-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .action-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .action-text {
      font-weight: 500;
      font-size: 0.875rem;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }

    @media (max-width: 768px) {
      .welcome-title { font-size: 2rem; }
      .modules-grid { grid-template-columns: 1fr; gap: 1.5rem; }
      .actions-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 480px) {
      .dashboard { padding: 1rem 0; }
      .welcome-title { font-size: 1.75rem; }
      .actions-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  modulos = [
    {
      titulo: 'Animales',
      descripcion: 'Gestiona los animales registrados en el sistema.',
      icono: '🐶',
      iconoBoton: '➡️',
      textoBoton: 'Ver Animales',
      ruta: '/animales',
      caracteristicas: ['CRUD', 'Validaciones', 'Propietarios']
    },
    {
      titulo: 'Citas',
      descripcion: 'Administra las citas médicas de los animales.',
      icono: '📅',
      iconoBoton: '📋',
      textoBoton: 'Ver Citas',
      ruta: '/citas',
      caracteristicas: ['Fechas', 'Veterinarios', 'Facturación']
    },
    {
      titulo: 'Facturas',
      descripcion: 'Consulta y gestiona las facturas generadas.',
      icono: '💰',
      iconoBoton: '🧾',
      textoBoton: 'Ver Facturas',
      ruta: '/facturas',
      caracteristicas: ['Montos', 'Reportes', 'PDF']
    },
    {
      titulo: 'Propietarios',
      descripcion: 'Registra y administra los propietarios de los animales.',
      icono: '👩‍🌾',
      iconoBoton: '👁️',
      textoBoton: 'Ver Propietarios',
      ruta: '/propietarios',
      caracteristicas: ['Contactos', 'Historial', 'Asociaciones']
    },
    {
      titulo: 'Usuarios',
      descripcion: 'Administra los usuarios del sistema con control de roles.',
      icono: '👥',
      iconoBoton: '🔐',
      textoBoton: 'Ver Usuarios',
      ruta: '/usuarios',
      caracteristicas: ['Roles', 'Autenticación', 'Seguridad']
    },
    {
      titulo: 'Vacunas',
      descripcion: 'Gestiona las vacunas disponibles para los animales.',
      icono: '💉',
      iconoBoton: '📦',
      textoBoton: 'Ver Vacunas',
      ruta: '/vacunas',
      caracteristicas: ['Lotes', 'Vencimientos', 'Control']
    },
    {
      titulo: 'Veterinarios',
      descripcion: 'Control y registro de los profesionales veterinarios.',
      icono: '🩺',
      iconoBoton: '👨‍⚕️',
      textoBoton: 'Ver Veterinarios',
      ruta: '/veterinarios',
      caracteristicas: ['Especialidades', 'Citas', 'Agenda']
    }
  ];

  accionesRapidas = [
    { icono: '➕', texto: 'Nuevo Animal' },
    { icono: '📅', texto: 'Programar Cita' },
    { icono: '💰', texto: 'Generar Factura' },
    { icono: '💉', texto: 'Registrar Vacuna' }
  ];

  ngOnInit(): void {
    console.log('Dashboard cargado');
  }
}