import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule) 
  },
  { 
    path: 'student', 
    loadChildren: () => import('./features/student/student-module').then(m => m.StudentModule),
    canActivate: [authGuard]
  },
  { 
    path: 'instructor', 
    loadChildren: () => import('./features/instructor/instructor-module').then(m => m.InstructorModule),
    canActivate: [authGuard]
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' }
];