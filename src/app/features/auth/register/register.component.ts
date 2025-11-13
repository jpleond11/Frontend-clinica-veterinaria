import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { CreateUsuarioRequest } from '../../../shared/models/usuario.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  registerData: CreateUsuarioRequest = {
    primer_nombre_usuario: '',
    segundo_nombre_usuario: '',
    primer_apellido_usuario: '',
    segundo_apellido_usuario: '',
    rol_usuario: 'cliente',
    fecha_nacimiento_usuario: '',
    nombre_usuario: '',
    password: ''
  };
  
  loading = false;

  constructor(
    private usuarioService: UsuarioService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    // TODO: Implementar verificación de autenticación
  }

  onSubmit(): void {
    if (this.loading) return;

    this.loading = true;
    
    this.usuarioService.createUsuario(this.registerData).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Usuario registrado exitosamente');
        this.router.navigate(['/auth/login']);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.notificationService.showError('Error al registrar usuario. Intenta nuevamente.');
        this.loading = false;
      }
    });
  }
}
