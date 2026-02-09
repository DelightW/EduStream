import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api';

@Component({
  selector: 'app-instructor-layout',
  templateUrl: './instructor-layout.component.html',
  styleUrls: ['./instructor-layout.component.scss'],
  standalone: false
})
export class InstructorLayoutComponent implements OnInit {
  instructorName: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.instructorName = this.apiService.getUser() || 'Instructor';
  }
}