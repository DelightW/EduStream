import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseCreator } from './course-creator';

describe('CourseCreator', () => {
  let component: CourseCreator;
  let fixture: ComponentFixture<CourseCreator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseCreator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseCreator);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
