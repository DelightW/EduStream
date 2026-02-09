import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private universityUrl = '/api-schools/search?country=Kenya';
  private enrollmentUrl = 'http://localhost:3000/enrollments';
   
  constructor(private http: HttpClient) { }

  updateEnrollment(id: number, data: any): Observable<any> {
  return this.http.put(`${this.enrollmentUrl}/${id}`, data);
}

enrollInCourse(data: any): Observable<any> {
  return this.http.post(this.enrollmentUrl, data);
}
    getEnrollmentHistory(): Observable<any[]> {
  return this.http.get<any[]>(this.enrollmentUrl);
  }

   getSchools(): Observable<any> {
   return this.http.get<any[]>(this.universityUrl).pipe(
    timeout(2000), 
    catchError(error => {
      console.error('University API failed:', error);
      return of([]);
      })
    );
}

  loggedInUser: string = '';
  private courses = [
    { code: 'ICS-3206', title: 'Server Administration', price: 4500, instructor: 'Instructor Hussein' }
  ];

 
  
  setUser(name: string) {
  localStorage.setItem('username', name);
  }
getUser(): string {
    return localStorage.getItem('username') || '';
  }
  clearUser() {
    localStorage.removeItem('username');
  }
  getCourses() {    return this.courses;
  } 
  addCourse(course: any) {   
     this.courses.push(course);
  }
}