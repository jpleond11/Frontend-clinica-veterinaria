import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CitaService } from '../../../core/services/cita.service';
import { Cita, CreateCitaRequest, UpdateCitaRequest } from '../../../shared/models/cita.model';
import { PaginationParams, ApiResponse } from '../../../core/models/api-response.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cita-list.component.html',
  styleUrls: ['./cita-list.component.scss']
})
export class CitaListComponent implements OnInit {
  citas: Cita[] = [];

  showModal = false;
  editingCita: Cita | null = null;
  loading = false;

  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filtroId = '';

  citaForm: CreateCitaRequest | UpdateCitaRequest = {
    fecha_inicio_cita: '',
    fecha_final_cita: '',
    motivo_cita: '',
    animal_id: '',
    vacuna_id: undefined,
    veterinario_id: ''
  };

  constructor(
    private citaService: CitaService,
  ) {}

  ngOnInit(): void {
    this.loadCitas();
  }

  loadCitas(): void {
    this.loading = true;
    const pagination: PaginationParams = { page: this.currentPage, limit: this.pageSize };
    this.citaService.getCitas(pagination).subscribe({
      next: (response: ApiResponse<Cita[]>) => {
        this.citas = response.data;
        this.totalPages = Math.ceil(this.citas.length / this.pageSize);
        this.loading = false;
      },
      error: (err: HttpErrorResponse | any) => {
        console.error('Error al cargar citas:', err);
        this.loading = false;
      }
    });
  }

  buscarPorId(): void {
      const id = this.filtroId.trim();
      if (!id) {
        this.loadCitas();
        return;
      }
  
      this.loading = true;
      this.citaService.getCitaById(id).subscribe({
        next: (cita: Cita) => {
          this.citas = [cita]; // mostrar solo el encontrado
          this.totalPages = 1;
          this.loading = false;
        },
        error: (err: HttpErrorResponse | any) => {
          console.error('Error al buscar animal:', err);
          this.citas = [];
          this.loading = false;
        }
      });
    }

  onFilterChange(): void {
    this.loadCitas();
  }

  clearFilters(): void {
    this.loadCitas();
  }

  openCreateModal(): void {
    this.editingCita = null;
    this.citaForm = {
      fecha_inicio_cita: '',
      fecha_final_cita: '',
      motivo_cita: '',
      animal_id: '',
      vacuna_id: undefined,
      veterinario_id: ''
    };
    this.showModal = true;
  }

  editCita(cita: Cita): void {
    this.editingCita = cita;
    this.citaForm = {
      fecha_inicio_cita: cita.fecha_inicio_cita?.slice(0, 16) || '',
      fecha_final_cita: cita.fecha_final_cita?.slice(0, 16) || '',
      motivo_cita: cita.motivo_cita,
      animal_id: cita.animal_id,
      vacuna_id: cita.vacuna_id || undefined,
      veterinario_id: cita.veterinario_id
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveCita(): void {
    const data: CreateCitaRequest | UpdateCitaRequest = {
      fecha_inicio_cita: this.citaForm.fecha_inicio_cita,
      fecha_final_cita: this.citaForm.fecha_final_cita,
      motivo_cita: this.citaForm.motivo_cita,
      animal_id: this.citaForm.animal_id,
      vacuna_id: this.citaForm.vacuna_id || undefined,
      veterinario_id: this.citaForm.veterinario_id
    };

    if (this.editingCita) {
      const updateData: UpdateCitaRequest = Object.keys(data).reduce((acc, key) => {
        const value = data[key as keyof typeof data];
        if (value !== undefined && value !== null && value !== '') {
          (acc as any)[key] = value;
        }
        return acc;
      }, {});
      this.citaService.updateCita(this.editingCita.id_cita, updateData).subscribe({
        next: () => { this.loadCitas(); this.closeModal(); },
        error: (err: HttpErrorResponse | any) => console.error('Error al actualizar cita:', err)
      });
    } else {
      this.citaService.createCita(data as CreateCitaRequest).subscribe({
        next: () => { this.loadCitas(); this.closeModal(); },
        error: (err: HttpErrorResponse | any) => console.error('Error al crear cita:', err)
      });
    }
  }

  deleteCita(cita: Cita): void {
    if (confirm(`¿Eliminar cita "${cita.motivo_cita}"?`)) {
      this.citaService.deleteCita(cita.id_cita).subscribe({
        next: () => this.loadCitas(),
        error: (err: HttpErrorResponse | any) => console.error('Error al eliminar cita:', err)
      });
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.currentPage = page;
  }
}