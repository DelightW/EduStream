import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private universityUrl = 'http://universities.hipolabs.com/search?country=Kenya';
  private enrollmentUrl = 'enrollments';
   
  constructor(private http: HttpClient) { }

  getEnrollmentHistory(): Observable<any[]> {
  return this.http.get<any[]>(this.enrollmentUrl);
  }
  
  enrollInCourse(data: any): Observable<any> {
  return this.http.post(this.enrollmentUrl, data);
  }


  enrollInCoursePutPost(data: any, editingId: number | null): Observable<any> {
    if(editingId){
      return this.http.put(`${this.enrollmentUrl}/${editingId}`, data);
    }else{
      return this.http.post(this.enrollmentUrl, data);
    }
  }

  updateEnrollment(id: number, data: any): Observable<any> {
  return this.http.put(`${this.enrollmentUrl}/${id}`, data);
  }

  deleteEnrollment(id: number): Observable<any> {
  return this.http.delete(`${this.enrollmentUrl}/${id}`);
  }

  getSchools(): Observable<any> {
   return this.http.get<any[]>(this.universityUrl).pipe(
    timeout(2000)
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