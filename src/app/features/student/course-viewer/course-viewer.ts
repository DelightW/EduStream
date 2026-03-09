import { Component, OnInit, AfterViewInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api';

@Component({
  selector: 'app-course-viewer',
  standalone: false,
  templateUrl: './course-viewer.html',
  styleUrls: ['./course-viewer.scss']
})
export class CourseViewerComponent implements OnInit, AfterViewInit {
  isDarkMode = false;
  activeTab = 'outline';
  currentTopic = ''; // Fixed: Renamed from currentTopicId to match HTML
  currentCourse: any = null;
  topics: any[] = [];
  resources: any[] = [];
  currentTopicData: any = { title: 'Welcome', content: 'Select a module to begin.' };

  @ViewChildren('contentSection') sections!: QueryList<ElementRef>;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const courseCode = this.route.snapshot.paramMap.get('id'); 
    if (courseCode) {
      this.loadCourseDetails(courseCode);
    }
  }

  loadCourseDetails(code: string): void {
    this.apiService.getCourseByCode(code).subscribe({
      next: (course) => {
        if (course) {
          this.currentCourse = course;
          // Flattening MongoDB weeks -> modules for the sidebar list
          this.topics = course.weeks.flatMap((w: any) => w.modules);
          this.resources = course.weeks.flatMap((w: any) => w.resources);
          if (this.topics.length > 0) {
            this.currentTopicData = this.topics[0];
            this.currentTopic = this.topics[0].id;
          }
        }
      },
      error: (err) => console.error('Course not found in MongoDB', err)
    });
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver(): void {
    const options = { threshold: 0.6 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          this.markAsCompleted(id);
        }
      });
    }, options);
    this.sections.forEach(s => observer.observe(s.nativeElement));
  }

  markAsCompleted(id: string | null): void {
    const topic = this.topics.find(t => t.id === id);
    if (topic) {
      topic.completed = true; // Updates the green tick in the sidebar
      this.currentTopic = id || '';
      this.currentTopicData = topic; // Syncs the main content pane as you scroll
    }
  }

  loadTopic(id: string): void {
    const topic = this.topics.find(t => t.id === id);
    if (topic) {
      this.currentTopic = id;
      this.currentTopicData = topic;
      // Scroll the content pane to the selected topic
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleDarkMode(): void { this.isDarkMode = !this.isDarkMode; }
  closeViewer(): void { this.router.navigate(['/student/coursework']); }
  download(file: any): void { console.log('Downloading:', file.name || file.fileName); }

  prevTopic(): void {
    const index = this.topics.findIndex(t => t.id === this.currentTopic);
    if (index > 0) this.loadTopic(this.topics[index - 1].id);
  }

  nextTopic(): void {
    const index = this.topics.findIndex(t => t.id === this.currentTopic);
    if (index < this.topics.length - 1) this.loadTopic(this.topics[index + 1].id);
  }
}