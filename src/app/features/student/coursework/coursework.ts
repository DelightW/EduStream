import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api';

@Component({
  selector: 'app-coursework',
  standalone: false,
  templateUrl: './coursework.html',
  styleUrls: ['./coursework.scss'] 
})
export class CourseworkComponent implements OnInit {
  enrolledCourses: any[] = [];
  username: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.username = this.apiService.getUser();
    this.loadEnrolledCourses();
  }

  loadEnrolledCourses(): void {
    this.apiService.getEnrolledCourses(this.username).subscribe({
      next: (data) => {
        this.enrolledCourses = data;
      },
      error: (err) => console.error('Error fetching coursework:', err)
    });
  }

  openViewer(courseId: string): void {
    this.router.navigate(['/student/course-viewer', courseId]);
  }
}