import { Component } from '@angular/core';
import { StaffService } from '../../services/staff.service';
import { catchError, of } from 'rxjs';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { Role } from '../../../../../core/models/role.model';

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

  availableRoles: string[] = [];
  selectedRoles: string[] = [];
  selectedRolesDisplay: string = '';

  constructor(
    private staffService: StaffService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe(params => {
      this.staffId = params['id'];
      if (this.staffId) {
        this.loadUserById(this.staffId);
      }
    });

    this.staffService.getStaffRoles().subscribe({
      next: (response: { code: number, data: Role[] }) => {
        if (response.code === 200) {
          this.availableRoles = response.data.map(role => role.roleName);
        }
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;

      // Generate a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  initForm(): void {
    this.editUserForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      rePassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['MALE', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      roleNames: [[], Validators.required],
      avatarImage: ['', Validators.required],
      updatedAt: [new Date()],
      status: ['active', Validators.required]
    });
  }

  loadUserById(id: string): void {
    this.staffService.getStaffById(id).subscribe({
      next: (response: any) => {
        if (response?.code === 200) {
          this.staff = response.data;
          this.editUserForm.patchValue({
            id: this.staff.id,
            fullName: this.staff.fullName,
            username: this.staff.username,
            password: this.staff.password,
            email: this.staff.email,
            gender: this.staff.gender ? 'MALE' : 'FEMALE',
            phone: this.staff.phone,
            address: this.staff.address,
            roleNames: this.staff.roleNames || [],
            status: this.staff.deleted ? 'inactive' : 'active'
          });
          if (this.staff.avatarImage !== "https://example.com/avatar.jpg") {
            this.imagePreview = this.staff.avatarImage;
          }
          this.selectedRoles = this.staff.roleNames || [];
          this.updateSelectedRolesDisplay();
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (err) => {
        this.errorMessage = err.message;
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

    this.editUserForm.get('roleNames')?.setValue(this.selectedRoles);
    this.updateSelectedRolesDisplay();
  }

  onCancel(): void {
    this.router.navigate(['/admin/user']);
  }

  saveChanges(): void {
    if (this.staffId) {
      this.updateStaff();
    } else {
      this.createStaff();
    }
  }

  updateStaff(): void {
    this.editUserForm.get('rePassword')?.setValue(this.editUserForm.get('password')?.value);
    const formData = this.editUserForm.getRawValue();

    this.staffService.updateStaff(formData)
      .pipe(
        catchError((error) => {
          const apiError = error?.message;
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
          this.errorMessage = response.message;
          this.successMessage = null;
        }
      });
  }

  createStaff(): void {
    this.editUserForm.get('rePassword')?.setValue(this.editUserForm.get('password')?.value);
    const formData = this.editUserForm.getRawValue();

    this.staffService.createStaff(formData)
      .pipe(
        catchError((error) => {
          const apiError = error?.message;
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
          this.errorMessage = response.message;
          this.successMessage = null;
        }
      });
  }
}
