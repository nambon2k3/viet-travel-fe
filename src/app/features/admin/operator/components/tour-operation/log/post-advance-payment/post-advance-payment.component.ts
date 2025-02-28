import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-post-advance-payment',
  templateUrl: './post-advance-payment.component.html',
  styleUrls: ['./post-advance-payment.component.css'],
  imports: [
    ReactiveFormsModule
  ],
})
export class PostAdvancePaymentComponent {
  paymentForm: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.paymentForm = this.fb.group({
      amount: ['2.000.000', Validators.required],
      method: ['Transfer', Validators.required],
      provider: ['Nga Long Hotel', Validators.required],
      paymentTerm: ['2025-02-26', Validators.required],
      reason: ['Pay 100% for Nga Long Hotel', Validators.required],
      bank: ['Techcombank - Nguyen Van A - 395672385684', Validators.required],
      email: ['info@viettravel.com', [Validators.required, Validators.email]],
    });
  }

  sendPayment() {
    if (this.paymentForm.valid) {
      console.log('Payment Data:', this.paymentForm.value);
      alert('Payment request sent successfully!');
    } else {
      alert('Please fill all required fields correctly.');
    }
  }
}
