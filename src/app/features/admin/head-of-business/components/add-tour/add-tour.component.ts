import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TourService } from '../../services/tour.service';

@Component({
  selector: 'app-add-tour',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-tour.component.html',
  styleUrl: './add-tour.component.css'
})
export class AddTourComponent {
  tourForm: FormGroup;
  isSubmitting = signal(false);

  constructor(private fb: FormBuilder,
    private tourService: TourService,
    private router: Router) {
    this.tourForm = this.fb.group({
      tourName: ['', Validators.required],
      authorName: ['', Validators.required],
      destination: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      duration: [1, [Validators.required, Validators.min(1)]],
      nights: [0, [Validators.required, Validators.min(0)]],
      highlights: ['', Validators.required],
      note: ['']
    });
  }

  onSubmit(): void {
    if (this.tourForm.valid) {
      this.isSubmitting.set(true);
      console.log('Dữ liệu gửi đi:', this.tourForm.value);
      // Call API here
      setTimeout(() => this.isSubmitting.set(false), 2000); // Giả lập gọi API
    }
  }

  onCancel(): void {
    this.router.navigate(['/head-business/list-tour']);
  }
}