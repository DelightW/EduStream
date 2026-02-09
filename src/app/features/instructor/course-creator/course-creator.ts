import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api';

@Component({
  selector: 'app-course-creator',
  standalone: false,
  templateUrl: './course-creator.html',
  styleUrls: ['./course-creator.scss']
})
export class CourseCreatorComponent implements OnInit {
  courseForm!: FormGroup;
  showModal: boolean = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  ngOnInit() {
    this.courseForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      code: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required]]
    });
  }

  toggleModal() {
    this.showModal = !this.showModal;
    if (!this.showModal) this.courseForm.reset();
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const newCourse = {
        ...this.courseForm.value,
        instructor: this.apiService.getUser() 
      };
      this.apiService.addCourse(newCourse); 
    }
  }
}