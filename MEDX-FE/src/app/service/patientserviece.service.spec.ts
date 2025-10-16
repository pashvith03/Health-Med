import { TestBed } from '@angular/core/testing';

import { PatientservieceService } from './patientserviece.service';

describe('PatientservieceService', () => {
  let service: PatientservieceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientservieceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
