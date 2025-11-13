import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AnimalService } from '../../../core/services/animal.service';
import { Animal, CreateAnimalRequest, UpdateAnimalRequest } from '../../../shared/models/animal.model';
import { PaginationParams, ApiResponse } from '../../../core/models/api-response.model';

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

  showModal = false;
  editingAnimal: Animal | null = null;

  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  // Filtro: solo por ID (UUID)
  filtroId = '';

  // Formulario para crear o editar animales
  animalForm: CreateAnimalRequest | UpdateAnimalRequest = {
    nombre_animal: '',
    especie_animal: '',
    fecha_nacimiento_animal: '',
    propietario_id: '',
    categoria_id: '',
  };

  constructor(private animalService: AnimalService) {}

  ngOnInit(): void {
    this.loadAnimales();
  }

  /** Cargar todos los animales */
  loadAnimales(): void {
    this.loading = true;
    const pagination: PaginationParams = { page: this.currentPage, limit: this.pageSize };

    this.animalService.getAnimales(pagination).subscribe({
      next: (response: ApiResponse<Animal[]>) => {
        this.animales = response.data;
        this.totalPages = Math.ceil(this.animales.length / this.pageSize);
        this.loading = false;
      },
      error: (err: HttpErrorResponse | any) => {
        console.error('Error al cargar animales:', err);
        this.loading = false;
      }
    });
  }

  /** Buscar un animal por ID */
  buscarPorId(): void {
    const id = this.filtroId.trim();
    if (!id) {
      this.loadAnimales();
      return;
    }

    this.loading = true;
    this.animalService.getAnimalById(id).subscribe({
      next: (animal: Animal) => {
        this.animales = [animal]; // mostrar solo el encontrado
        this.totalPages = 1;
        this.loading = false;
      },
      error: (err: HttpErrorResponse | any) => {
        console.error('Error al buscar animal:', err);
        this.animales = [];
        this.loading = false;
      }
    });
  }

  clearFiltro(): void {
    this.filtroId = '';
    this.loadAnimales();
  }

  /** Abrir modal para crear */
  openCreateModal(): void {
    this.editingAnimal = null;
    this.animalForm = {
      nombre_animal: '',
      especie_animal: '',
      fecha_nacimiento_animal: '',
      propietario_id: '',
      categoria_id: '',
    };
    this.showModal = true;
  }

  /** Editar animal */
  editAnimal(animal: Animal): void {
    this.editingAnimal = animal;
    this.animalForm = {
      nombre_animal: animal.nombre_animal,
      especie_animal: animal.especie_animal,
      fecha_nacimiento_animal: animal.fecha_nacimiento_animal
        ? animal.fecha_nacimiento_animal.slice(0, 10)
        : '',
      propietario_id: animal.propietario_id,
      categoria_id: animal.categoria_id,
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  /** Guardar (crear o actualizar) */
  saveAnimal(): void {
    if (this.editingAnimal) {
      const updateData: UpdateAnimalRequest = {
        ...this.animalForm,
      };

      this.animalService.updateAnimal(this.editingAnimal.id_animal, updateData).subscribe({
        next: () => {
          this.loadAnimales();
          this.closeModal();
        },
        error: (err: HttpErrorResponse | any) => console.error('Error al actualizar animal:', err)
      });
    } else {
      this.animalService.createAnimal(this.animalForm as CreateAnimalRequest).subscribe({
        next: () => {
          this.loadAnimales();
          this.closeModal();
        },
        error: (err: HttpErrorResponse | any) => console.error('Error al crear animal:', err)
      });
    }
  }

  /** Eliminar */
  deleteAnimal(animal: Animal): void {
    if (confirm(`¿Eliminar animal "${animal.nombre_animal}"?`)) {
      this.animalService.deleteAnimal(animal.id_animal).subscribe({
        next: () => this.loadAnimales(),
        error: (err: HttpErrorResponse | any) => console.error('Error al eliminar animal:', err)
      });
    }
  }

  /** Paginación */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAnimales();
    }
  }
}