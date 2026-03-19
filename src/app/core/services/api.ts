import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = `${environment.apiUrl}/api`;
  private universityUrl = 'http://universities.hipolabs.com/search?country=Kenya';

  constructor(private http: HttpClient) { }

  // --- ENROLLMENT METHODS ---

  // For Student Dashboard: Gets courses the student is in
  getEnrolledCourses(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/enrollments?username=${username}`);
  }

  // NEW: Student requests to join a course (Replaces enrollInCoursePutPost)
  requestEnrollment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/enrollments/request`, data);
  }

  // For Instructor "View Course": Gets all students for one course
  getEnrollmentsByCourse(courseCode: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/enrollments/by-course/${courseCode}`);
  }

  // Instructor approves a student request
  approveEnrollment(payload: { courseCode: string, username: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/enrollments/approve`, payload);
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

  // --- COURSE CONTENT & HISTORY ---
  getCourseByCode(code: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/courses/${code}`);
  }

  getInstructorStats(username: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/instructor/stats/${username}`);
  }

  getHistoryByInstructor(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/courses?instructor=${name}`);
  }

  saveInstructorCourse(courseData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/courses`, courseData);
  }

  deleteInstructorCourse(courseCode: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/courses/${courseCode}`);
  }

  // --- CONTENT PERSISTENCE ---
  addModuleText(courseCode: string, weekNumber: number, text: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/courses/${courseCode}/weeks/${weekNumber}/modules`, {
      content: text
    });
  }

  addModuleResource(courseCode: string, weekNumber: number, fileData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/courses/${courseCode}/weeks/${weekNumber}/resources`, fileData);
  }
  deleteEnrollment(id: string): Observable<any> {
  return this.http.delete(`${this.baseUrl}/enrollments/${id}`);
}

  // --- USER SESSION HELPERS ---
  setUser(name: string) { sessionStorage.setItem('username', name); }
  getUser(): string { return sessionStorage.getItem('username') || ''; }
  clearUser() { sessionStorage.clear(); }
}