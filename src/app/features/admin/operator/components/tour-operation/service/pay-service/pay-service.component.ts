import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Modal } from 'flowbite';
import { TourService } from '../../../../services/tour.service';
import { SsrService } from '../../../../../../../core/services/ssr.service';

@Component({
  selector: 'app-pay-service',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './pay-service.component.html',
  styleUrl: './pay-service.component.css'
})
export class PayServiceComponent {
  @Input() selectedService: any;
  paymentForm: FormGroup;
  modal: Modal | null = null;

  constructor(private fb: FormBuilder, private tourService: TourService, private ssrService: SsrService) {
    this.paymentForm = this.fb.group({
      amount: ['', Validators.required],
      paidBy: ['Viet Travel', Validators.required],
      receivedBy: ['', Validators.required],
      paymentMethod: ['CASH', Validators.required],
      transactionType: ['RECEIPT', Validators.required],
      notes: [''],
      serviceId: ['', Validators.required],
      serviceName: [''],
      quantity: ['', Validators.required]
    });
  }

  sendPayment() {
    console.log('Payment Form Values:', this.paymentForm.value);
  
    const { serviceName, ...payload } = {
      bookingId: this.selectedService?.bookingId,
      ...this.paymentForm.value
    };
  
    this.tourService.payService(payload).subscribe({
      next: (res: any) => {
        console.log('Payment Success:', res);
      },
      error: (err: any) => {
        console.error('Payment Failed:', err);
      }
    });
  }
  

  open() {
    const doc = this.ssrService.getDocument();
    if (doc) {
      const modalElement = document.getElementById('paymentModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
      }
    }

    if (this.selectedService) {
      this.paymentForm.patchValue({
        amount: this.selectedService.amountToPayForBooking || '',
        receivedBy: this.selectedService.providerName || '',
        serviceId: this.selectedService.id || '',
        quantity: this.selectedService.quantity || '',
        serviceName: this.selectedService.serviceName || '',
      });
    }

    console.log('Selected Service:', this.selectedService);

    this.modal?.show();
  }
  
  close() {
    this.modal?.hide();
  }
}
