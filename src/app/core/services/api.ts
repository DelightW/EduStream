import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = `http://localhost:5000/api`;
  private universityUrl = 'http://universities.hipolabs.com/search?country=Kenya';

  constructor(private http: HttpClient) { }

  // Getter for parts of the app that still need the raw URL
  get apiBaseUrl(): string {
    return this.baseUrl;
  }

  // Helper used by the component (fixes your specific error)
  getApiUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  // --- PROGRESS TRACKING METHODS ---

  // Fetches checkmark status from DB
  getEnrollmentStatus(username: string, courseCode: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/enrollments/status?username=${username}&courseCode=${courseCode}`);
  }

  // Saves a module as completed in DB
  saveModuleProgress(username: string, courseCode: string, moduleId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/enrollments/complete-module`, {
      username,
      courseCode,
      moduleId
    });
  }

  // --- ENROLLMENT METHODS ---

  getEnrolledCourses(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/enrollments?username=${username}`);
  }

  requestEnrollment(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/enrollments/request`, data);
  }

getEnrollmentsByCourse(courseCode: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.baseUrl}/enrollments/by-course/${courseCode}`);
}

  approveEnrollment(payload: { courseCode: string, username: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/enrollments/approve`, payload);
  }

  deleteEnrollment(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/enrollments/${id}`);
  }

  getAllInstructorStudents(name: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/instructor/enrollments/${name}`);
  }

  // --- UNIVERSITY & PREFERENCES ---

  getSchools(): Observable<any[]> {
    return this.http.get<any[]>(this.universityUrl).pipe(timeout(5000));
  }

  getUserSchool(username: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/preferences/${username}`);
  }

  saveUserSchool(username: string, schoolName: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/preferences`, { id: username, schoolName });
  }

  // --- COURSE CONTENT ---

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

  addModuleText(courseCode: string, week: number, moduleData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/courses/${courseCode}/weeks/${week}/modules`, moduleData);
  }

  addModuleResource(courseCode: string, weekNumber: number, fileData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/courses/${courseCode}/weeks/${weekNumber}/resources`, fileData);
  }

  // --- USER SESSION HELPERS ---
  setUser(name: string) { sessionStorage.setItem('username', name); }
  getUser(): string { return sessionStorage.getItem('username') || ''; }
  clearUser() { sessionStorage.clear(); }
}