import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { CareunitServiceService } from '../../../service/careunit-service.service';
import { PatientservieceService } from '../../../service/patientserviece.service';

@Component({
  selector: 'app-dashboard',
  imports: [NavBarComponent, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  selectedUnit = '';
  careUnits: any[] = [];
  patients: any[] = [];
  filteredPatients: any[] = [];

  constructor(
    private careUnitService: CareunitServiceService,
    private patientService: PatientservieceService
  ) {}

  ngOnInit(): void {
    this.loadCareUnits();
  }

  // Fetch care units from service
  loadCareUnits() {
    this.careUnitService.getAllCareUnits().subscribe(
      (res: any) => {
        this.careUnits = res;
      },
      (err: any) => console.error('Error fetching care units', err)
    );
  }

  // Fetch patients from service

  // Filter patients by selected care unit
  getPatientsByCUID() {
    this.patientService.getPatients(this.selectedUnit).subscribe((res: any) => {
      if (Array.isArray(res)) {
        this.patients = res;
        this.filteredPatients = res;
      }
    });
  }
}
