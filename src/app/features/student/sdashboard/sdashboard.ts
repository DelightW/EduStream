import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: false,
  templateUrl: './sdashboard.html',
  styleUrls: ['./sdashboard.scss']
})
export class StudentDashboardComponent implements OnInit {
  studentName: string = '';
  enrollForm!: FormGroup;
  showEnrollModal: boolean = false;
  schools: any[] = [];
  selectedSchool: string = '';
  isLoadingSchools: boolean = true;
  editingId: number | null = null;
  history: any[] = []; 

  enrolledCourses = [
    { title: 'Intro to Web Design', progress: 100 },
    { title: 'Advanced Angular', progress: 35 },
    { title: 'Database Basics', progress: 0 }
  ];

  constructor(
    private apiService: ApiService, 
    private fb: FormBuilder, 
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.loadSchools();
    this.loadHistory(); 
    
    this.selectedSchool = localStorage.getItem('userSchool') || '';
    const savedName = this.apiService.getUser();
    this.studentName = savedName ? savedName : 'Student';

    this.enrollForm = this.fb.group({
      courseCode: ['', [Validators.required, Validators.minLength(5)]],
      studentEmail: ['', [Validators.required, Validators.email]],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadSchools() {
    this.isLoadingSchools = true;
    this.apiService.getSchools().subscribe({
      next: (data) => { 
        console.log('Schools loaded successfully:', data);
        this.schools = data; 
        this.isLoadingSchools = false; 
      },
      error: (err) => {
        console.error('Final fallback: Failed to load schools', err);
        this.isLoadingSchools = false; 
      }
    });
  }

  loadHistory() {
    this.apiService.getEnrollmentHistory().subscribe({
      next: (data: any[]) => {
        this.history = data;
      },
      error: (err: any) => console.error('Could not load history', err)
    });
  }

  onSchoolChange(event: any) {
    const schoolName = event.target.value;
    if (schoolName) {
      localStorage.setItem('userSchool', schoolName);
    }
  }

  editEnrollment(item: any) {
    this.editingId = item.id;
    this.showEnrollModal = true;
    
    this.enrollForm.patchValue({
      courseCode: item.courseCode,
      studentEmail: item.studentEmail,
      reason: item.reason
    });
  }

  openModal() { 
    this.showEnrollModal = true; 
  }

  closeModal() {
    this.showEnrollModal = false;
    this.editingId = null;
    this.enrollForm.reset();
  }
  onEnroll() {
    if (this.enrollForm.valid) {
      const formData = this.enrollForm.value;

      if (this.editingId) {-
        this.apiService.updateEnrollment(this.editingId, formData).subscribe({
          next: () => {
            this.loadHistory();
            this.closeModal();
            this.alertService.success('Enrollment Updated', 'Your enrollment has been updated successfully.');
          },
          error: (err: any) => {
            console.error('Update Failed:', err);
            this.alertService.error('Update Failed', 'There was an error updating your enrollment.');
          }
        });
      } else {
        this.apiService.enrollInCourse(formData).subscribe({
          next: (response) => {
            const newCourse = { title: formData.courseCode, progress: 0 };
            this.enrolledCourses.push(newCourse);
            this.loadHistory();
            this.closeModal();
            this.alertService.success('Enrollment Requested', `Success! Requested enrollment for ${newCourse.title}`);
          },
          error: (error) => {
            this.alertService.error('Enrollment Failed', 'There was an error processing your enrollment.');
          }
        });
      }
    } else {
      this.alertService.error('Invalid Form', 'Please fill out all fields correctly before submitting.');
    }
  }
}