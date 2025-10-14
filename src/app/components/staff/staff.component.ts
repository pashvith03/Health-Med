import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersServiceService } from '../../service/user-service.service';
import { AuthServiceService } from '../../service/auth-service.service';

@Component({
  selector: 'app-staf',
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css',
})
export class StafComponent {
  isopen = false;
  isEditMode = false;
  editIndex = null;
  staffForm: FormGroup;
  staffArray: any[] = [];
  successMsg = '';
  errorMsg = '';
  staffId: string = '';
  careUnits: any[] = [];
  selectedCareUnit: any;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersServiceService,
    private authService: AuthServiceService
  ) {
    this.staffForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      phone: ['', Validators.required],
      specialization: [''],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit() {
    this.loadUsers();
  }
  onSubmit() {
    if (this.staffForm.invalid) {
      this.errorMsg = 'Please fill all required fields correctly';
      return;
    }

    console.log(this.staffForm.value);
    const payload = { ...this.staffForm.value };
    this.usersService.createUser(payload).subscribe({
      next: (res) => {
        this.successMsg = 'User created successfully';
        this.errorMsg = '';
        this.isopen = false;
        this.staffForm.reset();
        this.loadUsers();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Failed to create user';
        this.successMsg = '';
      },
    });
  }
  onEdit(staff: any) {
    console.log(staff);
    this.isEditMode = true;
    this.isopen = true;
    this.editIndex = staff.index;
    this.staffForm.patchValue(staff);
  }
  onDelete(id: string) {
    this.usersService.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
    });
  }

  openPopup() {
    this.isopen = true;
  }
  closePopup() {
    this.isopen = false;
  }

  private loadUsers() {
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.staffArray = users || [];
      },
      error: () => {
        this.staffArray = [];
      },
    });
  }
}
