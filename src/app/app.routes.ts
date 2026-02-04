import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule) 
  },
  { 
    path: 'student', 
    loadChildren: () => import('./features/student/student-module').then(m => m.StudentModule) 
  },
  { 
    path: 'instructor', 
    loadChildren: () => import('./features/instructor/instructor-module').then(m => m.InstructorModule) 
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth' } // Catch-all redirect
];