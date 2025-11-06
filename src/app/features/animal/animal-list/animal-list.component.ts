import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PaginationParams, ApiResponse } from '../../../core/models/api-response.model';
import { AnimalService } from '../../../core/services/animal.service';
import { PropietarioService } from '../../../core/services/propietario.service';
import { Animal, AnimalFilters, CreateAnimalRequest, UpdateAnimalRequest } from '../../../shared/models/animal.model';
import { Propietario } from '../../../shared/models/propietario.model';

@Component({
  selector: 'app-animal-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './animal-list.component.html',
  styleUrls: ['./animal-list.component.scss']
})
export class AnimalListComponent implements OnInit {
  animales: Animal[] = [];
  propietarios: Propietario[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filters: AnimalFilters = {};

  // Modal
  showModal = false;
  editingAnimal: Animal | null = null;

  // Tipado del formulario
  animalForm: CreateAnimalRequest | UpdateAnimalRequest = {
    nombre_animal: '',
    especie_animal: '',
    fecha_nacimiento_animal: '',
    propietario_id: '',
    categoria_id: '',
  };

  constructor(
    private animalService: AnimalService,
    private propietarioService: PropietarioService,
  ) {}

  ngOnInit(): void {
    this.loadAnimales();
    this.loadPropietarios();
  }

  // --- Carga de Datos ---

  loadAnimales(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    // Tipado de respuesta para paginación
    this.animalService.getAnimales(pagination, this.filters).subscribe({
      next: (response: ApiResponse<Animal[]>) => {
        this.animales = response.data;
        // Asumimos que la respuesta incluye totalPages del backend
         this.totalPages = Math.ceil(this.animales.length / this.pageSize);
        this.loading = false;
      },
      error: (err: HttpErrorResponse | any) => {
        console.error('Error al cargar animales:', err);
        this.loading = false;
      }
    });
  }

  loadPropietarios(): void {
    this.propietarioService.getPropietarios().subscribe({
      next: (data: Propietario[]) => (this.propietarios = data),
      error: (err: HttpErrorResponse | any) => console.error('Error al cargar propietarios:', err)
    });
  }

  // --- Paginación y Filtros ---

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadAnimales();
  }

  clearFilters(): void {
    // Para filtros más complejos, es mejor restablecer cada propiedad o usar un objeto inicial
    this.filters = {}; 
    this.currentPage = 1;
    this.loadAnimales();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadAnimales();
    }
  }

  // --- CRUD (Crear, Editar, Eliminar) y Modal ---

  openCreateModal(): void {
    this.editingAnimal = null;
    this.animalForm = { // Resetear a la estructura de CreateAnimalRequest
      nombre_animal: '',
      especie_animal: '',
      fecha_nacimiento_animal: '',
      propietario_id: '',
      categoria_id: ''
    } as CreateAnimalRequest;
    this.showModal = true;
  }

  editAnimal(animal: Animal): void {
    this.editingAnimal = animal;
    // La fecha se extrae hasta el formato 'YYYY-MM-DD' para los inputs de tipo date
    const fechaNacimiento = animal.fecha_nacimiento_animal?.split('T')[0] || ''; 
    
    this.animalForm = { // Cargar datos para edición (UpdateAnimalRequest)
      nombre_animal: animal.nombre_animal,
      especie_animal: animal.especie_animal,
      fecha_nacimiento_animal: fechaNacimiento,
      propietario_id: animal.propietario_id,
      categoria_id: animal.categoria_id
    } as UpdateAnimalRequest;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingAnimal = null;
  }

  saveAnimal(): void {
    // Validación simple
    if (
      !this.animalForm.nombre_animal?.trim() ||
      !this.animalForm.especie_animal?.trim() ||
      !this.animalForm.fecha_nacimiento_animal ||
      !this.animalForm.propietario_id ||
      !this.animalForm.categoria_id
    ) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    const dataToSend = {
      nombre_animal: this.animalForm.nombre_animal,
      especie_animal: this.animalForm.especie_animal,
      fecha_nacimiento_animal: this.animalForm.fecha_nacimiento_animal,
      propietario_id: this.animalForm.propietario_id,
      categoria_id: this.animalForm.categoria_id
    };

    if (this.editingAnimal) {
      // Actualizar animal
      this.animalService.updateAnimal(this.editingAnimal.id_animal, dataToSend as UpdateAnimalRequest).subscribe({
        next: (animalActualizado: Animal) => { // Tipado de respuesta
          this.loadAnimales();
          this.closeModal();
        },
        error: (err: HttpErrorResponse | any) => { // Tipado de error
          console.error('Error al actualizar animal:', err);
          alert(`Error al actualizar el animal: ${err.error?.message || 'Error desconocido'}`);
        }
      });
    } else {
      // Crear nuevo animal
      this.animalService.createAnimal(dataToSend as CreateAnimalRequest).subscribe({
        next: (nuevoAnimal: Animal) => { // Tipado de respuesta
          this.loadAnimales();
          this.closeModal();
        },
        error: (err: HttpErrorResponse | any) => { // Tipado de error
          console.error('Error al crear animal:', err);
          alert(`Error al crear el animal: ${err.error?.message || 'Error desconocido'}`);
        }
      });
    }
  }

  deleteAnimal(animal: Animal): void {
    if (confirm(`¿Está seguro de eliminar al animal "${animal.nombre_animal}"? Esta acción no se puede deshacer.`)) {
      this.animalService.deleteAnimal(animal.id_animal).subscribe({
        next: () => {
          this.loadAnimales();
        },
        error: (err: HttpErrorResponse | any) => { // Tipado de error
          console.error('Error al eliminar animal:', err);
          alert(`Error al eliminar el animal: ${err.error?.message || 'Error desconocido'}`);
        }
      });
    }
  }
}