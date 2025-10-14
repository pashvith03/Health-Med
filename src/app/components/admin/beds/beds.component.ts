import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CareunitServiceService } from '../../../service/careunit-service.service';
import { BedsServiceService } from '../../../service/beds-service.service';

interface Bed {
  name: string;
  type: string;
}

@Component({
  selector: 'app-beds',
  standalone: true,
  imports: [SidebarComponent, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './beds.component.html',
  styleUrls: ['./beds.component.css'],
})
export class BedsComponent {
  bedsArray: any = [];
  bedForm: FormGroup;
  isopen = false;
  isEditMode = false;
  editIndex: number | null = null;
  successMsg = '';
  errorMsg = '';
  careUnits: any;
  selectedCareUnit: any;
  bedId: string = '';
  constructor(
    private fb: FormBuilder,
    private careUnitService: CareunitServiceService,
    private bedService: BedsServiceService
  ) {
    this.bedForm = this.fb.group({
      bedName: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.careUnitService.getAllCareUnits().subscribe({
      next: (res) => {
        this.careUnits = res;
        this.selectedCareUnit = this.careUnits[0]._id;
        console.log('selectedCareUnit :', this.selectedCareUnit);
        this.getBeds();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getBeds() {
    this.bedService.getAllBeds(this.selectedCareUnit).subscribe({
      next: (res) => {
        this.bedsArray = res;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onCareUnitChange(id: any) {
    this.selectedCareUnit = id.target.value;
    this.getBeds();
  }
  openPopup() {
    this.isopen = true;
    this.isEditMode = false;
    this.editIndex = null;
    this.bedForm.reset();
  }

  onSubmit() {
    if (this.bedForm.valid) {
      if (!this.bedId) {
        this.bedService
          .newBed(this.selectedCareUnit, this.bedForm.value)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.getBeds();
            },
            error: (err) => {
              console.log(err);
            },
          });
      } else {
        this.bedService
          .editBed(this.selectedCareUnit, this.bedForm.value, this.bedId)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.getBeds();
              this.bedId = '';
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
      this.closePopup();
    }
  }

  onDelete(bed: any) {
    this.bedsArray = this.bedsArray.filter((b: any) => b !== bed);
    this.bedService.deleteBed(this.selectedCareUnit, bed._id).subscribe({
      next: (res) => {
        console.log(res);
        this.getBeds();
      },
      error: (err) => {
        console.log(err);
      },
    });
    // localStorage.setItem('Beds', JSON.stringify(this.bedsArray));
    // this.showError('🗑️ Bed deleted successfully!');
  }

  closePopup() {
    this.isopen = false;
    this.isEditMode = false;
    this.editIndex = null;
  }

  onEdit(selectedBed: any) {
    this.isopen = true;
    this.isEditMode = true;
    console.log('selectedBed :', selectedBed);
    this.bedForm.controls['bedName'].setValue(selectedBed.bedName);
    this.bedId = selectedBed._id;

    // const bed = this.bedsArray[index];
    // this.bedForm.patchValue({
    //   bedName: bed.name,
    //   bedType: bed.type,
    // });
  }

  showSuccess(msg: string) {
    this.successMsg = msg;
    this.errorMsg = '';
    setTimeout(() => (this.successMsg = ''), 3000);
  }

  showError(msg: string) {
    this.errorMsg = msg;
    this.successMsg = '';
    setTimeout(() => (this.errorMsg = ''), 3000);
  }
}
