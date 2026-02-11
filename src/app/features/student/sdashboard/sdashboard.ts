import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { LoaderService } from '../../../core/services/loader.service';

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
 

  enrolledCourses = [
    { title: 'Intro to Web Design', progress: 100 },
    { title: 'Advanced Angular', progress: 35 },
    { title: 'Database Basics', progress: 0 }
  ];

  constructor(
    private apiService: ApiService, 
    private fb: FormBuilder, 
    private alertService: AlertService,
    public loaderService: LoaderService,
  ) {}

  ngOnInit() {
    this.loadSchools();
    
    this.selectedSchool = localStorage.getItem('userSchool') || '';
    const savedName = this.apiService.getUser();
    this.studentName = savedName ? savedName : 'Student';

    this.enrollForm = this.fb.group({
      courseCode: ['', [Validators.required, Validators.minLength(4)]],
      studentEmail: ['', [Validators.required, Validators.email]],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadSchools() {
    this.apiService.getSchools().subscribe((data) => {
      this.schools = [...data];
    });
  }

  onSchoolChange(event: any) {
    const schoolName = event.target.value;
    if (schoolName) {
      localStorage.setItem('userSchool', schoolName);
      this.alertService.toast(`School updated to ${schoolName}`);
    }
  }

  openModal() { 
    this.showEnrollModal = true; 
  }

  closeModal() {
    this.showEnrollModal = false;
    this.enrollForm.reset();
  }

onEnroll() {
    if (this.enrollForm.valid) {
      const formData = this.enrollForm.value;

      this.apiService.enrollInCourse(formData).subscribe((response) => {
          const newCourse = { title: formData.courseCode, progress: 0 };
          this.enrolledCourses.push(newCourse);
          this.closeModal();
          this.alertService.success('Enrollment Requested', `Success! Requested enrollment for ${newCourse.title}`);
      }); 

    } else {
      this.alertService.error('Invalid Form', 'Please fill out all fields correctly.');
    }
  } 
} 