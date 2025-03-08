import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-customer-booking',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './create-customer-booking.component.html',
  styleUrl: './create-customer-booking.component.css'
})
export class CreateCustomerBookingComponent {
  bookingForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.bookingForm = this.fb.group({
      tourName: [{ value: 'Đà Nẵng - Huế - Bà Nà - Hội An', disabled: true }, Validators.required],
      openDate: [{ value: '2025-03-26', disabled: true }, Validators.required],
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  closeModal() {
    console.log('Modal closed');
  }

  confirmBooking() {
    if (this.bookingForm.valid) {
      console.log('Booking confirmed:', this.bookingForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
