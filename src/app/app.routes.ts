import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: 'auth', 
    // Points to the file 'auth-module' and looks for the class 'AuthModule'
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule) 
  },
  { 
    path: 'student', 
    loadChildren: () => import('./features/student/student-module').then(m => m.StudentModule) 
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' }
];