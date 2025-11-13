import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams, ApiResponse } from '../../../core/models/api-response.model';
import { VacunaService } from '../../../core/services/vacuna.service';
import { Vacuna } from '../../../shared/models/vacuna.model';
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

  vacunaForm = {
    nombre_vacuna: '',
    fecha_aplicacion_vacuna: '',
    proxima_dosis_vacuna: ''
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
      proxima_dosis_vacuna: ''
    };
    this.showModal = true;
  }

  editVacuna(vacuna: Vacuna): void {
    this.editingVacuna = vacuna;
    this.vacunaForm = {
      nombre_vacuna: vacuna.nombre_vacuna,
      fecha_aplicacion_vacuna: vacuna.fecha_aplicacion_vacuna?.split('T')[0] || '',
      proxima_dosis_vacuna: vacuna.proxima_dosis_vacuna?.split('T')[0] || ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingVacuna = null;
  }

  saveVacuna(): void {
    if (!this.vacunaForm.nombre_vacuna.trim() || !this.vacunaForm.fecha_aplicacion_vacuna) {
      alert('El nombre y la fecha de aplicación son obligatorios.');
      return;
    }

    if (this.editingVacuna) {
      // Actualizar vacuna
      const updateData = {
        nombre_vacuna: this.vacunaForm.nombre_vacuna,
        fecha_aplicacion_vacuna: this.vacunaForm.fecha_aplicacion_vacuna,
        proxima_dosis_vacuna: this.vacunaForm.proxima_dosis_vacuna || null
      };

      this.vacunaService.updateVacuna(this.editingVacuna.id_vacuna, updateData).subscribe({
        next: () => {
          this.loadVacunas();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar vacuna:', error);
          alert('Error al actualizar la vacuna');
        }
      });
    } else {
      // Crear nueva vacuna
      const newVacuna = {
        nombre_vacuna: this.vacunaForm.nombre_vacuna,
        fecha_aplicacion_vacuna: this.vacunaForm.fecha_aplicacion_vacuna,
        proxima_dosis_vacuna: this.vacunaForm.proxima_dosis_vacuna || null
      };

      this.vacunaService.createVacuna(newVacuna).subscribe({
        next: () => {
          this.loadVacunas();
          this.closeModal();
        },
        error: (error) => {
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
