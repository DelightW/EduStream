import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  loggedInUser: string = '';

  constructor() { }
  
  setUser(name: string) {
    this.loggedInUser = name;
  }
getUser(): string {
    return this.loggedInUser;
  }
}