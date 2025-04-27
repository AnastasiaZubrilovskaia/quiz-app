import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Testing Platform</span>
      
      <nav class="nav-links">
        <!-- Меню для студента -->
        <a mat-button 
           routerLink="/student/history" 
           routerLinkActive="active-link">
          Student Panel
        </a>
        
        <!-- Меню для преподавателя -->
        <a mat-button 
           routerLink="/teacher/create-test" 
           routerLinkActive="active-link">
          Teacher Panel
        </a>
      </nav>
    </mat-toolbar>

    <main class="content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    mat-toolbar {
      justify-content: space-between;
    }
    
    .nav-links {
      display: flex;
      gap: 20px;
    }
    
    .active-link {
      background: rgba(255,255,255,0.2);
    }
    
    .content {
      flex: 1;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
  `
})
export class AppComponent {
  title = 'angular-testing-platform';
}
