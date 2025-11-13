import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, SidebarComponent],
  template: `
    <div class="wrapper">
      <div class="sidebar">
        <app-sidebar></app-sidebar>
      </div>
      <div class="main-panel">
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Layout base */
    .wrapper {
      display: flex;
      min-height: 100vh;
    }

    /* Sidebar principal */
    .sidebar {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1000;
      width: 260px;
      background: linear-gradient(135deg, #2ecc71 0%, #1abc9c 50%, #3498db 100%) !important;
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      color: white;
    }

    /* Panel de contenido */
    .main-panel {
      flex: 1;
      margin-left: 260px;
      background: #f8f9fa;
      min-height: 100vh;
      transition: margin-left 0.3s ease;
    }

    .content {
      padding: 20px;
    }

    /* Responsive */
    @media (max-width: 991px) {
      .sidebar {
        transform: translate3d(-260px, 0, 0);
        transition: all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1);
      }

      .sidebar.show {
        transform: translate3d(0, 0, 0);
      }

      .main-panel {
        margin-left: 0;
      }
    }
  `]
})
export class AppComponent {
  title = 'frontend-angular-clean-architecture';
}