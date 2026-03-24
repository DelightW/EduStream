import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-course-viewer',
  standalone: false,
  templateUrl: './course-viewer.html',
  styleUrls: ['./course-viewer.scss']
})
export class CourseViewerComponent implements OnInit {
  isDarkMode = false;
  activeTab = 'outline';
  currentTopic = ''; 
  currentCourse: any = null;
  topics: any[] = [];
  resources: any[] = [];
  languages: string[] = [];
  
  completedModuleIds: string[] = [];
  isSidebarClosed: boolean = false;
  openWeeks: { [key: number]: boolean } = { 1: true }; 

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private apiService: ApiService,
    private http: HttpClient,
    public loaderService: LoaderService 
  ) {}

  ngOnInit(): void {
    const courseCode = this.route.snapshot.paramMap.get('id'); 
    if (courseCode) this.loadCourseDetails(courseCode);
    this.fetchLanguages();
  }

  fetchLanguages() {
    this.http.get<any[]>('https://restcountries.com/v3.1/all?fields=name,languages')
      .subscribe({
        next: (data) => {
          const langSet = new Set<string>();
          data.forEach(country => {
            if (country.languages) Object.values(country.languages).forEach((lang: any) => langSet.add(lang));
          });
          this.languages = Array.from(langSet).sort();
        }
      });
  }

  loadCourseDetails(code: string): void {
    this.loaderService.show(); 
    const username = this.apiService.getUser();

    this.apiService.getCourseByCode(code).subscribe({
      next: (course) => {
        if (course) {
          this.currentCourse = course;
          this.topics = course.weeks.flatMap((w: any) => 
            w.modules.map((m: any) => ({ ...m, weekNumber: w.weekNumber }))
          );
          this.resources = course.weeks.flatMap((w: any) => w.resources || []);

          // Load student's saved checkmarks from DB
          this.apiService.getEnrollmentStatus(username, code)
            .pipe(finalize(() => this.loaderService.hide()))
            .subscribe({
              next: (enrollment) => {
                this.completedModuleIds = enrollment?.completedModules || [];
                if (this.topics.length > 0) this.currentTopic = this.topics[0].id;
              }
            });
        }
      }
    });
  }

  markModuleAsComplete(moduleId: string) {
    const username = this.apiService.getUser();
    const courseCode = this.currentCourse?.courseCode;
    if (!username || !courseCode || !moduleId) return;

    this.apiService.saveModuleProgress(username, courseCode, moduleId).subscribe({
      next: () => {
        if (!this.completedModuleIds.includes(moduleId)) {
          this.completedModuleIds.push(moduleId);
        }
      }
    });
  }

  isTopicCompleted(topicId: string): boolean {
    return this.completedModuleIds.includes(topicId);
  }

  loadTopic(id: string) {
    this.currentTopic = id;
    // Note: Clicking doesn't complete it, only "Next" does.
  }

  toggleSidebar() { this.isSidebarClosed = !this.isSidebarClosed; }
  toggleWeek(weekNum: number) { this.openWeeks[weekNum] = !this.openWeeks[weekNum]; }

  getActiveTopic() {
    return this.topics.find(t => t.id === this.currentTopic) || { title: '', content: '', weekNumber: 1 };
  }

  downloadResource(file: any) {
    const link = document.createElement('a');
    link.href = file.fileUrl; link.download = file.fileName; link.target = '_blank'; link.click();
  }

  toggleDarkMode() { this.isDarkMode = !this.isDarkMode; }
  closeViewer() { this.router.navigate(['/student/coursework']); }
  
  prevTopic() {
    const idx = this.topics.findIndex(t => t.id === this.currentTopic);
    if (idx > 0) this.loadTopic(this.topics[idx - 1].id);
  }

  nextTopic() {
    // 1. Mark current topic as complete in database before moving
    this.markModuleAsComplete(this.currentTopic);

    // 2. Move to the next one
    const idx = this.topics.findIndex(t => t.id === this.currentTopic);
    if (idx < this.topics.length - 1) {
      this.loadTopic(this.topics[idx + 1].id);
    }
  }

  isFirstTopic() { return this.topics[0]?.id === this.currentTopic; }
  isLastTopic() { return this.topics[this.topics.length - 1]?.id === this.currentTopic; }
}