import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorRoutingModule } from './instructor-routing-module';
import { InstructorDashboardComponent } from './dashboard/dashboard';
import { CourseListComponent } from './course-list/course-list';
import { C } from '@angular/cdk/keycodes';
import { CourseCreatorComponent } from './course-creator/course-creator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InstructorLayoutComponent } from './instructor-layout.component/instructor-layout.component';
import { CourseCatalogComponent } from './course-catalog/course-catalog';
import { StudentListComponent } from './student-list/student-list';

@NgModule({
  declarations: [
    InstructorLayoutComponent,
    InstructorDashboardComponent,
    CourseListComponent,
    CourseCreatorComponent,
    CourseCatalogComponent,
    StudentListComponent
  ],
  imports: [
    CommonModule,
    InstructorRoutingModule,
    ReactiveFormsModule, 
    FormsModule
  ]
})
export class InstructorModule { }
