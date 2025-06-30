import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const StudentGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isStudent()) {
    return true;
  }
  
  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/admin/dashboard']);
  }
  
  return router.createUrlTree(['/auth/choice']);
};