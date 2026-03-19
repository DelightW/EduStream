import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api';
import { AlertService } from '../../../core/services/alert.service';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-coursework',
  templateUrl: './coursework.html',
  styleUrls: ['./coursework.scss'] ,
  standalone: false,
})
export class CourseworkComponent implements OnInit {
  enrolledCourses: any[] = [];
  username: string = '';

  constructor(
    private apiService: ApiService, 
    private router: Router, 
    private alertService: AlertService, 
    public loaderService: LoaderService // ensure this is public for async pipe if used
  ) {}

  ngOnInit() {
    this.username = this.apiService.getUser() || '';
    if (this.username) {
      this.loaderService.show();
      this.loadEnrolledCourses();
    }
  }

  loadEnrolledCourses(): void {
    this.apiService.getEnrolledCourses(this.username).subscribe({
      next: (data) => {
        this.enrolledCourses = data;
      },
      error: (err) => {
        console.error('Error fetching coursework:', err);
        this.alertService.error('Error', 'Error fetching coursework');
        this.loaderService.hide();
      },
      complete: () => {
        this.loaderService.hide();
      }
    });
  }

  goToCourse(courseCode: string): void {
    this.router.navigate(['/student/course-viewer', courseCode]);
  }
}