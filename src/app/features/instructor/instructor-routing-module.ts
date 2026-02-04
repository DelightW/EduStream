import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorDashboardComponent } from '../instructor/dashboard/dashboard';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: InstructorDashboardComponent },
      {path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ] } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule { }
