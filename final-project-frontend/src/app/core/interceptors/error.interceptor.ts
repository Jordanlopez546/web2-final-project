import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Check if this is a login request (don't auto-logout on login failures)
      const isLoginRequest = req.url.includes('/auth/') && 
                            (req.url.includes('/login') || req.url.includes('/register'));
      
      if (error.status === 401 && !isLoginRequest) {
        // Unauthorized on protected routes - logout and redirect
        authService.logout();
      } else if (error.status === 403) {
        // Forbidden - redirect to appropriate dashboard based on current user
        const user = authService.getCurrentUser();
        if (user) {
          if (user.role === 'admin') {
            router.navigate(['/admin/dashboard']);
          } else {
            router.navigate(['/student/dashboard']);
          }
        } else {
          // No user info, redirect to choice
          router.navigate(['/auth/choice']);
        }
      }
      
      return throwError(() => error);
    })
  );
};
