import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { ApiService } from '../../../core/services/api';
import { LoaderService } from '../../../core/services/loader.service';

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
    console.log ('Detected ID:', id);

    if (id) {
        this.loaderService.show();
        this.apiService.getEnrollmentById(id).subscribe({
        next: (data) => {
          console.log('Recieved enrollment data:', data);
          this.selectedEnrollment = data;
        },
        error: (err) => {
          console.error('Fetch Error:', err);
    }
  });
    }
  }

  onSearch(query: string) {
    if (!query.trim) return;
    this.searchPerformed = true;
      this.apiService.getEnrollmentsByCode(query).subscribe({
        next: (results) => {
          if(results.length > 0){
            const foundId = results[0].id;
            this.router.navigate(['/student/enrollment-details', foundId]);
          } else {
            this.selectedEnrollment = null;
          }
        },
        error: (err) => { console.error('Search Error:', err); }
      });
  }

  resetView() {
    this.selectedEnrollment = null;
    this.searchPerformed = false;
    this.router.navigate(['/student/enrollment-details']);
  }
}