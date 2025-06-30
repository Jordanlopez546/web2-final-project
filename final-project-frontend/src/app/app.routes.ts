import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { StudentGuard } from './core/guards/student.guard';
import { RoleRedirectGuard } from './core/guards/role-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [RoleRedirectGuard],
    children: []
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [AdminGuard]
  },
  {
    path: 'student',
    loadChildren: () => import('./features/student/student.routes').then(m => m.studentRoutes),
    canActivate: [StudentGuard]
  },
  {
    path: '**',
    redirectTo: '/auth/choice'
  }
];