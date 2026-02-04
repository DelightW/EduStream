import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Admdash } from './admdash';

describe('Admdash', () => {
  let component: Admdash;
  let fixture: ComponentFixture<Admdash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Admdash]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Admdash);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
