import { Routes } from '@angular/router';
import { RoleChoiceComponent } from './components/role-choice/role-choice.component';
import { StudentLoginComponent } from './components/student-login/student-login.component';
import { StudentRegisterComponent } from './components/student-register/student-register.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminRegisterComponent } from './components/admin-register/admin-register.component';

export const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'choice',
    pathMatch: 'full'
  },
  {
    path: 'choice',
    component: RoleChoiceComponent
  },
  {
    path: 'student',
    children: [
      {
        path: 'login',
        component: StudentLoginComponent
      },
      {
        path: 'register',
        component: StudentRegisterComponent
      }
    ]
  },
  {
    path: 'admin',
    children: [
      {
        path: 'login',
        component: AdminLoginComponent
      },
      {
        path: 'register',
        component: AdminRegisterComponent
      }
    ]
  }
];