import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent} from './registration/registration';
import { RouterModule } from '@angular/router';
import { LandingComponent } from '../landing/landing';


@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    LandingComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
    RouterModule,
  ]
})
export class AuthModule { }
