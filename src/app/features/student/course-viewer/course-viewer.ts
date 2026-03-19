import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private apiService: ApiService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const courseCode = this.route.snapshot.paramMap.get('id'); 
    if (courseCode) this.loadCourseDetails(courseCode);
    this.fetchLanguages();
  }

fetchLanguages() {
  this.http.get<any[]>('https://restcountries.com/v3.1/all?fields=name,languages')
    .subscribe(data => {
      const langSet = new Set<string>();
      data.forEach(country => {
        if (country.languages) {
          // Extract values (e.g., "English", "French") from the languages object
          Object.values(country.languages).forEach((lang: any) => langSet.add(lang));
        }
      });
      // Sort them alphabetically
      this.languages = Array.from(langSet).sort();
    });
}

  loadCourseDetails(code: string): void {
    this.apiService.getCourseByCode(code).subscribe({
      next: (course) => {
        if (course) {
          this.currentCourse = course;
          this.topics = course.weeks.flatMap((w: any) => w.modules);
          this.resources = course.weeks.flatMap((w: any) => w.resources);
          if (this.topics.length > 0) this.currentTopic = this.topics[0].id;
        }
      }
    });
  }

  getActiveTopic() {
    return this.topics.find(t => t.id === this.currentTopic) || { title: '', content: '' };
  }

  loadTopic(id: string) { this.currentTopic = id; }
  toggleDarkMode() { this.isDarkMode = !this.isDarkMode; }
  closeViewer() { this.router.navigate(['/student/coursework']); }
  
  prevTopic() {
    const idx = this.topics.findIndex(t => t.id === this.currentTopic);
    if (idx > 0) this.loadTopic(this.topics[idx - 1].id);
  }

  nextTopic() {
    const idx = this.topics.findIndex(t => t.id === this.currentTopic);
    if (idx < this.topics.length - 1) this.loadTopic(this.topics[idx + 1].id);
  }

  isFirstTopic() { return this.topics[0]?.id === this.currentTopic; }
  isLastTopic() { return this.topics[this.topics.length - 1]?.id === this.currentTopic; }
}