import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AnimalService } from '../../../core/services/animal.service';
import { Animal, AnimalFilters } from '../../../shared/models/animal.model';
import { PaginationParams, PaginatedResponse } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-animal-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './animal-list.component.html',
  styleUrls: ['./animal-list.component.scss']
})
export class AnimalListComponent implements OnInit {
  animales: Animal[] = [];
  loading = false;

  // Paginación
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  // Filtros
  filters: AnimalFilters = {
    nombre_animal: '',
    especie_animal: '',
    propietario_id: '',
    categoria_id: '',
    fecha_desde: '',
    fecha_hasta: ''
  };

  // Modal
  showModal = false;
  editingAnimal: Animal | null = null;
  animalForm: Partial<Animal> = {
    nombre_animal: '',
    especie_animal: '',
    fecha_nacimiento_animal: undefined,
    propietario_id: undefined,
    categoria_id: undefined
  };

  constructor(private animalService: AnimalService) {}

  ngOnInit(): void {
    this.loadAnimales();
  }

  loadAnimales(): void {
    this.loading = true;

    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.animalService.getAnimales(pagination, this.filters).subscribe({
      next: (response: PaginatedResponse<Animal>) => {
        this.animales = response.data;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (err: HttpErrorResponse | any) => {
        console.error('Error al cargar animales:', err);
        this.loading = false;
      }
    });
  }

  onFilterChange(): void {
    this.currentPage = 1; // resetear página al cambiar filtro
    this.loadAnimales();
  }

  clearFilters(): void {
    this.filters = {
      nombre_animal: '',
      especie_animal: '',
      propietario_id: '',
      categoria_id: '',
      fecha_desde: '',
      fecha_hasta: ''
    };
    this.loadAnimales();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAnimales();
    }
  }

  openCreateModal(): void {
    this.editingAnimal = null;
    this.animalForm = {
      nombre_animal: '',
      especie_animal: '',
      fecha_nacimiento_animal: undefined,
      propietario_id: undefined,
      categoria_id: undefined
    };
    this.showModal = true;
  }

  editAnimal(animal: Animal): void {
    this.editingAnimal = animal;
    this.animalForm = { ...animal };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveAnimal(): void {
    const data: Partial<Animal> = { ...this.animalForm };

    if (this.editingAnimal) {
      this.animalService.updateAnimal(this.editingAnimal.id_animal, data).subscribe({
        next: () => {
          this.loadAnimales();
          this.closeModal();
        },
        error: (err: HttpErrorResponse | any) => console.error('Error al actualizar animal:', err)
      });
    } else {
      this.animalService.createAnimal(data).subscribe({
        next: () => {
          this.loadAnimales();
          this.closeModal();
        },
        error: (err: HttpErrorResponse | any) => console.error('Error al crear animal:', err)
      });
    }
  }

  deleteAnimal(animal: Animal): void {
    if (confirm(`¿Eliminar animal "${animal.nombre_animal}"?`)) {
      this.animalService.deleteAnimal(animal.id_animal).subscribe({
        next: () => this.loadAnimales(),
        error: (err: HttpErrorResponse | any) => console.error('Error al eliminar animal:', err)
      });
    }
  }
}