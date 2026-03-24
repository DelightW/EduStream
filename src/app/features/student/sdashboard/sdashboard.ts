import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { LoaderService } from '../../../core/services/loader.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

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

  ngOnInit() {
    this.loadSchools();
    
    const savedName = this.apiService.getUser();
    this.studentName = savedName ? savedName : 'Student';

    if (savedName) {
      const localSchool = sessionStorage.getItem(`${savedName}_userSchool`);
      if (localSchool) this.selectedSchool = localSchool;

      this.apiService.getUserSchool(savedName).subscribe({
        next: (pref) => {
          if (pref && pref.schoolName) {
            this.selectedSchool = pref.schoolName;
            sessionStorage.setItem(`${savedName}_userSchool`, pref.schoolName);
          }
        },
        error: (err) => console.error('DB sync failed:', err)
      });

      this.loadUserCourses(savedName);
    } 

this.enrollForm = this.fb.group({
  courseCode: ['', [Validators.required]], 
  studentEmail: ['', [Validators.required, Validators.email]], 
  reason: ['', [Validators.required, Validators.minLength(10)]],
  instructorName: ['Instructor Wambui'] 
});
  }

  loadUserCourses(username: string) {
    this.apiService.getEnrolledCourses(username).subscribe((data) => {
      this.enrolledCourses = data.map(item => ({
        title: item.courseCode, // Or map to a real title if you fetch course details
        courseCode: item.courseCode,
        progress: item.progress || 0,
        status: item.status || 'pending' // track if approved
      }));
    });
  }

goToCourse(course: any) {
  if (course.status === 'approved') {
    this.loaderService.show();
    setTimeout(() => {
      this.router.navigate(['/student/course-viewer', course.courseCode])
        .then(() => this.loaderService.hide());
    }, 500);
  } else {
    this.alertService.error('Access Denied', 'Waiting for Instructor approval.');
  }
}

onEnroll() {
  if (this.enrollForm.valid) {
    this.loaderService.show(); 
    
    const formData = {
      courseCode: this.enrollForm.value.courseCode,
      studentEmail: this.enrollForm.value.studentEmail,
      reason: this.enrollForm.value.reason,
      instructorName: this.enrollForm.value.instructorName || 'Instructor Wambui',
      username: this.apiService.getUser(),
      status: 'pending'
    };

    this.apiService.requestEnrollment(formData).pipe(
      finalize(() => {
        this.loaderService.hide();
        this.closeModal(); 
      })
    ).subscribe({
      next: () => {
        this.loadUserCourses(this.studentName); 
        this.alertService.success('Success', `Requested enrollment for ${formData.courseCode}`);
      },
      error: (err: any) => {
        this.alertService.error('Error', 'Failed to request enrollment');
      }
    }); 
  }
}

  loadSchools() {
    this.apiService.getSchools().subscribe((data) => this.schools = [...data]);
  }

  onSchoolChange(event: any) {
    const schoolName = event.target.value;
    if (schoolName && this.studentName) {
      this.selectedSchool = schoolName;
      sessionStorage.setItem(`${this.studentName}_userSchool`, schoolName);
      this.apiService.saveUserSchool(this.studentName, schoolName).subscribe();
      this.alertService.toast(`School updated`);
    }
  }

  openModal() { this.showEnrollModal = true; }
  closeModal() { this.showEnrollModal = false; this.enrollForm.reset(); }
  logout() { 
    this.apiService.clearUser(); 
    this.router.navigate(['/auth/login']); 
  }
}