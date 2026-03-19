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
  editingId: string | null = null;
  
  stats: any = { totalStudents: 0, totalCourses: 0, earnings: 0 };

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
    this.instructorName = savedName || 'Instructor';

    if (savedName) {
      this.loadDashboardData(savedName);
    }
  }

  loadDashboardData(name: string): void {
    this.loaderService.show();
    
    // Fetch stats
    this.apiService.getInstructorStats(name).subscribe({
      next: (res: any) => this.stats = res,
      error: (err: any) => console.error('Stats error:', err)
    });

    // Fetch published courses
    this.apiService.getHistoryByInstructor(name).pipe(
      finalize(() => this.loaderService.hide())
    ).subscribe((data: any[]) => {
      this.history = data;
    });
  }

  private initCourseForm(): void {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      code: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]], 
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  viewCourse(courseCode: string): void {
    if (!courseCode) {
      this.alertService.error('Error', 'Course code is missing.');
      return;
    }
    this.router.navigate(['/instructor/view-course', courseCode]);
  }

  editCourse(course: any): void {
    this.editingId = course.courseCode; 
    this.showCreateModal = true;
    
    this.courseForm.patchValue({
      title: course.title,
      code: course.courseCode,
      price: course.price || 0,
      description: course.description || ''
    });
  }

onCreateCourse(): void {
  if (this.courseForm.valid) {
    this.loaderService.show();
    const currentInstructor = this.apiService.getUser(); // e.g., "Instructor Wambui"

    const formData = {
      title: this.courseForm.value.title,
      courseCode: this.courseForm.value.code, // JAVA-101
      price: this.courseForm.value.price,    // Now matches server schema
      description: this.courseForm.value.description,
      instructor: currentInstructor,         // Now saved correctly
      weeks: Array.from({ length: 4 }, (_, i) => ({ 
        weekNumber: i + 1, 
        modules: [],
        resources: [] 
      }))
    };

    this.apiService.saveInstructorCourse(formData).pipe(
      finalize(() => {
        this.loaderService.hide();
        this.closeModal();
      })
    ).subscribe({
      next: () => {
        this.loadDashboardData(currentInstructor); 
        this.alertService.success('Success', this.editingId ? 'Course Updated' : 'Course Published');
      },
      error: () => this.alertService.error('Error', 'Failed to save to MongoDB')
    });
  }
}

  deleteCourse(code: string): void {
    this.alertService.confirm('Delete', 'Remove this course?').then(confirm => {
      if (confirm) {
        this.loaderService.show();
        this.apiService.deleteInstructorCourse(code).pipe(
          finalize(() => this.loaderService.hide())
        ).subscribe(() => {
          this.loadDashboardData(this.instructorName);
          this.alertService.success('Deleted', 'Course removed successfully');
        });
      }
    });
  }

  openCourseModal(): void {
    this.showCreateModal = true;
  }

  closeModal(): void {
    this.showCreateModal = false;
    this.editingId = null;
    this.courseForm.reset({ price: 0 });
  }

  logout() { 
    sessionStorage.clear(); 
    this.router.navigate(['/auth/login']); 
  }
}