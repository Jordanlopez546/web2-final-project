import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { 
  User,
  UserRole, 
} from '../models/user.model';
import { AuthResponse, LoginRequest, RegisterAdminRequest, RegisterStudentRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8717/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private jwtHelper = new JwtHelperService();

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadUserFromToken();
  }

  // Student Authentication
  loginStudent(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/student/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data.token, response.data.student!);
            this.currentUserSubject.next(response.data.student!);
          }
        }),
        catchError(this.handleError)
      );
  }

  registerStudent(userData: RegisterStudentRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/student/register`, userData)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data.token, response.data.student!);
            this.currentUserSubject.next(response.data.student!);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Admin Authentication
  loginAdmin(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/admin/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data.token, response.data.admin!);
            this.currentUserSubject.next(response.data.admin!);
          }
        }),
        catchError(this.handleError)
      );
  }

  registerAdmin(userData: RegisterAdminRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/admin/register`, userData)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data.token, response.data.admin!);
            this.currentUserSubject.next(response.data.admin!);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/choice']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) return false;
    
    const token = localStorage.getItem('access_token');
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }
  

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  isAdmin(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  isStudent(): boolean {
    return this.hasRole(UserRole.STUDENT);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('access_token');
  }

  private setSession(token: string, user: User): void {
    if (this.isBrowser) {
      localStorage.setItem('access_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  private loadUserFromToken(): void {
    if (!this.isBrowser) return;
    
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr && !this.jwtHelper.isTokenExpired(token)) {
      try {
        const user = JSON.parse(userStr) as User;
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        this.logout();
      }
    }
  }

  private handleError(error: any): Observable<never> {
    console.error('Auth Service Error:', error);
    let errorMessage = 'An error occurred';
    
    if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}