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
import { FluidsServiceService } from '../../../service/fluids-service.service';

interface FluidEntry {
  fluidName: string;
  careUnitName: string;
}

@Component({
  selector: 'app-fluids',
  standalone: true,
  imports: [SidebarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './fluids.component.html',
  styleUrls: ['./fluids.component.css'],
})
export class FluidsComponent implements OnInit {
  fluidsArray: FluidEntry[] = [];
  careUnits: any[] = [];
  fluidForm: FormGroup;
  isFluidOpen = false;

  isEditMode = false;
  editIndex: number | null = null;

  successMsg = '';
  errorMsg = '';
  selectedCareUnit: any;
  fluidId: string = '';

  constructor(
    private fb: FormBuilder,
    private careUnitService: CareunitServiceService,
    private fluidService: FluidsServiceService
  ) {
    this.fluidForm = this.fb.group({
      fluidName: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.careUnitService.getAllCareUnits().subscribe({
      next: (res) => {
        this.careUnits = res;
        this.selectedCareUnit = this.careUnits[0]._id;
        console.log('selectedCareUnit :', this.selectedCareUnit);
        this.getFluids();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getFluids() {
    this.fluidService.getFluid(this.selectedCareUnit).subscribe({
      next: (res) => {
        console.log(res);
        this.fluidsArray = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onCareUnitChange(id: any) {
    this.selectedCareUnit = id.target.value;
    this.getFluids();
  }
  openFluidPopup() {
    this.isEditMode = false;
    this.editIndex = null;
    this.isFluidOpen = true;
    this.fluidForm.reset({ careUnitName: '' });
  }

  closeFluidPopup() {
    this.isFluidOpen = false;
  }

  onFluidSubmit() {
    if (this.fluidForm.valid) {
      if (!this.fluidId) {
        this.fluidService
          .newfluid(this.selectedCareUnit, this.fluidForm.value)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.getFluids();
            },
            error: (err) => {
              console.log(err);
            },
          });
      } else {
        this.fluidService
          .editFluid(this.selectedCareUnit, this.fluidForm.value, this.fluidId)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.getFluids();
              this.fluidId = '';
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
    } else {
      this.showError('⚠️ Please fill in all fields!');
    }
    this.closeFluidPopup();
  }

  onEdit(selectedFluid: any) {
    this.isEditMode = true;
    this.editIndex = selectedFluid;
    this.isFluidOpen = true;
    this.fluidId = selectedFluid._id;
    console.log('Selected Fluid:', selectedFluid);
    this.fluidForm.controls['fluidName'].setValue(selectedFluid.fluidName);
  }

  onDelete(fluid: any) {
    this.fluidsArray = this.fluidsArray.filter((f) => f !== fluid);
    this.fluidService.deleteFluid(this.selectedCareUnit, fluid._id).subscribe({
      next: (res) => {
        this.getFluids();
        this.fluidId = '';
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  showSuccess(msg: string) {
    this.successMsg = msg;
    setTimeout(() => (this.successMsg = ''), 3000);
  }

  showError(msg: string) {
    this.errorMsg = msg;
    setTimeout(() => (this.errorMsg = ''), 3000);
  }
}
