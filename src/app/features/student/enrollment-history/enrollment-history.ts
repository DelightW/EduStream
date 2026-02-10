import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../core/services/alert.service';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ApiService } from '../../../core/services/api';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';

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
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}
  
  trackById(index: number, item: any) {
  return item.id; 
}
  ngOnInit(){
    this.loadHistory();

    this.enrollForm = this.fb.group({
      courseCode: ['', [Validators.required, Validators.minLength(4)]],
      studentEmail: ['', [Validators.required, Validators.email]],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
    loadHistory(){
     this.apiService.getEnrollmentHistory().subscribe({
      next: (data: any[]) => {
        console.log('Enrollment history loaded successfully:', data);
        this.history = [...data];
      },
      error: (err: any) => console.error('Could not load history', err)
    });
  
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

  deleteEnrollment(id: any) {
    this.alertService.confirm('Delete Enrollment', 'Are you sure you want to delete this enrollment?').then((confirmed: boolean) => {
      if(confirmed){

        this.zone.run(() => {
        this.history = this.history.filter(item => item.id != id);
        this.history = [...this.history];
        });

          this.apiService.deleteEnrollment(id).subscribe({
            next: () => {
          this.alertService.success('Enrollment Deleted', 'The enrollment has been deleted successfully.');
        },
        error: (err) => {
          this.loadHistory
          console.error('Delete Failed:', err);
          this.alertService.error('Delete Failed', 'There was an error deleting the enrollment.');
        } 
      });
    } 
  });
    }


    closeModal() {
    this.showEnrollModal = false;
    this.editingId = null;
    this.enrollForm.reset();
    
  }
  
  onEnroll() {
    if (this.enrollForm.valid) {
      const formData = this.enrollForm.value;

      if (this.editingId) {
        this.apiService.updateEnrollment(this.editingId, formData).subscribe({
          next: () => {
            const index = this.history.findIndex(item => item.id === this.editingId);
            if (index !== -1) {
              this.history[index] = { ...this.history[index], ...formData };
              this.history = [...this.history];
            }
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
 