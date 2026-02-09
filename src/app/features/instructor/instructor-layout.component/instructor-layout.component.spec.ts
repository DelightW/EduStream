import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorLayoutComponent } from './instructor-layout.component';

describe('InstructorLayoutComponent', () => {
  let component: InstructorLayoutComponent;
  let fixture: ComponentFixture<InstructorLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructorLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
