import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import { CareunitServiceService } from '../../../service/careunit-service.service';

@Component({
  selector: 'app-dashboard',
  imports: [NavBarComponent, FormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  selectedUnit = '';
  careUnits: string[] = [];
  patients: any[] = [];
  filteredPatients: any[] = [];

  constructor(private careUnitService: CareunitServiceService) {}

  ngOnInit(): void {
    this.loadCareUnits();
    this.loadPatients();
  }

  // Fetch care units from service
  loadCareUnits() {
    this.careUnitService.getAllCareUnits().subscribe(
      (res: any) => {
        const extractNames = (arr: any[]) =>
          arr
            .map((unit: any) => unit?.careUnit ?? unit?.name ?? unit)
            .filter((n: any) => typeof n === 'string' && n.trim().length > 0);

        if (Array.isArray(res)) {
          this.careUnits = extractNames(res);
        } else if (res && Array.isArray(res.data)) {
          this.careUnits = extractNames(res.data);
        } else {
          this.careUnits = [];
        }
      },
      (err: any) => console.error('Error fetching care units', err)
    );
  }

  // Fetch patients from service
  loadPatients() {
    this.careUnitService.getAllPatients().subscribe(
      (res: any) => {
        this.patients = Array.isArray(res) ? res : [];
        this.filteredPatients = [...this.patients];
      },
      (err: any) => console.error('Error fetching patients', err)
    );
  }

  // Filter patients by selected care unit
  filterPatients() {
    if (this.selectedUnit) {
      this.filteredPatients = this.patients.filter(
        (p) => p.careUnit === this.selectedUnit
      );
    } else {
      this.filteredPatients = [...this.patients];
    }
  }
}
