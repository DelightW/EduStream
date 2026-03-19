import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { StudentRoutingModule } from './student-routing-module';
import { StudentDashboardComponent } from './sdashboard/sdashboard';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavigationComponent } from "../../navigation/navigation.component";
import { StudentLayoutComponent } from './student-layout.component/student-layout.component';
import { EnrollmentHistory } from './enrollment-history/enrollment-history';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EnrollmentDetails } from './enrollment-details/enrollment-details';
import { C } from '@angular/cdk/keycodes';
import { CourseworkComponent } from './coursework/coursework';
import { CourseViewerComponent } from './course-viewer/course-viewer';


@NgModule({
  declarations: [
    StudentLayoutComponent,
    StudentDashboardComponent,
    CourseworkComponent,
    CourseViewerComponent,
    EnrollmentHistory,
    EnrollmentDetails,
       
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    NavigationComponent,
    MatTooltipModule
]
})
export class StudentModule { }