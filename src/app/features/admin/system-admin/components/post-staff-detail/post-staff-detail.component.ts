import { Component } from '@angular/core';
import { StaffService } from '../../services/staff.service';
import { catchError, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../../core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './post-staff-detail.component.html',
  styleUrls: ['./post-staff-detail.component.css']
})
export class PostStaffDetailComponent {
  editUserForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  staffId: string | null = null;
  staff: User = <User>{};

  availableRoles: string[] = ['Admin', 'Staff', 'Manager', 'Editor'];
  selectedRoles: string[] = [];
  selectedRolesDisplay: string = '';

  constructor(
    private staffService: StaffService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe(params => {
      this.staffId = params['id'];
      if (this.staffId) {
        this.loadUserById(this.staffId);
      }
    });
  }  

  initForm(): void {
    this.editUserForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['MALE', Validators.required],
      phone: ['', Validators.required],
      role: [[], Validators.required],
      status: ['active', Validators.required]
    });
  }

  loadUserById(id: string): void {
    this.staffService.getStaffById(id).subscribe({
      next: (response: any) => {
        if (response?.code === 200) {
          this.staff = response.data;
          console.log(this.staff);
          this.editUserForm.patchValue({
            id: this.staff.id,
            fullName: this.staff.fullName,
            username: this.staff.username,
            password: this.staff.password,
            email: this.staff.email,
            gender: this.staff.gender ? 'MALE' : 'FEMALE',
            phone: this.staff.phone,
            role: this.staff.roleNames || [],
            status: this.staff.deleted ? 'inactive' : 'active'
          });
          this.selectedRoles = this.staff.roleNames || [];
          this.updateSelectedRolesDisplay();
        } else {
          this.errorMessage = response?.message || 'An error occurred while loading user.';
        }
      },
      error: (err) => {
        console.error('Failed to load user:', err);
        this.errorMessage = 'An error occurred while loading user.';
      }
    });
  }

  updateSelectedRolesDisplay(): void {
    this.selectedRolesDisplay = this.selectedRoles.join(', ');
  }

  onRoleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (target.checked) {
      this.selectedRoles.push(value);
    } else {
      this.selectedRoles = this.selectedRoles.filter(role => role !== value);
    }

    this.editUserForm.get('role')?.setValue(this.selectedRoles);
    this.updateSelectedRolesDisplay();
  }

  onCancel(): void {
    this.router.navigate(['/sa/staff']);
  }

  saveChanges(): void {
    if (this.staffId) {
      this.updateStaff();
    } else {
      this.createStaff();
    }
  }

  updateStaff(): void {
    const formData = this.editUserForm.getRawValue();

    this.staffService.updateStaff(formData)
      .pipe(
        catchError((error) => {
          const apiError = error?.error?.message || 'An error occurred while updating staff.';
          this.errorMessage = apiError;
          this.successMessage = null;
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response?.code === 200) {
          this.successMessage = response?.message;
          this.errorMessage = null;
        } else {
          this.errorMessage = response?.message || 'An error occurred while updating staff.';
          this.successMessage = null;
        }
      });
  }

  createStaff(): void {
    const formData = this.editUserForm.getRawValue();

    this.staffService.createStaff(formData)
      .pipe(
        catchError((error) => {
          const apiError = error?.error?.message || 'An error occurred while creating staff.';
          this.errorMessage = apiError;
          this.successMessage = null;
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response?.code === 200) {
          this.successMessage = response?.message;
          this.errorMessage = null;
          this.router.navigate(['/sa/staff']);
        } else {
          this.errorMessage = response?.message || 'An error occurred while creating staff.';
          this.successMessage = null;
        }
      });
  }
}
