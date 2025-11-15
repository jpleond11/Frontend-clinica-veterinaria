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
  animalForm: CreateAnimalRequest & { usuario_id_creacion?: string, usuario_id_edicion?: string } = {
    nombre_animal: '',
    especie_animal: '',
    fecha_nacimiento_animal: '',
    propietario_id: '',
    categoria_id: '',
    usuario_id_creacion: '',
    usuario_id_edicion: ''
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
      usuario_id_creacion: '',
      usuario_id_edicion: ''
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
      usuario_id_creacion: animal.usuario_id_creacion,
      usuario_id_edicion: ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  /** Guardar (crear o actualizar) */
  saveAnimal(): void {
  const {
    nombre_animal,
    especie_animal,
    fecha_nacimiento_animal,
    propietario_id,
    categoria_id,
    usuario_id_creacion,
    usuario_id_edicion
  } = this.animalForm;

  // 🔹 Validación de campos obligatorios
  if (
    !nombre_animal?.trim() ||
    !especie_animal?.trim() ||
    !fecha_nacimiento_animal?.trim() ||
    !propietario_id?.trim() ||
    !categoria_id?.trim()
  ) {
    alert('Los campos con * son obligatorios.');
    return;
  }

  if (this.editingAnimal) {
    // 🔹 ACTUALIZAR Animal
    const updateData: UpdateAnimalRequest = {
      nombre_animal: nombre_animal.trim(),
      especie_animal: especie_animal.trim(),
      fecha_nacimiento_animal: fecha_nacimiento_animal.trim(),
      propietario_id: propietario_id.trim(),
      categoria_id: categoria_id.trim(),
      usuario_id_edicion: usuario_id_edicion?.trim() || null
    };

    this.animalService.updateAnimal(this.editingAnimal.id_animal, updateData).subscribe({
      next: () => {
        this.loadAnimales();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al actualizar animal:', err);
        alert('Error al actualizar el animal');
      }
    });

  } else {
    // 🔹 CREAR Animal
    if (!usuario_id_creacion?.trim()) {
      alert('El campo "Usuario Creación" es obligatorio.');
      return;
    }

    const newAnimal: CreateAnimalRequest = {
      nombre_animal: nombre_animal.trim(),
      especie_animal: especie_animal.trim(),
      fecha_nacimiento_animal: fecha_nacimiento_animal.trim(),
      propietario_id: propietario_id.trim(),
      categoria_id: categoria_id.trim(),
      usuario_id_creacion: usuario_id_creacion.trim()
    };

    this.animalService.createAnimal(newAnimal).subscribe({
      next: () => {
        this.loadAnimales();
        this.closeModal();
      },
      error: (err) => {
        console.error('Error al crear animal:', err);
        alert('Error al crear el animal');
      }
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