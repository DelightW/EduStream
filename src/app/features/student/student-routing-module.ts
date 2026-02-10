import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './sdashboard/sdashboard';
import { StudentLayoutComponent } from './student-layout.component/student-layout.component';
import { EnrollmentHistory} from './enrollment-history/enrollment-history';
const routes: Routes = [
  { 
    path: '', 
    component: StudentLayoutComponent,
    children: [
      { path: 'sdashboard', component: StudentDashboardComponent },
      { path: 'enrollment-history', component: EnrollmentHistory},
      { path: '', redirectTo: 'sdashboard', pathMatch: 'full'}
    ] }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }