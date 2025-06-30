import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleRedirectGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/choice']);
  }
  
  if (authService.isAdmin()) {
    return router.createUrlTree(['/admin/dashboard']);
  } else if (authService.isStudent()) {
    return router.createUrlTree(['/student/dashboard']);
  }
  
  return router.createUrlTree(['/auth/choice']);
};