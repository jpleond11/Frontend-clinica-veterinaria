import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { CitaService } from '../../../core/services/cita.service';

Chart.register(...registerables);

@Component({
  selector: 'app-citas-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card glass" style="padding: 1rem;">
      <h3 class="text-center mb-3">Citas en los últimos 3 meses</h3>
      <canvas #chartCanvas></canvas>
    </div>
  `
})
export class CitasChartComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private citas: any[] = [];

  constructor(private citaService: CitaService) {}

  ngOnInit(): void {
    this.citaService.getCitasUltimos3Meses().subscribe(citas => {
      this.citas = citas;
      this.tryRenderChart();
    });
  }

  ngAfterViewInit(): void {
    this.tryRenderChart();
  }

  private tryRenderChart() {
    if (!this.citas.length || !this.chartCanvas) return;

    const grouped = this.groupByMonth(this.citas);
    this.renderChart(grouped.labels, grouped.values);
  }

  private groupByMonth(citas: any[]) {
    const map = new Map<string, number>();

    citas.forEach(cita => {
      const fecha = new Date(cita.fecha_inicio_cita);
      const key = fecha.toLocaleString('es-CO', {
        month: 'long',
        year: 'numeric'
      });
      map.set(key, (map.get(key) || 0) + 1);
    });

    return {
      labels: Array.from(map.keys()),
      values: Array.from(map.values())
    };
  }

  private renderChart(labels: string[], values: number[]) {
    new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Citas registradas',
            data: values
          }
        ]
      }
    });
  }
}
