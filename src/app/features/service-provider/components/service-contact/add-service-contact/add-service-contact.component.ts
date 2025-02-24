import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceContactService } from '../../../services/service-contact.service';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BlogLoadingComponent } from '../../../../../shared/components/blog-loading/blog-loading.component';

@Component({
  selector: 'app-add-service-contact',
  imports: [
        ReactiveFormsModule,
        CommonModule,
        BlogLoadingComponent,
        FormsModule        
      ],
  templateUrl: './add-service-contact.component.html',
  styleUrl: './add-service-contact.component.css'
})
export class AddServiceContactComponent {
  addServiceContactForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  serviceProviders: any[] = [];
  isLoading = true;

  constructor(
    private serviceContactService: ServiceContactService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addServiceContactForm = this.fb.group({
      position: ['', Validators.required],
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      serviceProviderId: ['', Validators.required]
    });

    this.fetchServiceProviders();
  }

  fetchServiceProviders(): void {
    this.serviceContactService.getAllServiceProvider().subscribe({
      next: (response) => {
        this.isLoading = false;
        this.serviceProviders = response.data;
      },
      error: () => {
        this.errorMessage = 'Failed to load service providers';
        this.isLoading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/service-provider/service-contact']);
  }

  saveChanges(): void {
    if (this.addServiceContactForm.invalid) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    this.addContact(this.addServiceContactForm.value);
  }

  addContact(formData: any): void {
    this.serviceContactService.updateServiceContact(formData, formData.id)
      .pipe(
        catchError((error) => {
          const apiError = error?.error?.message || 'An error occurred while adding the contact.';
          this.errorMessage = apiError;
          return of(null);
        })
      )
      .subscribe((response: any) => {
        if (response?.code === 200) {
          this.successMessage = response?.message;
          this.errorMessage = null;
        } else {
          this.errorMessage = response?.message || 'An error occurred while adding the contact.';
          this.successMessage = null;
        }
      });
  }
}
