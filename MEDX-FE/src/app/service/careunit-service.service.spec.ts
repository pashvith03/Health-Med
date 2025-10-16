import { TestBed } from '@angular/core/testing';

import { CareunitServiceService } from './careunit-service.service';

describe('CareunitServiceService', () => {
  let service: CareunitServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CareunitServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
