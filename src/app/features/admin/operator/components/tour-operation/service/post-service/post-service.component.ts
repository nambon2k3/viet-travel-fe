import { Component } from '@angular/core';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../../core/services/ssr.service';
import { FormsModule } from '@angular/forms';
import { CurrencyVndPipe } from "../../../../../../../shared/pipes/currency-vnd.pipe";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-service',
  imports: [
    FormsModule,
    
    CommonModule
],
  templateUrl: './post-service.component.html',
  styleUrl: './post-service.component.css'
})
export class PostServiceComponent {
  modal: Modal | null = null;
  services = [
    { name: 'Peridot Grand Luxury Boutique Hotel', type: 'Hotel' },
    { name: 'Le Jardin Hotel & Spa', type: 'Restaurant' },
    { name: 'JM Marvel Hotel & Spa', type: 'Hotel' }
  ];
  
  selectedLevel = 'Single room';
  startDate = '2025-02-01';
  endDate = '2025-02-01';
  roomCount = 0;

  servicePrices = [
    { type: 'Single Room', unitPrice: 5000000, quantity: 1, nights: 1 },
    { type: 'Double Room', unitPrice: 2500000, quantity: 1, nights: 1 }
  ];

  constructor(
    private ssrService: SsrService
  ) { }

  ngAfterViewInit() {
    const document = this.ssrService.getDocument();
    if (document) {
      const modalElement = document.getElementById('chooseServiceModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
      }
    }

  }

  getTotalPrice(): number {
    return this.servicePrices.reduce((sum, item) => sum + item.unitPrice * item.quantity * item.nights, 0);
  }

  incrementRoom() {
    this.roomCount++;
  }

  decrementRoom() {
    if (this.roomCount > 0) this.roomCount--;
  }

  openModal() {
    this.modal?.show();
  }

  closeModal() {
    this.modal?.hide();
  }

  addService() {
    this.closeModal();
  }
}
