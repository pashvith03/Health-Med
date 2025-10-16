import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CareunitServiceService } from '../../../service/careunit-service.service';
import { IconDirective } from '../../../icon.directive';
interface CareUnit {
  name: string;
  type: string;
}
interface Fluid {
  fluidName: string;
  careUnitName: string;
}

@Component({
  selector: 'app-careunit',
  standalone: true,
  imports: [SidebarComponent, ReactiveFormsModule, FormsModule, CommonModule,IconDirective],
  templateUrl: './careunit.component.html',
  styleUrl: './careunit.component.css',
})
export class CareunitComponent implements OnInit {
  careunitsArray: any[] = [];
  careUnitForm: FormGroup;
  isopen: boolean = false;
  isEditMode: boolean = false;
  editIndex: number | null = null;

  successMsg: string = '';
  errorMsg: string = '';
  careUnitId: string = '';
  constructor(
    private fb: FormBuilder,
    private careUnitService: CareunitServiceService
  ) {
    this.careUnitForm = this.fb.group({
      careUnit: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    const savedUnits = localStorage.getItem('careUnits');
    if (savedUnits) {
      this.careunitsArray = JSON.parse(savedUnits);
    }
    this.getCareUnits();
  }
  getCareUnits() {
    this.careUnitService.getAllCareUnits().subscribe({
      next: (res) => {
        this.careunitsArray = res;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openPopup() {
    this.isopen = true;
    this.isEditMode = false;
    this.editIndex = null;
    this.careUnitForm.reset();
  }

  onSubmit() {
    if (this.careUnitForm.valid) {
      if (!this.careUnitId) {
        this.careUnitService.newCareUnit(this.careUnitForm.value).subscribe({
          next: (res) => {
            console.log(res);
            this.getCareUnits();
          },
          error: (err) => {
            console.error(err);
          },
        });
      } else {
        this.careUnitService
          .editUsers(this.careUnitId, this.careUnitForm.value)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.getCareUnits();
              this.careUnitId = '';
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
      this.closePopup();
    } else {
      this.showError('⚠️ Please fill in all required fields!');
    }
  }

  onDelete(id: any) {
    this.careUnitService.deleteCareUnit(id).subscribe({
      next: (res) => {
        this.getCareUnits();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  closePopup() {
    this.isopen = false;
    this.isEditMode = false;
    this.editIndex = null;
  }

  onEdit(careUnit: any) {
    this.isopen = true;
    this.isEditMode = true;
    this.careUnitId = careUnit._id;
    this.careUnitForm.controls['careUnit'].setValue(careUnit.careUnit);
  }
  private deleteFluidsByCareUnit(careUnitNameToDelete: string) {
    const savedFluids = localStorage.getItem('fluids');
    if (savedFluids) {
      let fluidsArray: Fluid[] = JSON.parse(savedFluids);
      const updatedFluids = fluidsArray.filter(
        (fluid) => fluid.careUnitName !== careUnitNameToDelete
      );
      localStorage.setItem('fluids', JSON.stringify(updatedFluids));
    }
  }
  private updateFluidsCareUnitName(oldName: string, newName: string) {
    const savedFluids = localStorage.getItem('fluids');
    if (savedFluids) {
      let fluidsArray: Fluid[] = JSON.parse(savedFluids);
      const updatedFluids = fluidsArray.map((fluid) => {
        if (fluid.careUnitName === oldName) {
          return { ...fluid, careUnitName: newName };
        }
        return fluid;
      });
      localStorage.setItem('fluids', JSON.stringify(updatedFluids));
    }
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
