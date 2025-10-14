import { TestBed } from '@angular/core/testing';

import { MedicationServiceService } from './medication-service.service';

describe('MedicationServiceService', () => {
  let service: MedicationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
