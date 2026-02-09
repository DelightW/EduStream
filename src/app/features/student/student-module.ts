import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { StudentRoutingModule } from './student-routing-module';
import { StudentDashboardComponent } from './sdashboard/sdashboard';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavigationComponent } from "../../navigation/navigation.component";


@NgModule({
  declarations: [
    StudentDashboardComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    NavigationComponent
]
})
export class StudentModule { }