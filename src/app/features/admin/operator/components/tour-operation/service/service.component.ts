import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { SsrService } from '../../../../../../core/services/ssr.service';
import { Modal } from 'flowbite';
import { TourGuidePayComponent } from './tour-guide-pay/tour-guide-pay.component';
import { PostServiceComponent } from "./post-service/post-service.component";

@Component({
  selector: 'app-service',
  standalone: true,
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
  imports: [
    CommonModule,
    TourGuidePayComponent,
    PostServiceComponent
]
})
export class ServiceComponent implements AfterViewInit {
  @ViewChild('chooseServiceModal') chooseServiceModal!: PostServiceComponent;
  @ViewChild('tourGuidePayModal') tourGuidePayModal!: TourGuidePayComponent;

  openServiceModal() {
    this.chooseServiceModal.openModal();
  }

  openPopup() {
    this.tourGuidePayModal.openPopup();
  }

  services = [
    { id: 1, name: 'Lan Than', type: 'Meals', bookingId: 234, date: '20/03/2025', quantity: '25 slots', order: 'Not order yet', payment: 'Not pay yet', status: 'continuing' },
    { id: 2, name: 'Con Vit 1', type: 'Room', bookingId: 345, date: '16/03/2025', quantity: '25 slots', order: 'Ordered', payment: 'Paid', status: 'completed' },
    { id: 3, name: 'Con Vit 2', type: 'Room', bookingId: 456, date: '25/03/2025', quantity: '25 slots', order: 'Ordered', payment: '', status: 'not-started' }
  ];

  totalService = 3;
  paid = '10.000.000';
  remain = 0;
  totalCost = '10.000.000';
  modal: Modal | null = null;

  constructor(private ssrService: SsrService) { }

  async ngAfterViewInit() {
    const { Dropdown } = await import('flowbite');
    const { Modal } = await import('flowbite');
    const doc = this.ssrService.getDocument();

    if (doc) {
      this.services.forEach(service => {
        const orderButton = doc.getElementById(`dropdownOrderButton-${service.id}`);
        const orderDropdown = doc.getElementById(`dropdownOrder-${service.id}`);

        if (orderButton && orderDropdown) {
          new Dropdown(orderDropdown, orderButton);
        }

        // Initialize Payment Dropdown
        const paymentButton = doc.getElementById(`dropdownPaymentButton-${service.id}`);
        const paymentDropdown = doc.getElementById(`dropdownPayment-${service.id}`);

        if (paymentButton && paymentDropdown) {
          new Dropdown(paymentDropdown, paymentButton);
        }
      }); 
    }
  }

  changeOrderStatus(service: any, status: string) {
    service.order = status;
  }

  changePaymentStatus(service: any, status: string) {
    service.payment = status;
  }

  getStatusClass(status: string): string {
    return {
      'continuing': 'bg-blue-400 text-white px-2 py-1 rounded-md',
      'completed': 'bg-green-300 text-black px-2 py-1 rounded-md',
      'not-started': 'bg-gray-200 text-black px-2 py-1 rounded-md'
    }[status] || '';
  }
}
