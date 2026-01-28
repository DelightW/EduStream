import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: false, 
  templateUrl: './landing.html',
  styleUrls: ['./landing.scss']
})
export class LandingComponent {
  showRoleSelection: boolean = false;

  toggleRoleSelection(){
    this.showRoleSelection = !this.showRoleSelection;
  }
}