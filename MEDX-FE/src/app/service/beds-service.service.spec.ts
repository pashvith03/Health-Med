import { TestBed } from '@angular/core/testing';

import { BedsServiceService } from './beds-service.service';

describe('BedsServiceService', () => {
  let service: BedsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BedsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
