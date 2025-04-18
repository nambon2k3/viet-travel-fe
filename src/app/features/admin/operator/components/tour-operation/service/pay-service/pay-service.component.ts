import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() sendRequest = new EventEmitter<void>();
  paymentForm: FormGroup;
  modal: Modal | null = null;
  displayTransactionType: string = "Phiếu Chi";

  constructor(private fb: FormBuilder, private tourService: TourService, private ssrService: SsrService) {
    this.paymentForm = this.fb.group({
      amount: ['', Validators.required],
      paidBy: ['Viet Travel', Validators.required],
      receivedBy: ['', Validators.required],
      paymentMethod: ['CASH', Validators.required],
      transactionType: ['PAYMENT', Validators.required],
      notes: [''],
      serviceId: ['', Validators.required],
      serviceName: [''],
      quantity: ['', Validators.required],
      tourDayId: ['', Validators.required],
    });
  }

  sendPayment() {  
    const { serviceName, ...payload } = {
      bookingId: this.selectedService?.bookingId,
      tourDayId: this.selectedService?.tourDayId,
      ...this.paymentForm.value
    };
  
    this.tourService.payService(payload).subscribe({
      next: (res: any) => {
        this.sendRequest.emit();
        this.close();
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
      const defaultNote = `Thanh toán cho dịch vụ ${this.selectedService.serviceName} của nhà cung cấp ${this.selectedService.providerName}`;

      this.paymentForm.patchValue({
        amount: (this.selectedService.amountToPayForBooking - this.selectedService.paidForBooking) || '',
        receivedBy: this.selectedService.providerName || '',
        serviceId: this.selectedService.id || '',
        quantity: this.selectedService.quantity || '',
        serviceName: this.selectedService.serviceName || '',
        tourDayId: this.selectedService.tourDayId || '',
        notes: defaultNote
      });
    }
    this.modal?.show();
  }
  
  close() {
    this.modal?.hide();
  }
}
