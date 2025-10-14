import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientFinalReportComponent } from './patient-final-report.component';

describe('PatientFinalReportComponent', () => {
  let component: PatientFinalReportComponent;
  let fixture: ComponentFixture<PatientFinalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientFinalReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientFinalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
