import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api';

@Component({
  selector: 'app-student-dashboard',
  standalone: false,
  templateUrl: './sdashboard.html',
  styleUrls: ['./sdashboard.scss']
})
export class StudentDashboardComponent implements OnInit {
  studentName: string = '';
  
  enrolledCourses = [
    { title: 'Intro to Web Design', progress: 100 },
    { title: 'Advanced Angular', progress: 35 },
    { title: 'Database Basics', progress: 0 }
  ];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
  const savedName = this.apiService.getUser();
  this.studentName = savedName ? savedName : 'User';
  }
}