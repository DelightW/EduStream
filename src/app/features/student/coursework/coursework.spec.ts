import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Coursework } from './coursework';

describe('Coursework', () => {
  let component: Coursework;
  let fixture: ComponentFixture<Coursework>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Coursework]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Coursework);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
