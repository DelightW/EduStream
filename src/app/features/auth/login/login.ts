import { Component } from '@angular/core';
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

  onLogin() {
    console.log('Template Driven Login:', this.loginData);
  }
}