import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = `${environment.apiUrl}/api`; 
  private universityUrl = 'http://universities.hipolabs.com/search?country=Kenya';

  constructor(private http: HttpClient) { }

  // --- ENROLLMENT METHODS ---
  getEnrolledCourses(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/enrollments?username=${username}`);
  }

  getEnrollmentHistoryByUser(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/enrollments?username=${username}`);
  }

  getEnrollmentById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/enrollments/${id}`);
  }

  getEnrollmentsByCode(code: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/enrollments?courseCode=${code}`);
  }

  enrollInCoursePutPost(data: any, editingId: string | number | null): Observable<any> {
    if (editingId) {
      return this.http.put(`${this.baseUrl}/enrollments/${editingId}`, data);
    }
    return this.http.post(`${this.baseUrl}/enrollments`, data);
  }

  deleteEnrollment(id: string | number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/enrollments/${id}`);
  }

  // --- SCHOOL PREFERENCES ---
  getSchools(): Observable<any[]> {
    return this.http.get<any[]>(this.universityUrl).pipe(timeout(5000));
  }

  getUserSchool(username: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/preferences/${username}`);
  }

  saveUserSchool(username: string, schoolName: string): Observable<any> {
    const data = { id: username, schoolName };
    return this.http.post(`${this.baseUrl}/preferences`, data);
  }

  // --- COURSE CONTENT & HISTORY (INSTRUCTOR) ---
  getCourseByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/courses/${code}`);
  }

  getHistoryByInstructor(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses?instructor=${name}`);
  }

  saveInstructorCourse(data: any, id?: string | number | null): Observable<any> {
    return this.http.post(`${this.baseUrl}/courses`, data);
  }

  deleteInstructorCourse(id: string | number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/courses/${id}`);
  }

  addCourse(course: any): void {
    // This is a local helper sometimes used by the creator
    console.log('Adding course locally:', course);
  }

  // --- USER SESSION HELPERS ---
  setUser(name: string) { sessionStorage.setItem('username', name); }
  getUser(): string { return sessionStorage.getItem('username') || ''; }
  clearUser() { sessionStorage.clear(); }
}