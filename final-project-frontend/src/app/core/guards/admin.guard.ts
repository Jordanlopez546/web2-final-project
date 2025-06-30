import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AdminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  }
  
  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/student/dashboard']);
  }
  
  return router.createUrlTree(['/auth/choice']);
};