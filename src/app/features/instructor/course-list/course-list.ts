import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api';

@Component({
  selector: 'app-course-list',
  standalone: false,
  templateUrl: './course-list.html',
  styleUrls: ['./course-list.scss']
})
export class CourseListComponent implements OnInit {
  courses: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.courses = this.apiService.getCourses();
  }
}