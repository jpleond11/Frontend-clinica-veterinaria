import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams } from '../../../core/models/api-response.model';
import { PropietarioService } from '../../../core/services/propietario.service';
import { Propietario, PropietarioFilters } from '../../../shared/models/propietario.model';

@Component({
  selector: 'app-propietario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './propietario-list.component.html',
  styleUrls: ['./propietario-list.component.scss']
})
export class PropietarioListComponent implements OnInit {

  propietarios: Propietario[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: PropietarioFilters = {
    nombre: '',
    apellido: ''
  };

  // Modal
  showModal = false;
  editingPropietario: Propietario | null = null;

  propietarioForm = {
    primer_nombre_propietario: '',
    segundo_nombre_propietario: '',
    primer_apellido_propietario: '',
    segundo_apellido_propietario: '',
    telefono: '',
    direccion: ''
  };

  constructor(private propietarioService: PropietarioService) {}

  ngOnInit(): void {
    this.loadPropietarios();
  }

  // Cargar lista de propietarios
  loadPropietarios(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.propietarioService.getPropietarios(pagination, this.filters).subscribe({
      next: (response: any) => {
        this.propietarios = response.data;
        this.totalPages = response.totalPages || 1;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar propietarios:', error);
        this.loading = false;
      }
    });
  }

  // Filtrar
  onFilterChange(): void {
    this.currentPage = 1;
    this.loadPropietarios();
  }

  clearFilters(): void {
    this.filters = { nombre: '', apellido: '' };
    this.currentPage = 1;
    this.loadPropietarios();
  }

  // Paginación
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadPropietarios();
    }
  }

  // Modal
  openCreateModal(): void {
    this.editingPropietario = null;
    this.propietarioForm = {
      primer_nombre_propietario: '',
      segundo_nombre_propietario: '',
      primer_apellido_propietario: '',
      segundo_apellido_propietario: '',
      telefono: '',
      direccion: ''
    };
    this.showModal = true;
  }

  editPropietario(propietario: Propietario): void {
    this.editingPropietario = propietario;
    this.propietarioForm = {
      primer_nombre_propietario: propietario.primer_nombre_propietario,
      segundo_nombre_propietario: propietario.segundo_nombre_propietario || '',
      primer_apellido_propietario: propietario.primer_apellido_propietario,
      segundo_apellido_propietario: propietario.segundo_apellido_propietario,
      telefono: propietario.telefono,
      direccion: propietario.direccion
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingPropietario = null;
  }

  // 🔹 Guardar (crear o actualizar)
  savePropietario(): void {
    const form = this.propietarioForm;

    if (
      !form.primer_nombre_propietario.trim() ||
      !form.primer_apellido_propietario.trim() ||
      !form.segundo_apellido_propietario.trim() ||
      !form.telefono.trim() ||
      !form.direccion.trim()
    ) {
      alert('Todos los campos obligatorios deben estar completos.');
      return;
    }

    if (this.editingPropietario) {
      // Actualizar propietario
      const updateData = {
        primer_nombre_propietario: form.primer_nombre_propietario,
        segundo_nombre_propietario: form.segundo_nombre_propietario || null,
        primer_apellido_propietario: form.primer_apellido_propietario,
        segundo_apellido_propietario: form.segundo_apellido_propietario,
        telefono: form.telefono,
        direccion: form.direccion
      };

      this.propietarioService.updatePropietario(this.editingPropietario.id_propietario, updateData).subscribe({
        next: () => {
          this.loadPropietarios();
          this.closeModal();
        },
        error: (error: any) => {
          console.error('Error al actualizar propietario:', error);
          alert('Error al actualizar el propietario');
        }
      });
    } else {
      // Crear nuevo propietario
      const newPropietario = {
        primer_nombre_propietario: form.primer_nombre_propietario,
        segundo_nombre_propietario: form.segundo_nombre_propietario || null,
        primer_apellido_propietario: form.primer_apellido_propietario,
        segundo_apellido_propietario: form.segundo_apellido_propietario,
        telefono: form.telefono,
        direccion: form.direccion
      };

      this.propietarioService.createPropietario(newPropietario).subscribe({
        next: () => {
          this.loadPropietarios();
          this.closeModal();
        },
        error: (error: any) => {
          console.error('Error al crear propietario:', error);
          alert('Error al crear el propietario');
        }
      });
    }
  }

  // Eliminar propietario
  deletePropietario(propietario: Propietario): void {
    if (confirm(`¿Está seguro de eliminar al propietario "${propietario.primer_nombre_propietario} ${propietario.primer_apellido_propietario}"?`)) {
      this.propietarioService.deletePropietario(propietario.id_propietario).subscribe({
        next: () => this.loadPropietarios(),
        error: (error: any) => {
          console.error('Error al eliminar propietario:', error);
        }
      });
    }
  }
}
