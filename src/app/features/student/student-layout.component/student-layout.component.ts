import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api';

@Component({
  selector: 'app-student-layout.component',
  templateUrl: './student-layout.component.html',
  styleUrl: './student-layout.component.scss',
  standalone: false,
})
export class StudentLayoutComponent implements OnInit {
  studentName: string = ''; 

  constructor(private apiService: ApiService){}
  
  ngOnInit() {
    this.studentName = this.apiService.getUser() || 'Student';
  }


}
