import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceProvidedService } from '../../../services/service-provided.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceProvided } from '../../../../../core/models/service-provided.model';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-service-provided',
  standalone: true, 
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-service-provided.component.html',
  styleUrl: './update-service-provided.component.css'
})
export class UpdateServiceProvidedComponent {
  imageUrl: string | ArrayBuffer | null = null;
  editServiceProvidedForm!: FormGroup;
  serviceProvided!: ServiceProvided;
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private serviceProvidedService: ServiceProvidedService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (history.state?.serviceProvided) {
      this.serviceProvided = history.state.serviceProvided;

      // Hiển thị ảnh từ dữ liệu cũ
      this.imagePreview = this.serviceProvided?.imageUrl || null;

      // Khởi tạo form với dữ liệu hiện tại
      this.editServiceProvidedForm = this.fb.group({
        id: [this.serviceProvided.id, Validators.required],
        name: [this.serviceProvided.name, Validators.required],
        abbreviation: [this.serviceProvided.abbreviation, Validators.required],  
        website: [this.serviceProvided.website, Validators.required],
        email: [this.serviceProvided.email, Validators.required],
        phone: [this.serviceProvided.phone, Validators.required],
        address: [this.serviceProvided.address, Validators.required]
      });

      // Lấy thông tin đầy đủ từ API
      this.getServiceProvidedById(this.serviceProvided.id);
    } else {
      this.router.navigate(['/services']);
    }
  }

  getServiceProvidedById(id: number): void {
    this.serviceProvidedService.getServiceProvidedById(id).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.serviceProvided = response.data;
          this.imagePreview = this.serviceProvided?.imageUrl || null;

          this.editServiceProvidedForm.patchValue({
            name: this.serviceProvided.name,
            abbreviation: this.serviceProvided.abbreviation,
            website: this.serviceProvided.website,
            email: this.serviceProvided.email,
            phone: this.serviceProvided.phone,
            address: this.serviceProvided.address
          });
        }
      },
      error: (err) => {
        console.error('Error fetching service:', err);
        this.router.navigate(['/services']);
      }
    });
  }

  onFileChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.imageUrl = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.editServiceProvidedForm.valid) {
      const updatedData: ServiceProvided = {
        ...this.serviceProvided,
        ...this.editServiceProvidedForm.value,
        imageUrl: this.imageUrl ? (this.imageUrl as string) : this.serviceProvided.imageUrl
      };

      this.serviceProvidedService.updateServiceProvided(updatedData.id, updatedData).subscribe({
        next: () => {
          console.log("Service updated successfully!");
          this.router.navigate(['/services']);
        },
        error: (err) => {
          console.error("Error updating service:", err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/services']);
  }
}
