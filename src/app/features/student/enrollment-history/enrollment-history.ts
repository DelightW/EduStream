import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../core/services/alert.service';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ApiService } from '../../../core/services/api';
import { LoaderService } from '../../../core/services/loader.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-enrollment-history',
  templateUrl: './enrollment-history.html',
  styleUrls: ['./enrollment-history.scss'],
  standalone: false,
})

  export class EnrollmentHistory implements OnInit {
  editingId: number | null = null;
  history: any[] = [];
  showEnrollModal: boolean = false;
  enrollForm!: FormGroup;

   enrolledCourses = [
    { title: 'Intro to Web Design', progress: 100 },
    { title: 'Advanced Angular', progress: 35 },
    { title: 'Database Basics', progress: 0 }
  ];
  constructor(
    private alertService: AlertService,
    private fb: FormBuilder,
    private apiService: ApiService,
    public loaderService: LoaderService,
    private router: Router
  ) {}
  
  ngOnInit(){
    this.loadHistory();

    this.enrollForm = this.fb.group({
      courseCode: ['', [Validators.required, Validators.minLength(1)]],
      studentEmail: ['', [Validators.required, Validators.email]],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
    loadHistory(){
      const currentUser = this.apiService.getUser();

     this.apiService.getEnrollmentHistoryByUser(currentUser).subscribe((data)=> {
        this.history = [...data];
     });
    }

    editEnrollment(item: any) {
    this.editingId = item.id; 
    this.showEnrollModal = true;
    
    this.enrollForm.patchValue({
      courseCode: item.courseCode,
      studentEmail: item.studentEmail,
      reason: item.reason,
  });

  this.enrollForm.markAllAsTouched();
  this.enrollForm.updateValueAndValidity();
  }

  deleteEnrollment(id: any) {
  this.alertService.confirm('Delete Enrollment', 'Are you sure?').then((confirmed: boolean) => {
    if (confirmed) {
      this.loaderService.show();
      this.apiService.deleteEnrollment(id)
        .pipe(finalize(() => this.loaderService.hide()))
        .subscribe({
          next: () => {
            this.loadHistory(); 
            this.alertService.success('Deleted', 'Enrollment removed.');
          },
          error: () => this.loadHistory() 
        });
    }
  });
}
  viewEnrollment(id: any) {

    this.router.navigate(['/student/enrollment-details', id]);
  }

    closeModal() {
    this.showEnrollModal = false;
    this.editingId = null;
    this.enrollForm.reset();
    
  }

onEnroll() {
  if (this.enrollForm.invalid) {
    return this.alertService.error('Invalid Form', 'Please fill out all fields correctly.');
  }

  this.loaderService.show(); 

  const formData = {
    ...this.enrollForm.value,
    username: this.apiService.getUser()
  };

  this.apiService.enrollInCoursePutPost(formData, this.editingId)
    .pipe(
      finalize(() => {
        this.loaderService.hide();
        this.closeModal(); 
      })
    )
    .subscribe({
      next: () => {
        this.loadHistory(); 
        const message = this.editingId ? 'Enrollment Updated' : 'Enrollment Requested';
        this.alertService.success('Success!', message);
      },
      error: () => {
        this.loadHistory(); 
      }
    });
}
  trackById(index: number, item: any) {
  return item.id; 
}


}