import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import Swal from 'sweetalert2';
import { LoaderService } from '../../../core/services/loader.service';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-course-list',
  standalone: false,
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.scss']
})
export class CourseListComponent implements OnInit {
  course: any; 
  instructorName: string = '';
  enrollments: any[] = []; 
  pendingStudents: any[] = []; 
  weeks = Array.from({ length: 4 }, (_, i) => i + 1); 
  moduleContent: { [key: string]: { notes: string[], files: any[] } } = {};
  activeStudents: any[] = [];

  constructor(
    private apiService: ApiService, 
    private route: ActivatedRoute, 
    private router: Router,
    private alertService: AlertService,
    public loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.instructorName = this.apiService.getUser();
    const courseCode = this.route.snapshot.paramMap.get('id');
  
    if (courseCode) {
      this.loadCourseData(courseCode);
      this.loadEnrollmentData(courseCode);
    }
  }

// Inside CourseListComponent
loadCourseData(code: string) {
  this.loaderService.show();
  
  // Ensure this URL is: http://localhost:5000/api/courses/JAVA-101
  this.apiService.getCourseByCode(code).pipe(
    finalize(() => this.loaderService.hide())
  ).subscribe({
    next: (data) => {
      this.course = data;
      // If the course is found, populate the weeks
      if (data.weeks) {
        data.weeks.forEach((w: any) => {
          this.moduleContent[w.weekNumber.toString()] = {
            notes: w.modules.map((m: any) => m.content),
            files: w.resources || []
          };
        });
      }
    },
    error: (err) => {
      console.error('Fetch error:', err);
      this.alertService.error('Error', 'Course not found in database');
    }
  });
}

loadEnrollmentData(courseCode: string) {
  this.apiService.getEnrollmentsByCourse(courseCode).subscribe({
    next: (data: any[]) => {
      // These now correctly point to the variables we just declared above
      this.activeStudents = data.filter(s => s.status === 'approved');
      this.pendingStudents = data.filter(s => s.status === 'pending');
      
      console.log('Active:', this.activeStudents.length);
      console.log('Pending:', this.pendingStudents.length);
    },
    error: (err: any) => console.error('Error fetching students:', err)
  });
}

  // RESTORED: Downloading Logic
  downloadFile(file: any) {
    if (!file) return;

    // If it's a real File object from an upload
    if (file instanceof File) {
      const url = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name; 
      link.click();
      window.URL.revokeObjectURL(url);
    } else {
      // If it's a URL from the database
      const link = document.createElement('a');
      link.href = file.fileUrl || file;
      link.download = file.fileName || 'download';
      link.target = '_blank';
      link.click();
    }
    
    this.alertService.toast(`Downloading ${file.name || 'file'}...`, 'success');
  }

async addNote(week: any) {
  const weekKey = week.toString();
  const courseCode = this.course.courseCode;

  const { value: formValues } = await Swal.fire({
    title: `Add Module for Week ${weekKey}`, 
    width: '800px',
    html: `
      <div style="text-align: left;">
        <label style="font-weight: bold; display: block; margin-bottom: 5px; color: #1e293b;">Module Title</label>
        <input id="swal-title" class="swal2-input" placeholder="e.g., 1.1.1 Introduction" style="width: 90%; margin-bottom: 20px;">
        
        <label style="font-weight: bold; display: block; margin-bottom: 5px; color: #1e293b;">Module Content</label>
        <textarea id="swal-content" class="swal2-textarea" placeholder="Type your detailed notes here..." style="height: 300px; width: 90%; font-family: 'Inter', sans-serif;"></textarea>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonColor: '#10b981',
    confirmButtonText: 'Publish Module',
    preConfirm: () => {
      const title = (document.getElementById('swal-title') as HTMLInputElement).value;
      const content = (document.getElementById('swal-content') as HTMLTextAreaElement).value;
      if (!title || !content) {
        Swal.showValidationMessage('Both title and content are required');
      }
      return { title, content };
    }
  });

  if (formValues) {
    this.loaderService.show();
    
    // Using the courseCode variable here
    this.apiService.addModuleText(courseCode, week, formValues).pipe(
      finalize(() => this.loaderService.hide())
    ).subscribe({
      next: () => {
        this.alertService.toast(`Module published to Week ${weekKey}`, 'success');
        this.loadCourseData(courseCode); 
      },
      error: () => this.alertService.error('Error', 'Failed to save module')
    });
  }
}
approveStudent(student: any) {
  const payload = {
    courseCode: this.course.courseCode,
    username: student.username
  };

  this.apiService.approveEnrollment(payload).subscribe({
    next: () => {
      this.alertService.success('Success', `${student.username} is now active!`);
      // Refresh the lists so the numbers move from 'Pending' to 'Active'
      this.loadEnrollmentData(this.course.courseCode); 
    },
    error: () => this.alertService.error('Error', 'Failed to approve student')
  });
}
 onFileSelected(event: any, week: any) {
  const file = event.target.files[0];
  const courseCode = this.course?.courseCode;

  if (file && courseCode) {
    this.loaderService.show();
    
    // We send 'fileName' to match the Schema in server.js
    const fileData = {
      fileName: file.name,
      fileUrl: `assets/uploads/${file.name}` 
    };

    // Use +week to force it to a number
    this.apiService.addModuleResource(courseCode, +week, fileData).pipe(
      finalize(() => this.loaderService.hide())
    ).subscribe({
      next: () => {
        this.alertService.success('Saved', `${file.name} added to Week ${week}`);
        this.loadCourseData(courseCode); // Refresh from DB
      },
      error: (err) => {
        console.error("Upload failed:", err);
        this.alertService.error('Error', 'Failed to save file to DB');
      }
    });
  }
}
    viewRoster() { this.router.navigate(['/instructor/student-list']); }
    approveAll() { this.alertService.success('Approved!', 'All students accepted.'); this.pendingStudents = []; }
    declineAll() { this.alertService.error('Declined', 'Requests rejected.'); this.pendingStudents = []; }
  }