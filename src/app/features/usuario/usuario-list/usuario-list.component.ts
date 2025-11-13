import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams, ApiResponse } from '../../../core/models/api-response.model';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Usuario } from '../../../shared/models/usuario.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-list.component.html',
  styleUrl: './usuario-list.component.scss'
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filtroId = '';

  // Modal
  showModal = false;
  editingUsuario: Usuario | null = null;
  usuarioForm = {
    primer_nombre_usuario: '',
    segundo_nombre_usuario: '',
    primer_apellido_usuario: '',
    segundo_apellido_usuario: '',
    rol_usuario: '',
    fecha_nacimiento_usuario: '',
    nombre_usuario: '',
    password: ''
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.usuarioService.getUsuarios(pagination).subscribe({
      next: (response: ApiResponse<Usuario[]>) => {
        this.usuarios = response.data;
        this.totalPages = Math.ceil(this.usuarios.length / this.pageSize);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
      }
    });
  }

  buscarPorId(): void {
          const id = this.filtroId.trim();
          if (!id) {
            this.loadUsuarios();
            return;
          }
      
          this.loading = true;
          this.usuarioService.getUsuarioById(id).subscribe({
            next: (usuario: Usuario) => {
              this.usuarios = [usuario]; // mostrar solo el encontrado
              this.totalPages = 1;
              this.loading = false;
            },
            error: (err: HttpErrorResponse | any) => {
              console.error('Error al buscar animal:', err);
              this.usuarios = [];
              this.loading = false;
            }
          });
        }

  onFilterChange(): void {
    this.loadUsuarios();
  }

  clearFilters(): void {
    this.loadUsuarios();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsuarios();
    }
  }

  openCreateModal(): void {
    this.editingUsuario = null;
    this.usuarioForm = {
      primer_nombre_usuario: '',
      segundo_nombre_usuario: '',
      primer_apellido_usuario: '',
      segundo_apellido_usuario: '',
      rol_usuario: '',
      fecha_nacimiento_usuario: '',
      nombre_usuario: '',
      password: ''
    };
    this.showModal = true;
  }

  editUsuario(usuario: Usuario): void {
    this.editingUsuario = usuario;
    this.usuarioForm = {
      primer_nombre_usuario: usuario.primer_nombre_usuario,
      segundo_nombre_usuario: usuario.segundo_nombre_usuario || '',
      primer_apellido_usuario: usuario.primer_apellido_usuario,
      segundo_apellido_usuario: usuario.segundo_apellido_usuario || '',
      rol_usuario: usuario.rol_usuario,
      fecha_nacimiento_usuario: usuario.fecha_nacimiento_usuario,
      nombre_usuario: usuario.nombre_usuario,
      password: ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingUsuario = null;
  }

  saveUsuario(): void {
    const form = this.usuarioForm;

    if (!form.primer_nombre_usuario.trim() || !form.primer_apellido_usuario.trim() || !form.rol_usuario.trim() || !form.nombre_usuario.trim()) {
      alert('Los campos obligatorios deben completarse');
      return;
    }

    if (!this.editingUsuario && !form.password.trim()) {
      alert('La contraseña es requerida para nuevos usuarios');
      return;
    }

    if (this.editingUsuario) {
      const updateData: any = {
        primer_nombre_usuario: form.primer_nombre_usuario,
        segundo_nombre_usuario: form.segundo_nombre_usuario,
        primer_apellido_usuario: form.primer_apellido_usuario,
        segundo_apellido_usuario: form.segundo_apellido_usuario,
        rol_usuario: form.rol_usuario,
        fecha_nacimiento_usuario: form.fecha_nacimiento_usuario,
        nombre_usuario: form.nombre_usuario
      };

      if (form.password.trim()) {
        updateData.password = form.password;
      }

      this.usuarioService.updateUsuario(this.editingUsuario.id_usuario, updateData).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
          alert('Error al actualizar el usuario');
        }
      });
    } else {
      const newUsuario = { ...form };

      this.usuarioService.createUsuario(newUsuario).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error al crear usuario:', error);
          alert('Error al crear el usuario');
        }
      });
    }
  }

  deleteUsuario(usuario: Usuario): void {
    if (confirm(`¿Está seguro de eliminar el usuario "${usuario.nombre_usuario}"?`)) {
      this.usuarioService.deleteUsuario(usuario.id_usuario).subscribe({
        next: () => this.loadUsuarios(),
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
        }
      });
    }
  }
}
