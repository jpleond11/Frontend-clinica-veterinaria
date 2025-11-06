import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { VeterinarioService } from '../../../core/services/veterinario.service';
import { Veterinario, VeterinarioFilters } from '../../../shared/models/veterinario.model';

@Component({
  selector: 'app-veterinario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './veterinario-list.component.html',
  styleUrls: ['./veterinario-list.component.scss']
})
export class VeterinarioListComponent implements OnInit {
  veterinarios: Veterinario[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: VeterinarioFilters = {};

  // Modal
  showModal = false;
  editingVeterinario: Veterinario | null = null;

  veterinarioForm = {
    primer_nombre_veterinario: '',
    segundo_nombre_veterinario: '',
    primer_apellido_veterinario: '',
    segundo_apellido_veterinario: '',
    telefono: '',
    email: '',
    especialidad: ''
  };

  constructor(private veterinarioService: VeterinarioService) {}

  ngOnInit(): void {
    this.loadVeterinarios();
  }

  // Cargar listado principal de veterinarios
  loadVeterinarios(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.veterinarioService.getVeterinarios(pagination, this.filters).subscribe({
      next: (response: any) => {
        this.veterinarios = response.data;
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar veterinarios:', error);
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadVeterinarios();
  }

  clearFilters(): void {
    this.filters = {};
    this.currentPage = 1;
    this.loadVeterinarios();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadVeterinarios();
    }
  }

  // Modal
  openCreateModal(): void {
    this.editingVeterinario = null;
    this.veterinarioForm = {
      primer_nombre_veterinario: '',
      segundo_nombre_veterinario: '',
      primer_apellido_veterinario: '',
      segundo_apellido_veterinario: '',
      telefono: '',
      email: '',
      especialidad: ''
    };
    this.showModal = true;
  }

  editVeterinario(vet: Veterinario): void {
    this.editingVeterinario = vet;
    this.veterinarioForm = {
      primer_nombre_veterinario: vet.primer_nombre_veterinario,
      segundo_nombre_veterinario: vet.segundo_nombre_veterinario || '',
      primer_apellido_veterinario: vet.primer_apellido_veterinario,
      segundo_apellido_veterinario: vet.segundo_apellido_veterinario || '',
      telefono: vet.telefono,
      email: vet.email,
      especialidad: vet.especialidad
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingVeterinario = null;
  }

  saveVeterinario(): void {
    const { primer_nombre_veterinario, primer_apellido_veterinario, telefono, email, especialidad } = this.veterinarioForm;

    if (!primer_nombre_veterinario.trim() || !primer_apellido_veterinario.trim() || !telefono.trim() || !email.trim() || !especialidad.trim()) {
      alert('Los campos con * son obligatorios.');
      return;
    }

    if (this.editingVeterinario) {
      // Actualizar veterinario
      const updateData = { ...this.veterinarioForm };

      this.veterinarioService.updateVeterinario(this.editingVeterinario.id_veterinario, updateData).subscribe({
        next: () => {
          this.loadVeterinarios();
          this.closeModal();
        },
        error: (error : any) => {
          console.error('Error al actualizar veterinario:', error);
          alert('Error al actualizar el veterinario');
        }
      });
    } else {
      // Crear nuevo veterinario
      const newVeterinario = { ...this.veterinarioForm };

      this.veterinarioService.createVeterinario(newVeterinario).subscribe({
        next: () => {
          this.loadVeterinarios();
          this.closeModal();
        },
        error: (error: any) => {
          console.error('Error al crear veterinario:', error);
          alert('Error al crear el veterinario');
        }
      });
    }
  }

  deleteVeterinario(vet: Veterinario): void {
    if (confirm(`¿Está seguro de eliminar al veterinario "${vet.primer_nombre_veterinario} ${vet.primer_apellido_veterinario}"?`)) {
      this.veterinarioService.deleteVeterinario(vet.id_veterinario).subscribe({
        next: () => this.loadVeterinarios(),
        error: (error: any) => console.error('Error al eliminar veterinario:', error)
      });
    }
  }
}