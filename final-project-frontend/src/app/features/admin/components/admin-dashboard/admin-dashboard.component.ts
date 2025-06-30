import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatToolbarModule],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="accent" class="dashboard-header">
        <mat-icon>admin_panel_settings</mat-icon>
        <span>Admin Portal</span>
        <span class="spacer"></span>
        <span class="welcome-text">Welcome, {{currentUser?.fullName}}</span>
        <button mat-icon-button (click)="logout()" title="Logout">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>

      <div class="dashboard-content">
        <div class="welcome-section">
          <h1>Welcome to Admin Dashboard! ⚡</h1>
          <p>Your role-based authentication is working perfectly!</p>
        </div>

        <div class="dashboard-cards">
          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>library_books</mat-icon>
              <mat-card-title>Manage Courses</mat-card-title>
              <mat-card-subtitle>Create and edit courses</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>Add new courses, edit existing ones, and manage course content.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="accent" disabled>Coming Soon</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>upload</mat-icon>
              <mat-card-title>Upload Grades</mat-card-title>
              <mat-card-subtitle>Manage student grades</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>Upload and manage grades for all students and courses.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="accent" disabled>Coming Soon</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>people</mat-icon>
              <mat-card-title>Manage Students</mat-card-title>
              <mat-card-subtitle>View and manage student accounts</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>View student information and manage their accounts.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="accent" disabled>Coming Soon</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>analytics</mat-icon>
              <mat-card-title>Analytics</mat-card-title>
              <mat-card-subtitle>View system analytics</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>View detailed analytics and reports about the system.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="accent" disabled>Coming Soon</button>
            </mat-card-actions>
          </mat-card>
        </div>

        <div class="user-info">
          <mat-card>
            <mat-card-header>
              <mat-icon mat-card-avatar>person</mat-icon>
              <mat-card-title>Administrator Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p><strong>Name:</strong> {{currentUser?.fullName}}</p>
              <p><strong>Email:</strong> {{currentUser?.email}}</p>
              <p><strong>Role:</strong> {{currentUser?.role | titlecase}}</p>
              <p><strong>Admin since:</strong> {{currentUser?.createdAt | date:'mediumDate'}}</p>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .dashboard-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      gap: 1rem;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .welcome-text {
      margin-right: 1rem;
    }

    .dashboard-content {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 3rem;
    }

    .welcome-section h1 {
      color: #ff4081;
      margin-bottom: 1rem;
    }

    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .feature-card {
      transition: transform 0.2s ease;
      border-left: 4px solid #ff4081;
    }

    .feature-card:hover {
      transform: translateY(-4px);
    }

    .user-info {
      max-width: 500px;
      margin: 0 auto;
    }

    mat-icon[mat-card-avatar] {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: #ff4081;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        padding: 1rem;
      }
      
      .dashboard-cards {
        grid-template-columns: 1fr;
      }
      
      .welcome-text {
        display: none;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
  }
}