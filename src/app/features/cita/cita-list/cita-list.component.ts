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

  citaForm: CreateCitaRequest & { usuario_id_creacion?: string, usuario_id_edicion?: string } = {
    fecha_inicio_cita: '',
    fecha_final_cita: '',
    motivo_cita: '',
    animal_id: '',
    vacuna_id: undefined,
    veterinario_id: '',
    usuario_id_creacion: '',
    usuario_id_edicion: ''
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
      veterinario_id: '',
      usuario_id_creacion: '',
      usuario_id_edicion: ''
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
      veterinario_id: cita.veterinario_id,
      usuario_id_creacion: cita.usuario_id_creacion,
      usuario_id_edicion: ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveCita(): void {
  const {
    fecha_inicio_cita,
    fecha_final_cita,
    motivo_cita,
    animal_id,
    vacuna_id,
    veterinario_id,
    usuario_id_creacion,
    usuario_id_edicion
  } = this.citaForm;

  // 🔹 Validación de campos obligatorios
  if (
    !fecha_inicio_cita?.trim() ||
    !fecha_final_cita?.trim() ||
    !motivo_cita?.trim() ||
    !animal_id?.trim() ||
    !veterinario_id?.trim()
  ) {
    alert('Los campos con * son obligatorios.');
    return;
  }

  if (this.editingCita) {
    // 🔹 ACTUALIZAR Cita
    const updateData: UpdateCitaRequest = {
      fecha_inicio_cita: fecha_inicio_cita.trim(),
      fecha_final_cita: fecha_final_cita.trim(),
      motivo_cita: motivo_cita.trim(),
      animal_id: animal_id.trim(),
      vacuna_id: vacuna_id?.trim() || undefined,
      veterinario_id: veterinario_id.trim(),
      usuario_id_edicion: usuario_id_edicion?.trim() || null
    };

    this.citaService.updateCita(this.editingCita.id_cita, updateData).subscribe({
      next: () => {
        this.loadCitas();
        this.closeModal();
      },
      error: (error: any) => {
        console.error('Error al actualizar cita:', error);
        alert('Error al actualizar la cita');
      }
    });

  } else {
    // 🔹 CREAR Cita
    if (!usuario_id_creacion?.trim()) {
      alert('El campo "Usuario Creación" es obligatorio.');
      return;
    }

    const newCita: CreateCitaRequest = {
      fecha_inicio_cita: fecha_inicio_cita.trim(),
      fecha_final_cita: fecha_final_cita.trim(),
      motivo_cita: motivo_cita.trim(),
      animal_id: animal_id.trim(),
      vacuna_id: vacuna_id?.trim() || undefined,
      veterinario_id: veterinario_id.trim(),
      usuario_id_creacion: usuario_id_creacion.trim()
    };

    this.citaService.createCita(newCita).subscribe({
      next: () => {
        this.loadCitas();
        this.closeModal();
      },
      error: (error: any) => {
        console.error('Error al crear cita:', error);
        alert('Error al crear la cita');
      }
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