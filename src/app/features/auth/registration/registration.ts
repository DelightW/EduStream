import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: false, 
  templateUrl: './registration.html',
  styleUrls: ['./registration.scss']
})
export class RegistrationComponent implements OnInit {
  registerForm!: FormGroup;
  showSuccess: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fname: ['', [Validators.required, Validators.minLength(4)]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      cpassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log('Registration Successful', this.registerForm.value);
      this.showSuccess = true;
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 2000);
    }
  }
}