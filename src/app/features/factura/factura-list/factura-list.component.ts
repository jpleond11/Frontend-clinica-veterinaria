import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams, ApiResponse } from '../../../core/models/api-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { FacturaService } from '../../../core/services/factura.service';
import { Factura, CreateFacturaRequest, UpdateFacturaRequest } from '../../../shared/models/factura.model';

@Component({
  selector: 'app-factura-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './factura-list.component.html',
  styleUrls: ['./factura-list.component.scss']
})
export class FacturaListComponent implements OnInit {
  facturas: Factura[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  filtroId = '';

  // Modal
  showModal = false;
  editingFactura: Factura | null = null;

  facturaForm: CreateFacturaRequest & { usuario_id_creacion?: string, usuario_id_edicion?: string } = {
    monto_factura: 0,
    descripcion_factura: '',
    fecha_emision: '',
    cita_id: '',
    usuario_id_creacion: '',
    usuario_id_edicion: ''
  };

  constructor(
    private facturaService: FacturaService,
  ) {}

  ngOnInit(): void {
    this.loadFacturas();
  }

  loadFacturas(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };

    this.facturaService.getFacturas(pagination).subscribe({
      next: (response: ApiResponse<Factura[]>) => {
        this.facturas = response.data;
        this.totalPages = Math.ceil(this.facturas.length / this.pageSize);
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar facturas:', error);
        this.loading = false;
      }
    });
  }

  buscarPorId(): void {
        const id = this.filtroId.trim();
        if (!id) {
          this.loadFacturas();
          return;
        }
    
        this.loading = true;
        this.facturaService.getFacturaById(id).subscribe({
          next: (factura: Factura) => {
            this.facturas = [factura]; // mostrar solo el encontrado
            this.totalPages = 1;
            this.loading = false;
          },
          error: (err: HttpErrorResponse | any) => {
            console.error('Error al buscar animal:', err);
            this.facturas = [];
            this.loading = false;
          }
        });
      }

  onFilterChange(): void {
    this.loadFacturas();
  }

  clearFilters(): void {
    this.loadFacturas();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  openCreateModal(): void {
    this.editingFactura = null;
    this.facturaForm = {
      monto_factura: 0,
      descripcion_factura: '',
      fecha_emision: '',
      cita_id: '',
      usuario_id_creacion: '',
      usuario_id_edicion: ''
    };
    this.showModal = true;
  }

  editFactura(factura: Factura): void {
    this.editingFactura = factura;
    this.facturaForm = {
      monto_factura: factura.monto_factura,
      descripcion_factura: factura.descripcion_factura,
      fecha_emision: factura.fecha_emision?.split('T')[0] || '',
      cita_id: factura.cita_id,
      usuario_id_creacion: factura.usuario_id_creacion,
      usuario_id_edicion: ''
    };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveFactura(): void {
  const {
    monto_factura,
    descripcion_factura,
    fecha_emision,
    cita_id,
    usuario_id_creacion,
    usuario_id_edicion
  } = this.facturaForm;

  // Validación
  if (
    monto_factura === undefined || monto_factura === null || // permite number o string
    (!descripcion_factura?.trim()) ||
    !cita_id?.trim()
  ) {
    alert('Los campos con * son obligatorios.');
    return;
  }

  // Normalizar monto: si viene string => parseFloat, si viene number => usarlo
  const parsedMonto: number = typeof monto_factura === 'string'
    ? parseFloat(monto_factura)
    : Number(monto_factura);

  // Normalizar fecha_emision: enviar undefined si está vacía
  const fechaEmisionNormalized: string | undefined = fecha_emision?.trim() || undefined;

  if (this.editingFactura) {
    const updateData: UpdateFacturaRequest = {
      monto_factura: parsedMonto,
      descripcion_factura: descripcion_factura.trim(),
      fecha_emision: fechaEmisionNormalized,
      cita_id: cita_id.trim(),
      // usuario_id_edicion es opcional; tu interfaz permite string | null
      usuario_id_edicion: usuario_id_edicion?.trim() || null
    };

    this.facturaService
      .updateFactura(this.editingFactura.id_factura, updateData)
      .subscribe({
        next: () => {
          this.loadFacturas();
          this.closeModal();
        },
        error: (error: any) => {
          console.error('Error al actualizar factura:', error);
          alert('Error al actualizar la factura');
        }
      });

  } else {
    if (!usuario_id_creacion?.trim()) {
      alert('El campo "Usuario Creación" es obligatorio.');
      return;
    }

    const newFactura: CreateFacturaRequest = {
      monto_factura: parsedMonto,
      descripcion_factura: descripcion_factura.trim(),
      fecha_emision: fechaEmisionNormalized, // CreateFacturaRequest acepta fecha_emision?: string
      cita_id: cita_id.trim(),
      usuario_id_creacion: usuario_id_creacion.trim()
    };

    this.facturaService.createFactura(newFactura).subscribe({
      next: () => {
        this.loadFacturas();
        this.closeModal();
      },
      error: (error: any) => {
        console.error('Error al crear factura:', error);
        alert('Error al crear la factura');
      }
    });
  }
}


  deleteFactura(factura: Factura): void {
  const fecha = new Date(factura.fecha_emision).toLocaleDateString();
  if (confirm(`¿Está seguro de eliminar la factura del ${fecha}?`)) {
    this.facturaService.deleteFactura(factura.id_factura).subscribe({
      next: () => {
        this.loadFacturas();
      },
      error: (error: any) => {
        console.error('Error al eliminar factura:', error);
      }
    });
  }
}
}
