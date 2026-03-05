import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import { LoaderService } from '../../../core/services/loader.service';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-instructor-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class InstructorDashboardComponent implements OnInit {
  showCreateModal: boolean = false;
  courseForm!: FormGroup;
  instructorName: string = '';
  history: any[] = [];
  editingId: number | null = null;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router, 
    private alertService: AlertService,
    public loaderService: LoaderService 
  ) {
    this.initCourseForm();
  }

  ngOnInit(): void {
  const savedName = this.apiService.getUser();
  this.instructorName = savedName ? savedName : 'Instructor';

  if (savedName) {
    this.loadInstructorCourses(savedName);
  }
  this.initCourseForm();
}

  private initCourseForm(): void {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      code: ['', [Validators.required]],
      price: [null, [Validators.required, Validators.min(0)]], 
      description: ['', [Validators.required, Validators.minLength(20)]]
    });
  }
  loadInstructorCourses(name: string): void {
  this.apiService.getHistoryByInstructor(name).subscribe((data: any[]) => {
    this.history = [...data];
    console.log('Courses found for:', name, this.history);
  });
}

editCourse(course: any): void {
  this.editingId = course.id; 
  this.showCreateModal = true;
  
  this.courseForm.patchValue({
    title: course.title,
    code: course.courseCode,
    price: course.price || 0,
    description: course.description || ''
  });
}

deleteCourse(id: any): void {
  this.alertService.confirm('Delete Course', 'Are you sure?').then((confirmed) => {
    if (confirmed) {
      this.loaderService.show();
      this.apiService.deleteInstructorCourse(id).pipe(
        finalize(() => {
          this.loaderService.hide();
          this.loadInstructorCourses(this.instructorName); 
        })
      ).subscribe();
    }
  });
}

viewCourse(id: string) {
  this.router.navigate(['/instructor/view-course', id]);
}

  openCourseModal(): void {
    this.showCreateModal = true;
  }

  closeModal(): void {
    this.showCreateModal = false;
    this.courseForm.reset();
    this.editingId = null;
  }

  onCreateCourse(): void {
  if (this.courseForm.valid) {
    this.loaderService.show();

    const formData = {
      ...this.courseForm.value,
      courseCode: this.courseForm.value.code, 
      instructor: this.instructorName
    };

    this.apiService.saveInstructorCourse(formData, this.editingId).pipe(
      finalize(() => {
        this.loaderService.hide();
        this.closeModal();
      })
    ).subscribe({
      next: () => {
        this.loadInstructorCourses(this.instructorName); // Refresh the cards
        this.alertService.success('Success', this.editingId ? 'Course Updated' : 'Course Published');
      },
      error: () => this.loadInstructorCourses(this.instructorName) // Refresh even if handshake jitters
    });
  }
}

  logout(): void {
    sessionStorage.removeItem('user');
    sessionStorage.clear(); 
    this.router.navigate(['/auth/login']); 
  }
}