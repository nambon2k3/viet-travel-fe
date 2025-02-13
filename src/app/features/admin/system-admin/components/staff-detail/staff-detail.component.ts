import { Component } from '@angular/core';
import { StaffService } from '../../services/staff.service';
import { catchError, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../../../core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-detail',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './staff-detail.component.html',
  styleUrl: './staff-detail.component.css'
})
export class StaffDetailComponent {
  editUserForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  staff!: User;

  constructor(private staffService: StaffService,
    private fb: FormBuilder,
    private router: Router) { }

  availableRoles: string[] = ['Admin', 'Staff', 'Manager', 'Editor'];
  selectedRoles: string[] = [];
  selectedRolesDisplay: string = '';

  ngOnInit(): void {
    this.staff = history.state.staff;
    this.editUserForm = this.fb.group({
      id: [this.staff.id, Validators.required],
      fullName: [this.staff.fullName, Validators.required],
      username: [this.staff.username, Validators.required],
      email: [this.staff.email, [Validators.required, Validators.email]],
      gender: [this.staff.gender ? 'MALE' : 'FEMALE', Validators.required],
      phone: [this.staff.phone, Validators.required],
      role: [this.staff.role || [], Validators.required],
      status: [this.staff.deleted ? 'inactive' : 'active', Validators.required]
    });

    // Load role đã chọn từ dữ liệu staff
    this.selectedRoles = this.staff.role || [];
    this.updateSelectedRolesDisplay();
  }

  updateSelectedRolesDisplay(): void {
    this.selectedRolesDisplay = this.selectedRoles.join(', ');
  }

  onRoleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;
  
    if (target.checked) {
      // Nếu được chọn, thêm vào mảng
      this.selectedRoles.push(value);
    } else {
      // Nếu bỏ chọn, xóa khỏi mảng
      this.selectedRoles = this.selectedRoles.filter(role => role !== value);
    }
  
    // Cập nhật FormControl và Display
    this.editUserForm.get('role')?.setValue(this.selectedRoles);
    this.updateSelectedRolesDisplay();
  }  

  onCancel(): void {
    this.router.navigate(['/sa/staff']);
  }

  saveChanges(): void {
    const formData = this.editUserForm.value;

    // Lấy danh sách các role đã chọn
    const selectedRoles = Array.from(
      (this.editUserForm.get('role') as any).value
    );

    formData.role = selectedRoles;

    this.staffService.update(formData)
      .pipe(
        catchError((error) => {
          const apiError = error?.error?.message || 'An error occurred while updating staff.';
          this.errorMessage = apiError;
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response?.code === 200) {
          this.successMessage = response?.message;
          this.errorMessage = null;
        } else if (!response) {
          // Handle network or server error
        } else {
          this.errorMessage = response?.message || 'An error occurred while updating staff.';
          this.successMessage = null;
        }
      });
  }

}
