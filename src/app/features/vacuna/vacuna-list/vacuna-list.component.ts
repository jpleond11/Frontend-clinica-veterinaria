import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams, ApiResponse } from '../../../core/models/api-response.model';
import { VacunaService } from '../../../core/services/vacuna.service';
import { Vacuna, CreateVacunaRequest, UpdateVacunaRequest } from '../../../shared/models/vacuna.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-vacuna-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vacuna-list.component.html',
  styleUrls: ['./vacuna-list.component.scss']
})
export class VacunaListComponent implements OnInit {
  vacunas: Vacuna[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filtroId = '';

  // Modal
  showModal = false;
  editingVacuna: Vacuna | null = null;

  vacunaForm: CreateVacunaRequest & { usuario_id_creacion?: string, usuario_id_edicion?: string } = {
    nombre_vacuna: '',
    fecha_aplicacion_vacuna: '',
    proxima_dosis_vacuna: '',
    usuario_id_creacion: '',
    usuario_id_edicion: ''
  };

  constructor(private vacunaService: VacunaService) {}

  ngOnInit(): void {
    this.loadVacunas();
  }

  loadVacunas(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.vacunaService.getVacunas(pagination).subscribe({
      next: (response) => {
        this.vacunas = response.data;
        this.totalPages = Math.ceil(response.data.length / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar vacunas:', error);
        this.loading = false;
      }
    });
  }

  buscarPorId(): void {
            const id = this.filtroId.trim();
            if (!id) {
              this.loadVacunas();
              return;
            }
        
            this.loading = true;
            this.vacunaService.getVacunaById(id).subscribe({
              next: (vacuna: Vacuna) => {
                this.vacunas = [vacuna]; // mostrar solo el encontrado
                this.totalPages = 1;
                this.loading = false;
              },
              error: (err: HttpErrorResponse | any) => {
                console.error('Error al buscar animal:', err);
                this.vacunas = [];
                this.loading = false;
              }
            });
          }

  onFilterChange(): void {
    this.loadVacunas();
  }

  clearFilters(): void {
    this.loadVacunas();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadVacunas();
    }
  }

  openCreateModal(): void {
    this.editingVacuna = null;
    this.vacunaForm = {
      nombre_vacuna: '',
      fecha_aplicacion_vacuna: '',
      proxima_dosis_vacuna: '',
      usuario_id_creacion: '',
      usuario_id_edicion: ''
    };
    this.showModal = true;
  }

  editVacuna(vacuna: Vacuna): void {
    this.editingVacuna = vacuna;
    this.vacunaForm = {
      nombre_vacuna: vacuna.nombre_vacuna,
      fecha_aplicacion_vacuna: vacuna.fecha_aplicacion_vacuna?.split('T')[0] || '',
      proxima_dosis_vacuna: vacuna.proxima_dosis_vacuna?.split('T')[0] || '',
      usuario_id_creacion: vacuna.usuario_id_creacion,
      usuario_id_edicion: ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingVacuna = null;
  }

  saveVacuna(): void {
  const {
    nombre_vacuna,
    fecha_aplicacion_vacuna,
    proxima_dosis_vacuna,
    usuario_id_creacion,
    usuario_id_edicion
  } = this.vacunaForm;

  // Validación de campos obligatorios
  if (
    !nombre_vacuna?.trim() ||
    !fecha_aplicacion_vacuna?.trim()
  ) {
    alert('Los campos con * son obligatorios.');
    return;
  }

  if (this.editingVacuna) {
    // ACTUALIZAR vacuna
    const updateData: UpdateVacunaRequest = {
      nombre_vacuna: nombre_vacuna.trim(),
      fecha_aplicacion_vacuna: fecha_aplicacion_vacuna.trim(),
      proxima_dosis_vacuna: proxima_dosis_vacuna || null,
      // usuario_id_edicion es opcional; lo enviamos como string o null
      usuario_id_edicion: usuario_id_edicion?.trim() || null
    };

    this.vacunaService
      .updateVacuna(this.editingVacuna.id_vacuna, updateData)
      .subscribe({
        next: () => {
          this.loadVacunas();
          this.closeModal();
        },
        error: (error: any) => {
          console.error('Error al actualizar vacuna:', error);
          alert('Error al actualizar la vacuna');
        }
      });

  } else {
    // CREAR vacuna
    if (!usuario_id_creacion?.trim()) {
      alert('El campo "Usuario Creación" es obligatorio.');
      return;
    }

    const newVacuna: CreateVacunaRequest = {
      nombre_vacuna: nombre_vacuna.trim(),
      fecha_aplicacion_vacuna: fecha_aplicacion_vacuna.trim(),
      proxima_dosis_vacuna: proxima_dosis_vacuna || null,
      usuario_id_creacion: usuario_id_creacion.trim()
    };

    this.vacunaService.createVacuna(newVacuna).subscribe({
      next: () => {
        this.loadVacunas();
        this.closeModal();
      },
      error: (error: any) => {
        console.error('Error al crear vacuna:', error);
        alert('Error al crear la vacuna');
      }
    });
  }
}


  deleteVacuna(vacuna: Vacuna): void {
    if (confirm(`¿Está seguro de eliminar la vacuna "${vacuna.nombre_vacuna}"?`)) {
      this.vacunaService.deleteVacuna(vacuna.id_vacuna).subscribe({
        next: () => {
          this.loadVacunas();
        },
        error: (error) => {
          console.error('Error al eliminar vacuna:', error);
        }
      });
    }
  }
}
