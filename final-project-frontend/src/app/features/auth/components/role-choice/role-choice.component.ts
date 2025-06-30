import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-role-choice',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="auth-container">
      <!-- Floating Background Elements -->
      <div class="background-elements">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
        <div class="floating-shape shape-5"></div>
        <div class="floating-shape shape-6"></div>
      </div>

      <!-- Main Content -->
      <div class="content-wrapper">
        <div class="auth-header">
          <div class="logo-section">
            <div class="logo-icon">
              <mat-icon>school</mat-icon>
            </div>
            <h1>Welcome to EduPortal</h1>
            <p>Your Gateway to Academic Excellence</p>
          </div>
          <div class="subtitle">
            <span>Choose your role to begin your journey</span>
          </div>
        </div>
        
        <div class="role-cards">
          <!-- Student Card -->
          <div class="role-card student-card">
            <div class="card-background"></div>
            <div class="card-content">
              <div class="card-icon">
                <mat-icon>school</mat-icon>
                <div class="icon-glow"></div>
              </div>
              <div class="card-header">
                <h2>Student Portal</h2>
                <p>Access your academic world</p>
              </div>
              <div class="card-features">
                <div class="feature">
                  <mat-icon>book</mat-icon>
                  <span>View Courses</span>
                </div>
                <div class="feature">
                  <mat-icon>grade</mat-icon>
                  <span>Check Grades</span>
                </div>
                <div class="feature">
                  <mat-icon>star_rate</mat-icon>
                  <span>Rate Courses</span>
                </div>
              </div>
              <div [routerLink]="['/auth/student/login']">
                <button class="action-button student-btn">
                  <span>Continue as Student</span>
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </div>
            <div class="card-glow student-glow"></div>
          </div>

          <!-- Admin Card -->
          <div class="role-card admin-card">
            <div class="card-background"></div>
            <div class="card-content">
              <div class="card-icon">
                <mat-icon>admin_panel_settings</mat-icon>
                <div class="icon-glow"></div>
              </div>
              <div class="card-header">
                <h2>Admin Portal</h2>
                <p>Manage the academic ecosystem</p>
              </div>
              <div class="card-features">
                <div class="feature">
                  <mat-icon>library_books</mat-icon>
                  <span>Manage Courses</span>
                </div>
                <div class="feature">
                  <mat-icon>upload</mat-icon>
                  <span>Upload Grades</span>
                </div>
                <div class="feature">
                  <mat-icon>analytics</mat-icon>
                  <span>View Analytics</span>
                </div>
              </div>
              <div [routerLink]="['/auth/admin/login']">
                <button class="action-button admin-btn">
                  <span>Continue as Admin</span>
                  <mat-icon>arrow_forward</mat-icon>
                </button>
              </div>
            </div>
            <div class="card-glow admin-glow"></div>
          </div>
        </div>

        <!-- Footer -->
        <div class="auth-footer">
          <p>Secure • Modern • Efficient</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, 
        #1e3a8a 0%, 
        #3b82f6 25%,
        #60a5fa 50%,
        #93c5fd 75%,
        #dbeafe 100%);
      background-size: 400% 400%;
      animation: gradientShift 15s ease infinite;
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .background-elements {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .floating-shape {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .shape-1 {
      width: 80px;
      height: 80px;
      top: 10%;
      left: 10%;
      animation: float 20s infinite linear;
    }

    .shape-2 {
      width: 60px;
      height: 60px;
      top: 20%;
      right: 15%;
      animation: float 25s infinite linear reverse;
    }

    .shape-3 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      left: 5%;
      animation: float 30s infinite linear;
    }

    .shape-4 {
      width: 40px;
      height: 40px;
      top: 60%;
      right: 20%;
      animation: float 18s infinite linear reverse;
    }

    .shape-5 {
      width: 120px;
      height: 120px;
      top: 5%;
      left: 50%;
      animation: float 22s infinite linear;
    }

    .shape-6 {
      width: 90px;
      height: 90px;
      bottom: 10%;
      right: 30%;
      animation: float 28s infinite linear reverse;
    }

    @keyframes float {
      from {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.7;
      }
      50% {
        transform: translateY(-20px) rotate(180deg);
        opacity: 1;
      }
      to {
        transform: translateY(0px) rotate(360deg);
        opacity: 0.7;
      }
    }

    .content-wrapper {
      position: relative;
      z-index: 2;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 4rem;
      color: white;
    }

    .logo-section {
      margin-bottom: 2rem;
    }

    .logo-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      animation: pulse 3s ease-in-out infinite;
    }

    .logo-icon mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: white;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    .auth-header h1 {
      font-size: 3.5rem;
      margin-bottom: 0.5rem;
      font-weight: 700;
      background: linear-gradient(45deg, #fff, #f0f0f0);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      animation: titleGlow 3s ease-in-out infinite alternate;
    }

    @keyframes titleGlow {
      from { filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3)); }
      to { filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.6)); }
    }

    .auth-header p {
      font-size: 1.3rem;
      opacity: 0.9;
      font-weight: 300;
    }

    .subtitle {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 50px;
      padding: 0.8rem 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: inline-block;
    }

    .subtitle span {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.95);
    }

    .role-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 3rem;
      max-width: 900px;
      width: 100%;
      margin-bottom: 3rem;
    }

    .role-card {
      position: relative;
      min-height: 500px;
      border-radius: 24px;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transform: translateY(0);
    }

    .card-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 24px;
      transition: all 0.4s ease;
    }

    .role-card:hover {
      transform: translateY(-15px) scale(1.02);
    }

    .role-card:hover .card-background {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.4);
    }

    .card-content {
      position: relative;
      z-index: 2;
      padding: 2.5rem;
      height: 100%;
      display: flex;
      flex-direction: column;
      color: white;
    }

    .card-icon {
      position: relative;
      width: 80px;
      height: 80px;
      margin: 0 auto 2rem;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s ease;
    }

    .card-icon mat-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      z-index: 2;
      position: relative;
    }

    .icon-glow {
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
      border-radius: 25px;
      opacity: 0;
      transition: opacity 0.4s ease;
    }

    .student-card .card-icon {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }

    .admin-card .card-icon {
      background: linear-gradient(135deg, #1e40af, #1e3a8a);
    }

    .role-card:hover .card-icon {
      transform: scale(1.1) rotateY(10deg);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .role-card:hover .icon-glow {
      opacity: 0.6;
    }

    .student-card:hover .icon-glow {
      background: radial-gradient(circle, rgba(59, 130, 246, 0.6), transparent);
    }

    .admin-card:hover .icon-glow {
      background: radial-gradient(circle, rgba(30, 64, 175, 0.6), transparent);
    }

    .card-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .card-header h2 {
      font-size: 1.8rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .card-header p {
      opacity: 0.9;
      font-size: 1rem;
    }

    .card-features {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.8rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .feature:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateX(10px);
    }

    .feature mat-icon {
      font-size: 1.3rem;
      width: 1.3rem;
      height: 1.3rem;
      opacity: 0.9;
    }

    .feature span {
      font-size: 0.95rem;
      font-weight: 500;
    }

    .action-button {
      width: 100%;
      height: 56px;
      border: none;
      border-radius: 16px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.8rem;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
    }

    .student-btn {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }

    .admin-btn {
      background: linear-gradient(135deg, #1e40af, #1e3a8a);
      color: white;
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
    }

    .action-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
    }

    .student-btn:hover {
      box-shadow: 0 12px 35px rgba(59, 130, 246, 0.6);
    }

    .admin-btn:hover {
      box-shadow: 0 12px 35px rgba(30, 64, 175, 0.6);
    }

    .action-button mat-icon {
      transition: transform 0.3s ease;
    }

    .action-button:hover mat-icon {
      transform: translateX(5px);
    }

    .card-glow {
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      opacity: 0;
      transition: opacity 0.4s ease;
      pointer-events: none;
      border-radius: 50%;
      filter: blur(40px);
    }

    .student-glow {
      background: radial-gradient(circle, rgba(59, 130, 246, 0.3), transparent 70%);
    }

    .admin-glow {
      background: radial-gradient(circle, rgba(30, 64, 175, 0.3), transparent 70%);
    }

    .role-card:hover .card-glow {
      opacity: 1;
    }

    .auth-footer {
      text-align: center;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.9rem;
      margin-top: 2rem;
    }

    .auth-footer p {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 25px;
      padding: 0.8rem 2rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: inline-block;
    }

    @media (max-width: 768px) {
      .role-cards {
        grid-template-columns: 1fr;
        max-width: 400px;
        gap: 2rem;
      }
      
      .auth-header h1 {
        font-size: 2.5rem;
      }

      .content-wrapper {
        padding: 1rem;
      }

      .role-card {
        min-height: 450px;
      }

      .card-content {
        padding: 2rem;
      }

      .floating-shape {
        display: none;
      }
    }
  `]
})
export class RoleChoiceComponent {}