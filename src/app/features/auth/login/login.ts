import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api';

@Component({
  selector: 'app-login',
  standalone: false, 
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})

export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };

  constructor(private router: Router, private apiService: ApiService) {}

onLogin() {
  this.apiService.setUser(this.loginData.username);
  const isInstructor = this.loginData.username.toLowerCase().includes('instructor');
  console.log('Is Instructor:', isInstructor);

  if (isInstructor) {
    console.log('Targeting Instructor Dashboard...');
    this.router.navigate(['/instructor/dashboard']);
  } else {
    console.log('Targeting Student Dashboard...');
    this.router.navigate(['/student']); 
  }
}
  }
