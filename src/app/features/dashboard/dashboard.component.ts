import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { CitaService } from 'src/app/core/services/cita.service';
Chart.register(...registerables);

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

      <!-- Chart Section -->
      <div class="chart-section slide-in-up">
        <div class="card glass chart-card">
          <div class="card-header text-center">
            <h3 class="card-title">Citas de los Últimos 3 Meses</h3>
          </div>
          <div class="card-body">
            <canvas #chartCanvas></canvas>
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
      padding: 1.25rem 0 !important;
      max-width: 1100px;      
      margin: 0 auto;
      transform: scale(0.95);
    }

    .chart-card {
      max-width: 750px;
      margin: 0 auto;
      padding: 1.5rem !important;
    }

    .chart-section {
      margin-bottom: 3rem !important;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .chart-card canvas {
      height: 260px !important;  
    }


    .welcome-section {
      margin-top: -3rem;
      margin-bottom: 2rem;
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
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
      margin-bottom: 3rem;
      justify-items: center;
    }

    .module-card {
      transition: transform 0.3s ease;
      width: 100%;
      max-width: 330px;
      min-height: 360px;
      display: flex;
    }

    .module-card:hover {
      transform: translateY(-6px);
    }

    .module-icon {
      font-size: 3.5rem;
      margin-bottom: 1rem;
    }

    .module-title {
      font-size: 1.7rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--dark-color);
    }

    .module-description {
      color: #475569;
      margin-bottom: 1.5rem;
      line-height: 1.6;
      font-weight: 500;
      font-size: 1rem;
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
      color: black;
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
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;

  constructor(private citaService: CitaService) {}
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

  ngAfterViewInit(): void {
    this.loadChartData();
  }

  /** ===============================
   *  1) Traer datos del backend
   *  =============================== */
  private loadChartData(): void {
    this.citaService.getCitasUltimos3Meses().subscribe({
      next: (citas) => {
        const grouped = this.groupByMonth(citas);
        this.renderChart(grouped.labels, grouped.values);
      },
      error: (err) => {
        console.error('Error cargando citas:', err);
      }
    });
  }

  /** ===============================
   *  2) Agrupar citas por mes
   *  =============================== */
  private groupByMonth(citas: any[]) {
    const map = new Map<string, number>();

    citas.forEach(cita => {
      const fecha = new Date(cita.fecha_inicio_cita);
      const key = fecha.toLocaleString('es-CO', {
        month: 'long',
        year: 'numeric'
      });

      map.set(key, (map.get(key) || 0) + 1);
    });

    const labels = Array.from(map.keys());
    const values = Array.from(map.values());

    return { labels, values };
  }

  /** ===============================
   *  3) Renderizar gráfico final
   *  =============================== */
  private renderChart(labels: string[], values: number[]): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    // Si ya existe un gráfico previo, destruirlo
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Citas Registradas',
          data: values,
          borderColor: '#003366',
          backgroundColor: 'rgba(0, 51, 102, 0.2)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointRadius: 6,
          pointBackgroundColor: '#003366',
          pointHoverRadius: 10
        }]
      },
      options: {
        responsive: true,
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart'
        },
        plugins: {
          legend: {
            labels: {
              color: '#003366',
              font: { weight: 'bold' }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#003366', font: { weight: 600 } }
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#003366' }
          }
        }
      }
    });
  }
}