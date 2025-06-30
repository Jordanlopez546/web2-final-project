import { Routes } from '@angular/router';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';

export const studentRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: StudentDashboardComponent
  }
];