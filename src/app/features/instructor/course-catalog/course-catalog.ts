import { Component, OnInit, NgModule } from '@angular/core'; // Added NgModule here
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api';
import { LoaderService } from '../../../core/services/loader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-catalog',
  standalone: false,
  templateUrl: './course-catalog.html',
  styleUrls: ['./course-catalog.scss']
})
export class CourseCatalogComponent implements OnInit {
  allCourses: any[] = [];
  filteredCourses: any[] = [];
  searchQuery: string = '';

  constructor(
    private apiService: ApiService,
    public loaderService: LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInstructorCourses();
  }

  loadInstructorCourses() {
    const instructorName = this.apiService.getUser();
    this.apiService.getHistoryByInstructor(instructorName).subscribe({
      next: (data) => {
        this.allCourses = data;
        this.filteredCourses = data;
      },
      error: (err) => console.error('Error fetching catalog:', err)
    });
  }

  onSearch(event: any) {
    this.searchQuery = event.target.value.toLowerCase();
    this.filteredCourses = this.allCourses.filter(course => 
      course.title.toLowerCase().includes(this.searchQuery) || 
      course.courseCode?.toLowerCase().includes(this.searchQuery)
    );
  }

  goToManagement(courseId: string) {
    this.router.navigate(['/instructor/view-course', courseId]);
  }
}


