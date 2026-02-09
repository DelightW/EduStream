import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollModal } from './enroll-modal';

describe('EnrollModal', () => {
  let component: EnrollModal;
  let fixture: ComponentFixture<EnrollModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnrollModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnrollModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
