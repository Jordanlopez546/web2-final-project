import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterModule,
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <!-- Background Elements -->
      <div class="background-elements">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
      </div>

      <div class="auth-card-container">
        <mat-card class="auth-card admin-theme">
          <mat-card-header class="auth-header">
            <div class="header-content">
              <div class="role-icon-container">
                <mat-icon class="role-icon">admin_panel_settings</mat-icon>
              </div>
              <div class="header-text">
                <mat-card-title>Create Admin Account</mat-card-title>
                <mat-card-subtitle>Setup administrator access</mat-card-subtitle>
              </div>
            </div>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
              <mat-form-field style="margin-bottom: -10px;" appearance="outline" class="full-width">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="fullName" placeholder="Administrator Name">
                <mat-icon matSuffix>person</mat-icon>
                <mat-error *ngIf="registerForm.get('fullName')?.hasError('required')">
                  Full name is required
                </mat-error>
                <mat-error *ngIf="registerForm.get('fullName')?.hasError('minlength')">
                  Name must be at least 2 characters
                </mat-error>
              </mat-form-field>

              <mat-form-field style="margin-bottom: -10px;" appearance="outline" class="full-width">
                <mat-label>Administrator Email</mat-label>
                <input matInput type="email" formControlName="email" placeholder="admin@example.com">
                <mat-icon matSuffix>email</mat-icon>
                <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                  Email is required
                </mat-error>
                <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                  Please enter a valid email
                </mat-error>
              </mat-form-field>

              <mat-form-field style="margin-bottom: -10px;" appearance="outline" class="full-width">
                <mat-label>Password</mat-label>
                <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
                <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                  Password is required
                </mat-error>
                <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                  Password must be at least 6 characters
                </mat-error>
              </mat-form-field>

              <div class="form-actions">
                <button mat-raised-button type="submit" 
                        [disabled]="registerForm.invalid || isLoading" class="submit-btn">
                  <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
                  <mat-icon style="color: white;" *ngIf="!isLoading">admin_panel_settings</mat-icon>
                  <span style="color: white;" *ngIf="!isLoading">Create Admin Account</span>
                  <span style="color: white;" *ngIf="isLoading">Creating Account...</span>
                </button>
              </div>
            </form>
          </mat-card-content>

          <mat-card-actions class="auth-actions">
            <div class="action-links">
              <p>Already have an admin account?</p>
              <button mat-button class="register-link" [routerLink]="['/auth/admin/login']">
                Sign In to Admin Account
              </button>
            </div>
            
            <div class="navigation-links">
              <button mat-stroked-button class="nav-btn back-btn" [routerLink]="['/auth/choice']">
                <mat-icon>arrow_back</mat-icon>
                Back to Role Selection
              </button>
              <button mat-stroked-button class="nav-btn student-btn" [routerLink]="['/auth/student/register']">
                Student Register
                <mat-icon>school</mat-icon>
              </button>
            </div>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, 
        #1e3a8a 0%, 
        #1e40af 25%,
        #3730a3 50%,
        #4338ca 75%,
        #6366f1 100%);
      background-size: 200% 200%;
      animation: gentleShift 15s ease infinite;
      overflow: hidden;
    }

    @keyframes gentleShift {
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
      backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: float 20s infinite linear;
    }

    .shape-1 {
      width: 80px;
      height: 80px;
      top: 20%;
      left: 10%;
      animation-duration: 25s;
    }

    .shape-2 {
      width: 60px;
      height: 60px;
      top: 70%;
      right: 15%;
      animation-duration: 30s;
      animation-direction: reverse;
    }

    .shape-3 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      left: 70%;
      animation-duration: 35s;
    }

    @keyframes float {
      from {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.4;
      }
      50% {
        transform: translateY(-15px) rotate(180deg);
        opacity: 0.8;
      }
      to {
        transform: translateY(0px) rotate(360deg);
        opacity: 0.4;
      }
    }

    .auth-card-container {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 450px;
    }

    .auth-card {
      padding: 2.5rem;
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(30, 58, 138, 0.3);
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }

    .admin-theme {
      border-top: 4px solid #1e40af;
    }

    .auth-card:hover {
      box-shadow: 0 20px 40px rgba(30, 58, 138, 0.4);
      transform: translateY(-2px);
    }

    .auth-header {
      margin-bottom: 2.5rem;
      text-align: center;
    }

    .header-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      width: 100%;
    }

    .role-icon-container {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #1e40af, #1e3a8a);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
      transition: transform 0.3s ease;
    }

    .role-icon-container:hover {
      transform: scale(1.05);
    }

    .role-icon {
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      color: white;
    }

    .header-text {
      text-align: center;
    }

    .header-text mat-card-title {
      font-size: 1.8rem;
      font-weight: 600;
      color: #1e3a8a;
      margin-bottom: 0.5rem;
    }

    .header-text mat-card-subtitle {
      color: #64748b;
      font-size: 1rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .full-width {
      width: 100%;
    }

    .full-width .mat-mdc-form-field-focus-overlay {
      background-color: rgba(30, 64, 175, 0.1);
    }

    .form-actions {
      margin-top: 1rem;
    }

    .submit-btn {
      width: 100%;
      height: 52px;
      font-size: 1rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, #1e40af, #1e3a8a);
      color: white;
      border: none;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(30, 64, 175, 0.4);
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.6);
    }

    .submit-btn:disabled {
      background: linear-gradient(135deg, #94a3b8, #64748b);
      box-shadow: none;
    }

    .auth-actions {
      margin-top: 2.5rem;
      flex-direction: column;
      gap: 2rem;
    }

    .action-links {
      text-align: center;
    }

    .action-links p {
      margin: 0 0 0.8rem 0;
      color: #64748b;
      font-size: 0.95rem;
    }

    .register-link {
      color: #1e40af;
      font-weight: 600;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .register-link:hover {
      background: rgba(30, 64, 175, 0.1);
    }

    .navigation-links {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .nav-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 1.2rem;
      border-radius: 10px;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .back-btn {
      color: #64748b;
      border-color: #cbd5e1;
    }

    .back-btn:hover {
      background: rgba(100, 116, 139, 0.1);
      border-color: #64748b;
    }

    .student-btn {
      color: #3b82f6;
      border-color: #60a5fa;
    }

    .student-btn:hover {
      background: rgba(59, 130, 246, 0.1);
      border-color: #3b82f6;
    }

    /* Admin-specific form field styling */
    .admin-theme .mat-mdc-form-field-focus-overlay {
      background-color: rgba(30, 64, 175, 0.1);
    }

    .admin-theme .mat-mdc-text-field-wrapper.mdc-text-field--focused .mat-mdc-form-field-focus-overlay {
      opacity: 1;
    }

    @media (max-width: 600px) {
      .auth-container {
        padding: 1rem;
      }
      
      .auth-card {
        padding: 2rem;
      }
      
      .navigation-links {
        flex-direction: column;
        align-items: center;
      }
      
      .nav-btn {
        width: 100%;
        justify-content: center;
      }

      .floating-shape {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .auth-card {
        padding: 1.5rem;
      }

      .header-content {
        gap: 1rem;
      }

      .role-icon-container {
        width: 60px;
        height: 60px;
      }

      .role-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }
    }
  `]
})
export class AdminRegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      this.authService.registerAdmin(this.registerForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Admin account created successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          const message = error.message || 'Registration failed. Please try again.';
          this.snackBar.open(message, 'Close', { duration: 5000 });
        }
      });
    }
  }
}