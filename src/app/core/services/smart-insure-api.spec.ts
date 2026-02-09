import { TestBed } from '@angular/core/testing';

import { SmartInsureApi } from './smart-insure-api';

describe('SmartInsureApi', () => {
  let service: SmartInsureApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartInsureApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
