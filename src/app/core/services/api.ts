import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, timeout } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { authGuard } from '../guards/auth-guard';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private universityUrl = 'http://universities.hipolabs.com/search?country=Kenya';
  private enrollmentUrl = 'enrollments';
   
  constructor(private http: HttpClient) { }

   getEnrolledCourses(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.enrollmentUrl}?username=${username}`);
}
    getEnrollmentHistoryByUser(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.enrollmentUrl}?username=${username}`);
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
    sessionStorage.setItem('username', name);
  }
    getUser(): string {
    return sessionStorage.getItem('username') || '';
  }
    clearUser() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
    sessionStorage.clear();
  }
    getCourses() {    return this.courses;
  } 
    addCourse(course: any) {   
     this.courses.push(course);
  }

    getEnrollmentById(id: string): Observable<any> {
    return this.http.get<any>(`${this.enrollmentUrl}/${id}`);
}
    getEnrollmentsByCode(code: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.enrollmentUrl}?courseCode=${code}`);
}

    getUserSchool(username: string): Observable<any> {
    return this.http.get<any>(`preferences/${username}`);
}

    saveUserSchool(username: string, schoolName: string): Observable<any> {
     const data = { id: username, schoolName };
     return this.http.put(`preferences/${username}`, data).pipe(
    catchError(() => {
      return this.http.post(`preferences`, data);
    })
  );
}
}