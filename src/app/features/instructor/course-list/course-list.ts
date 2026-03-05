import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import Swal from 'sweetalert2';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-course-list',
  standalone: false,
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.scss']
})
export class CourseListComponent implements OnInit {
  course: any; 
  instructorName: string = '';
  pendingStudents: any[] = []; 
  weeks = Array.from({ length: 12 }, (_, i) => i + 1);
  moduleContent: { [key: string]: { notes: string[], files: any[] } } = {};

  constructor(
    private apiService: ApiService, 
    private route: ActivatedRoute, 
    private router: Router,
    private alertService: AlertService,
    public loaderService: LoaderService
  ) {}


async addNote(week: any) {
  const weekKey = week.toString();

  this.loaderService.show();

  try {
    const { value: note } = await Swal.fire({
      title: `Add Note for Week ${weekKey}`,
      input: 'textarea',
      inputPlaceholder: 'Type your module notes here...',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      width: '450px'
    });

    if (note) {
      if (!this.moduleContent[weekKey]) {
        this.moduleContent[weekKey] = { notes: [], files: [] };
      }
      this.moduleContent[weekKey].notes.push(note);
      this.alertService.toast(`Note added to Week ${weekKey}`, 'success');
    }
  } finally {
    this.loaderService.hide();
  }
}

onFileSelected(event: any, week: any) {
    const file = event.target.files[0];
    const weekKey = week.toString();
    
    if (file) {
      if (!this.moduleContent[weekKey]) {
        this.moduleContent[weekKey] = { notes: [], files: [] };
      }
      this.moduleContent[weekKey].files.push(file);
      this.alertService.success('Upload Successful', `${file.name} is now available for Week ${weekKey}.`);
    }
  }
    viewRoster() {
      this.router.navigate(['/instructor/students']);
    }

    approveAll() {
      this.alertService.success('Approved!', 'All pending student requests have been accepted.');
      this.pendingStudents = []; // Clear for UI demo
  }

    declineAll() {
      this.alertService.error('Declined', 'All pending student requests have been rejected.');
      this.pendingStudents = [];
  }

  downloadFile(file: File) {
  const url = window.URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name; 
  link.click();
  window.URL.revokeObjectURL(url);
  
  this.alertService.toast(`Downloading ${file.name}...`, 'success');
}
    ngOnInit() {
    this.instructorName = this.apiService.getUser();
    const id = this.route.snapshot.paramMap.get('id');
  
  if (id) {
    this.apiService.getEnrollmentById(id).subscribe(data => {
      this.course = data;
      this.pendingStudents = [
        { name: 'Sophia Wambui', id: 's1' },
        { name: 'Samuel Omondi', id: 's2' }
      ];
    });
  } else {
    const instructorName = this.apiService.getUser();
    this.apiService.getHistoryByInstructor(instructorName).subscribe(data => {
      this.course = data;
    });
  }
}

}