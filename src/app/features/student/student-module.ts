import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // 1. Import this
import { StudentRoutingModule } from './student-routing-module';
import { StudentDashboardComponent } from './sdashboard/sdashboard'; // Ensure path matches your 'sdashboard' folder

@NgModule({
  declarations: [
    StudentDashboardComponent
  ],
  imports: [
    CommonModule, 
    StudentRoutingModule
  ]
})
export class StudentModule { }