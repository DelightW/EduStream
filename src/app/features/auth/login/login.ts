import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false, // Since you are using Modules
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent { } // This name MUST match your import