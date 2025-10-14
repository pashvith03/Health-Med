import { TestBed } from '@angular/core/testing';

import { FluidsServiceService } from './fluids-service.service';

describe('FluidsServiceService', () => {
  let service: FluidsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FluidsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
