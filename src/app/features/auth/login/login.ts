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
  console.log('Verifying User:', this.loginData); 
  this.apiService.setUser(this.loginData.username); 
  const isInstructor = this.loginData.username.toLowerCase().includes('admin') || 
                       this.loginData.username.toLowerCase().includes('instructor');
  if (isInstructor) {
    this.router.navigate(['/instructor/dashboard']);
  } else {
    this.router.navigate(['/student']); }
}
  }
