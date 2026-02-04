import { Component } from '@angular/core';
import { ApiService } from '../../../core/services/api';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class InstructorDashboardComponent {
instructorName: any;
  constructor(private apiService: ApiService) {}
  ngOnInit() {
    this.instructorName = this.apiService.loggedInUser || 'Instructor';
  }
  greetingmessages = ['Hello', 'Welcome back', 'Good to see you again'];
}

