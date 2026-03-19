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
  editingId: string | null = null; // Changed to string to match MongoDB IDs
  history: any[] = [];
  showEnrollModal: boolean = false;
  enrollForm!: FormGroup;

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
      courseCode: ['', [Validators.required]],
      studentEmail: ['', [Validators.required, Validators.email]],
      instructorName: ['', [Validators.required]], // Ensure instructor is included
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  loadHistory(){
    const currentUser = this.apiService.getUser();
    this.apiService.getEnrolledCourses(currentUser).subscribe({
      next: (data: any[]) => this.history = [...data],
      error: (err: any) => console.error('History load failed', err)
    });
  }

  editEnrollment(item: any) {
    this.editingId = item._id || item.id; 
    this.showEnrollModal = true;
    this.enrollForm.patchValue({
      courseCode: item.courseCode,
      studentEmail: item.studentEmail,
      instructorName: item.instructorName,
      reason: item.reason || ''
    });
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
            error: (err: any) => {
              console.error('Delete failed', err);
              this.loadHistory(); 
            }
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

    // Updated to use requestEnrollment instead of PutPost
    this.apiService.requestEnrollment(formData).pipe(
      finalize(() => {
        this.loaderService.hide();
        this.closeModal(); 
      })
    ).subscribe({
      next: () => {
        this.loadHistory(); 
        this.alertService.success('Success!', 'Enrollment Requested');
      },
      error: (err: any) => {
        this.loadHistory();
        this.alertService.error('Error', err.error?.error || 'Request failed');
      }
    });
  }

  trackById(index: number, item: any) {
    return item._id || item.id; 
  }
}