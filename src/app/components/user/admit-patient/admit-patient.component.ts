import { Component, OnInit } from '@angular/core';
import { NavBarComponent } from '../../nav-bar/nav-bar.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CareunitServiceService } from '../../../service/careunit-service.service';
import { CommonModule } from '@angular/common';
import { BedsServiceService } from '../../../service/beds-service.service';
import { UsersServiceService } from '../../../service/user-service.service';
import { PatientservieceService } from '../../../service/patientserviece.service';

interface CareUnit {
  _id: string;
  name: string;
  careUnit: string; // Adding careUnit property to match the template
}

interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Bed {
  _id: string;
  number: string;
  name: string; // Adding name property to match the template
}

@Component({
  selector: 'app-admit-patient',
  standalone: true,
  imports: [NavBarComponent, FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './admit-patient.component.html',
  styleUrl: './admit-patient.component.css',
})
export class AdmitPatientComponent implements OnInit {
  careUnits: CareUnit[] = [];
  selectedCareUnit: string = '';
  bedsArray: Bed[] = [];
  bedId: string = '';
  admitForm: FormGroup;
  staff: Staff[] = [];
  selectedStaff: string = '';
  constructor(
    private fb: FormBuilder,
    private careUnitService: CareunitServiceService,
    private bedService: BedsServiceService,
    private staffService: UsersServiceService,
    private patientService: PatientservieceService
  ) {
    this.admitForm = this.fb.group({
      pan: ['', [Validators.required, Validators.pattern(/^PAN\d{5}$/)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(0), Validators.max(150)]],
      gender: ['', Validators.required],
      bloodGroup: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      admittedAt: ['', Validators.required],
      careUnit: ['', Validators.required],
      assignedDoctor: ['', Validators.required],
      bed: ['', Validators.required],
      severity: ['', Validators.required],
      address: ['', Validators.required],
      symptoms: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadCareUnits();
    this.loadStaff();
  }

  private loadCareUnits(): void {
    this.careUnitService.getAllCareUnits().subscribe({
      next: (res: CareUnit[]) => {
        this.careUnits = res;
        if (this.careUnits.length > 0) {
          this.selectedCareUnit = this.careUnits[0]._id;
          this.loadBeds(this.selectedCareUnit);
        }
      },
      error: (err: any) => {
        console.error('Error loading care units:', err);
      },
    });
  }

  private loadStaff(): void {
    this.staffService.getUsers().subscribe({
      next: (res: Staff[]) => {
        this.staff = res;
        if (this.staff.length > 0) {
          this.selectedStaff = this.staff[0]._id;
          this.admitForm.patchValue({ assignedDoctor: this.selectedStaff });
        }
      },
      error: (err: any) => {
        console.error('Error loading staff:', err);
      },
    });
  }

  onSubmit(): void {
    if (this.admitForm.invalid) {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.admitForm.controls).forEach((key) => {
        const control = this.admitForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const admitFormValue = this.admitForm.value;
    const admittedDate = new Date(admitFormValue.admittedAt);

    const patientData = {
      ...admitFormValue,
      admittedAt: admittedDate.toISOString(),
      careUnit: this.selectedCareUnit,
      assignedDoctor: this.selectedStaff,
      bed: this.bedId,
    };

    this.patientService.createPatient(patientData).subscribe({
      next: (res: any) => {
        console.log('Patient admitted successfully:', res);
        this.admitForm.reset();
        // TODO: Add success message or redirect
      },
      error: (err: any) => {
        console.error('Error admitting patient:', err);
        // TODO: Add error handling UI feedback
      },
    });
  }

  private loadBeds(careUnitId: string): void {
    if (!careUnitId) return;

    this.bedService.getAllBeds(careUnitId).subscribe({
      next: (res: Bed[]) => {
        this.bedsArray = res;
        this.bedId = '';
        this.admitForm.patchValue({ bed: '' });
      },
      error: (err: any) => {
        console.error('Error loading beds:', err);
        this.bedsArray = [];
      },
    });
  }

  onCareUnitChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCareUnit = select.value;
    this.admitForm.patchValue({ careUnit: this.selectedCareUnit });
    this.loadBeds(this.selectedCareUnit);
  }

  onBedSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.bedId = select.value;
    this.admitForm.patchValue({ bed: this.bedId });
  }

  onStaffSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedStaff = select.value;
    this.admitForm.patchValue({ assignedDoctor: this.selectedStaff });
  }

  onEdit(): void {
    console.log('Edit mode activated');
    // TODO: Implement edit functionality
  }
}
