import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CareunitServiceService } from '../../../service/careunit-service.service';
import { MedicationServiceService } from '../../../service/medication-service.service';
interface MedicationEntry {
  medicationName: string;
  careUnitName: string;
}
@Component({
  selector: 'app-medications',
  standalone: true,
  imports: [SidebarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './medications.component.html',
  styleUrls: ['./medications.component.css'],
})
export class MedicationsComponent implements OnInit {
  medicationsArray: MedicationEntry[] = [];
  careUnits: any[] = [];
  medicationForm: FormGroup;
  isMedicationOpen: boolean = false;

  isEditMode: boolean = false;
  editIndex: number | null = null;

  successMsg: string = '';
  errorMsg: string = '';
  careUnit: any[] = [];
  selectedCareUnit: any;
  medicationId: string = '';

  constructor(
    private fb: FormBuilder,
    private careUnitSerive: CareunitServiceService,
    private medicationService: MedicationServiceService
  ) {
    this.medicationForm = this.fb.group({
      medicationName: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.careUnitSerive.getAllCareUnits().subscribe({
      next: (res) => {
        this.careUnit = res;
        this.selectedCareUnit = this.careUnit[0]._id;
        console.log('Selected Care Unit : ', this.selectedCareUnit);
        console.log(res);
        this.getMedications();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getMedications() {
    this.medicationService.getMedications(this.selectedCareUnit).subscribe({
      next: (res) => {
        console.log(res);
        this.medicationsArray = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onCareUnitChange(id: any) {
    this.selectedCareUnit = id.target.value;
    this.getMedications();
  }

  openMedicationPopup() {
    this.isEditMode = false;
    this.editIndex = null;
    this.isMedicationOpen = true;
    this.medicationForm.reset({ careUnitName: '' });
  }

  closeMedicationPopup() {
    this.isMedicationOpen = false;
  }

  onMedicationSubmit() {
    if (this.medicationForm.valid) {
      if (!this.medicationId) {
        this.medicationService
          .newMedication(this.selectedCareUnit, this.medicationForm.value)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.getMedications();
            },
            error: (err) => {
              console.log(err);
            },
          });
      } else {
        this.medicationService
          .editMedications(
            this.selectedCareUnit,
            this.medicationForm.value,
            this.medicationId
          )
          .subscribe({
            next: (res) => {
              console.log(res);
              this.getMedications();
              this.medicationId = '';
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
    } else {
      this.showError('⚠️ Please fill in all fields!');
    }
    this.closeMedicationPopup();
  }

  onEdit(selectedMedication: any) {
    this.isEditMode = true;
    this.editIndex = selectedMedication;
    this.isMedicationOpen = true;
    this.medicationId = selectedMedication._id;
    this.medicationForm.controls['medicationName'].setValue(
      selectedMedication.medicationName
    );
  }

  onDelete(medication: any) {
    this.medicationsArray = this.medicationsArray.filter(
      (m) => m !== medication
    );
    this.medicationService
      .deleteMedications(this.selectedCareUnit, medication._id)
      .subscribe({
        next: (res) => {
          console.log('fffffff', res);

          this.medicationId = '';
          this.getMedications();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
  // deleteMedicationsByCareUnit(careUnitName: string) {
  //   const beforeCount = this.medicationsArray.length;
  //   this.medicationsArray = this.medicationsArray.filter(
  //     (med) => med.careUnitName !== careUnitName
  //   );

  //   if (this.medicationsArray.length !== beforeCount) {
  //     localStorage.setItem(
  //       'medications',
  //       JSON.stringify(this.medicationsArray)
  //     );
  //     this.showError(
  //       `🗑️ All medications for Care Unit "${careUnitName}" deleted!`
  //     );
  //   }
  // }

  showSuccess(msg: string) {
    this.successMsg = msg;
    setTimeout(() => (this.successMsg = ''), 3000);
  }

  showError(msg: string) {
    this.errorMsg = msg;
    setTimeout(() => (this.errorMsg = ''), 3000);
  }
}
