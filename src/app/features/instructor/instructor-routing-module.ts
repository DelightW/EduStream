import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorDashboardComponent } from './dashboard/dashboard';
import { CourseListComponent } from './course-list/course-list';
import { CourseCreatorComponent } from './course-creator/course-creator';
import { InstructorLayoutComponent } from './instructor-layout.component/instructor-layout.component'; 
const routes: Routes = [
  {
    path: '',
    component: InstructorLayoutComponent,
    children: [
      { path: 'dashboard', component: InstructorDashboardComponent },
      { path: 'my-courses', component: CourseListComponent },
      { path: 'create-course', component: CourseCreatorComponent },
      {path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ] } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule { }
