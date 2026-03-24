import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api';
import { AlertService } from '../../../core/services/alert.service';
import { LoaderService } from '../../../core/services/loader.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.html',
  styleUrls: ['./student-list.scss'],
  standalone: false
})
export class StudentListComponent implements OnInit {
  students: any[] = [];
  instructorName: string = '';

  constructor(
    private apiService: ApiService, 
    private alertService: AlertService, 
    public loaderService: LoaderService
  ){}

  ngOnInit() {
    this.instructorName = this.apiService.getUser();
    this.loadRoster();
  }

loadRoster() {
  const name = this.apiService.getUser();
  
  if (!name) return;

  // 1. Start the loading spinner
  this.loaderService.show();

  this.apiService.getAllInstructorStudents(name).pipe(
    // 2. This ensures the loader hides whether the call succeeds OR fails
    finalize(() => this.loaderService.hide())
  ).subscribe({
    next: (data: any[]) => {
      this.students = data;
      console.log('Roster updated:', this.students);
    },
    error: (err: any) => {
      console.error('Roster Error:', err);
      this.alertService.error('Error', 'Failed to refresh student list');
    }
  });
}

  approve(student: any) {
    this.apiService.approveEnrollment({ 
      courseCode: student.courseCode, 
      username: student.username 
    }).subscribe(() => {
      this.alertService.success('Approved', `${student.username} can now start learning.`);
      this.loadRoster(); // Refresh
    });
  }
}