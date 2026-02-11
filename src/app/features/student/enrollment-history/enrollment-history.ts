import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../../core/services/alert.service';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ApiService } from '../../../core/services/api';
import { LoaderService } from '../../../core/services/loader.service';

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
  ) {}
  
  ngOnInit(){
    this.loadHistory();

    this.enrollForm = this.fb.group({
      courseCode: ['', [Validators.required, Validators.minLength(4)]],
      studentEmail: ['', [Validators.required, Validators.email]],
      reason: ['', [Validators.required, Validators.minLength(10)]]
    });
  }
    loadHistory(){
     this.apiService.getEnrollmentHistory().subscribe((data)=> {
        this.history = [...data];
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
        this.apiService.deleteEnrollment(id).subscribe(() => {
        this.history = this.history.filter(item => item.id != id);
        this.history = [...this.history];
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
  if (this.enrollForm.invalid) {
    return this.alertService.error('Invalid Form', 'Please fill out all fields correctly.');
  }

  const formData = this.enrollForm.value;

  if (this.editingId) {
    this.apiService.updateEnrollment(this.editingId, formData).subscribe(() => {
      this.loadHistory();
      this.closeModal();
      this.alertService.success('Success!', 'Enrollment Updated');
    });
  } else {
    this.apiService.enrollInCourse(formData).subscribe(() => {
      this.loadHistory();
      this.closeModal();
      this.alertService.success('Success!', 'Enrollment Requested');
    });
  }
}
  trackById(index: number, item: any) {
  return item.id; 
}


enroll2() {
  if (this.enrollForm.valid) {
    const formData = this.enrollForm.value;  
    this.apiService.enrollInCoursePutPost(formData,this.editingId).subscribe((response) => {
      this.loadHistory();
      this.closeModal();
      this.alertService.success('Success!', 'Enrollment Updated');
    });
  }
}
}