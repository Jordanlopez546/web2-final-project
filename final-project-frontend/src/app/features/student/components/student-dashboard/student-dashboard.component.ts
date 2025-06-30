import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatToolbarModule],
  template: `
    <div class="dashboard-container">
      <mat-toolbar color="primary" class="dashboard-header">
        <mat-icon>school</mat-icon>
        <span>Student Portal</span>
        <span class="spacer"></span>
        <span class="welcome-text">Welcome, {{currentUser?.fullName}}</span>
        <button mat-icon-button (click)="logout()" title="Logout">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>

      <div class="dashboard-content">
        <div class="welcome-section">
          <h1>Welcome to Your Student Dashboard! 🎓</h1>
          <p>Your role-based authentication is working perfectly!</p>
        </div>

        <div class="dashboard-cards">
          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>book</mat-icon>
              <mat-card-title>My Courses</mat-card-title>
              <mat-card-subtitle>View enrolled courses</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>Access your enrolled courses and course materials.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" disabled>Coming Soon</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>grade</mat-icon>
              <mat-card-title>My Grades</mat-card-title>
              <mat-card-subtitle>Check your academic progress</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>View your grades and academic performance.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" disabled>Coming Soon</button>
            </mat-card-actions>
          </mat-card>

          <mat-card class="feature-card">
            <mat-card-header>
              <mat-icon mat-card-avatar>star_rate</mat-icon>
              <mat-card-title>Rate Courses</mat-card-title>
              <mat-card-subtitle>Share your feedback</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>Rate and review courses you've completed.</p>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" disabled>Coming Soon</button>
            </mat-card-actions>
          </mat-card>
        </div>

        <div class="user-info">
          <mat-card>
            <mat-card-header>
              <mat-icon mat-card-avatar>person</mat-icon>
              <mat-card-title>Your Information</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <p><strong>Name:</strong> {{currentUser?.fullName}}</p>
              <p><strong>Email:</strong> {{currentUser?.email}}</p>
              <p><strong>Role:</strong> {{currentUser?.role | titlecase}}</p>
              <p><strong>Member since:</strong> {{currentUser?.createdAt | date:'mediumDate'}}</p>
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
      color: #3f51b5;
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
export class StudentDashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
  }
}