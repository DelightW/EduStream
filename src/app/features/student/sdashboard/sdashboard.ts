import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { LoaderService } from '../../../core/services/loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: false,
  templateUrl: './sdashboard.html',
  styleUrls: ['./sdashboard.scss']
})
export class StudentDashboardComponent implements OnInit {
  studentName: string = '';
  enrolledCourses: any[] = [];
  enrollForm!: FormGroup;
  showEnrollModal: boolean = false;
  schools: any[] = [];
  selectedSchool: string = '';

  constructor(
    private apiService: ApiService, 
    private fb: FormBuilder, 
    private alertService: AlertService,
    public loaderService: LoaderService,
    private router: Router,
  ) {}

  logout() {
    this.apiService.clearUser();
    this.studentName = '';
    this.enrolledCourses = [];
    this.selectedSchool = '';
    this.router.navigate(['/auth/login'], { replaceUrl: true }). then(() => {
      window.location.reload();
    });
  }

  ngOnInit() {
    this.loadSchools();
    
    const savedName = this.apiService.getUser();
    this.studentName = savedName ? savedName : 'Student';

    if (savedName) {

      const localSchool = sessionStorage.getItem(`${savedName}_userSchool`);
      if (localSchool) {
        this.selectedSchool = localSchool;
      }

      this.apiService.getUserSchool(savedName).subscribe({
        next: (pref) => {
          if (pref && pref.schoolName) {
            this.selectedSchool = pref.schoolName;
            sessionStorage.setItem(`${savedName}_userSchool`, pref.schoolName);
          }
        }
      });

      this.loadUserCourses(savedName);
    } 

    this.enrollForm = this.fb.group({
      courseCode: ['', [Validators.required, Validators.minLength(4)]],
      studentEmail: ['', [Validators.required, Validators.email]],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadUserCourses(username: string) {
    this.apiService.getEnrolledCourses(username).subscribe((data) => {
      this.enrolledCourses = data.map(item => ({
        title: item.courseCode,
        progress: item.progress || 0  
      }));
    });
  }

  loadSchools() {
    this.apiService.getSchools().subscribe((data) => {
      this.schools = [...data];
    });
  }

  onSchoolChange(event: any) {
    const schoolName = event.target.value;
    if (schoolName && this.studentName) {
      const userSpecificKey = `${this.studentName}_userSchool`;
      sessionStorage.setItem(userSpecificKey, schoolName);
      this.selectedSchool = schoolName;

      this.apiService.saveUserSchool(this.studentName, schoolName).subscribe();
      
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
      const formData = {
        ...this.enrollForm.value,
        username: this.apiService.getUser(),
        progress: 0
      };

      this.apiService.enrollInCoursePutPost(formData, null).subscribe(() => {
          this.loadUserCourses(this.studentName);
          this.closeModal();
          this.alertService.success('Enrollment Requested', `Success! Requested enrollment for ${formData.courseCode}`);
      }); 
    } else {
      this.alertService.error('Invalid Form', 'Please fill out all fields correctly.');
    }
  } 
}