import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegistrationComponent } from './registration/registration'; 
import { LandingComponent } from '../landing/landing'; // Fixed: Changed 'Landing' to 'LandingComponent'

const routes: Routes = [
  { path: '', component: LandingComponent }, 
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }