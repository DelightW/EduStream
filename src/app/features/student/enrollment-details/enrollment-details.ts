import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { ApiService } from '../../../core/services/api';
import { LoaderService } from '../../../core/services/loader.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-enrollment-details',
  templateUrl: './enrollment-details.html',
  styleUrls: ['./enrollment-details.scss'],
  standalone: false,
})
export class EnrollmentDetails implements OnInit {
  selectedEnrollment: any = null;
  searchPerformed: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private apiService: ApiService,
    public loaderService: LoaderService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const username = this.apiService.getUser();

    if (id && username) {
      this.loaderService.show();
      // Using getEnrolledCourses to find the specific ID locally or from the list
      this.apiService.getEnrolledCourses(username).pipe(
        finalize(() => this.loaderService.hide())
      ).subscribe({
        next: (data: any[]) => {
          // Find the specific enrollment by its MongoDB _id or custom id
          this.selectedEnrollment = data.find(e => e._id === id || e.id === id);
          if (!this.selectedEnrollment) {
            console.error('Enrollment not found in user history');
          }
        },
        error: (err: any) => console.error('Fetch Error:', err)
      });
    }
  }

  onSearch(query: string) {
    if (!query || !query.trim()) return;
    const username = this.apiService.getUser();
    this.searchPerformed = true;

    this.apiService.getEnrolledCourses(username).subscribe({
      next: (results: any[]) => {
        const found = results.find(r => r.courseCode.toLowerCase() === query.toLowerCase());
        if (found) {
          const foundId = found._id || found.id;
          this.router.navigate(['/student/enrollment-details', foundId]);
        } else {
          this.selectedEnrollment = null;
        }
      },
      error: (err: any) => console.error('Search Error:', err)
    });
  }

  resetView() {
    this.selectedEnrollment = null;
    this.searchPerformed = false;
    this.router.navigate(['/student/enrollment-details']);
  }
}