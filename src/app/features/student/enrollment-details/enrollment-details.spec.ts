import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentDetails } from './enrollment-details';

describe('EnrollmentDetails', () => {
  let component: EnrollmentDetails;
  let fixture: ComponentFixture<EnrollmentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollmentDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollmentDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
