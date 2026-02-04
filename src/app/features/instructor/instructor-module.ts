import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstructorRoutingModule } from './instructor-routing-module';
import { InstructorDashboardComponent } from './dashboard/dashboard';


@NgModule({
  declarations: [
    InstructorDashboardComponent
  ],
  imports: [
    CommonModule,
    InstructorRoutingModule
  ]
})
export class InstructorModule { }
