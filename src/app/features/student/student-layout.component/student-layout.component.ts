import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-student-layout',
  templateUrl: './student-layout.component.html',
  styleUrls: ['./student-layout.component.scss'],
  standalone: false,
})
export class StudentLayoutComponent implements OnInit {
  studentName: string = ''; 
  isSidebarCollapsed: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {
    // Auto-collapse sidebar when entering the course viewer
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (this.isCourseViewer) {
        this.isSidebarCollapsed = true;
      }
    });
  }
  
  ngOnInit() {
    this.studentName = this.apiService.getUser() || 'Student';
    // Initial check
    if (this.isCourseViewer) {
      this.isSidebarCollapsed = true;
    }
  }
  get isCourseViewer(): boolean {
    return this.router.url.includes('course-viewer') || this.router.url.includes('viewer');
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}