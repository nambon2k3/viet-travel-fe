import { Component } from '@angular/core';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../../core/services/ssr.service';
import { FormsModule } from '@angular/forms';
import { CurrencyVndPipe } from "../../../../../../../shared/pipes/currency-vnd.pipe";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-service',
  standalone: true,
  imports: [FormsModule, CommonModule, CurrencyVndPipe],
  templateUrl: './post-service.component.html',
  styleUrl: './post-service.component.css'
})
export class PostServiceComponent {
  modal: Modal | null = null;
  services = [
    { name: 'Peridot Grand Luxury Boutique Hotel', type: 'Hotel', unitPrice: 5000000 },
    { name: 'Le Jardin Hotel & Spa', type: 'Restaurant', unitPrice: 3000000 },
    { name: 'JM Marvel Hotel & Spa', type: 'Hotel', unitPrice: 4000000 }
  ];

  startDate = '2025-02-01';
  endDate = '2025-02-01';
  roomCount = 0;

  // Track selected services
  selectedServiceIndex: number | null = null;
  servicePrices = [] as any[];
  finalServiceList = [] as any[];

  constructor(private ssrService: SsrService) {}

  ngAfterViewInit() {
    const document = this.ssrService.getDocument();
    if (document) {
      const modalElement = document.getElementById('chooseServiceModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
      }
    }
  }

  // Calculate total price for all services
  getTotalPrice(): number {
    return this.servicePrices.reduce((sum, item) => sum + item.unitPrice * item.quantity * item.nights, 0);
  }

  // Increment room count
  incrementRoom() {
    this.roomCount++;
  }

  // Decrement room count
  decrementRoom() {
    if (this.roomCount > 0) this.roomCount--;
  }

  // Select a service from the list
  selectService(index: number) {
    this.selectedServiceIndex = index;
    const selectedService = this.servicePrices[index];
    this.startDate = selectedService.startDate || this.startDate;
    this.endDate = selectedService.endDate || this.endDate;
    this.roomCount = selectedService.quantity || this.roomCount;
  }

  // Add service to the servicePrices array
  addData(service?: any) {
    if (!service) return; // Prevent adding undefined service
    const nights = this.calculateNights(this.startDate, this.endDate);
    this.servicePrices.push({
      type: service.name,
      unitPrice: service.unitPrice,
      quantity: 1, // Default quantity
      nights: nights,
      startDate: this.startDate,
      endDate: this.endDate,
    });
  }

  // Update the selected service's details
  updateSelectedService() {
    if (this.selectedServiceIndex !== null) {
      const selectedService = this.servicePrices[this.selectedServiceIndex];
      selectedService.quantity = this.roomCount;
      selectedService.startDate = this.startDate;
      selectedService.endDate = this.endDate;
      selectedService.nights = this.calculateNights(this.startDate, this.endDate);
    }
  }

  // Add all services to the final list
  addServicesToFinalList() {
    this.finalServiceList = [...this.servicePrices]; // Copy servicePrices to finalServiceList
    console.log('Final Service List:', this.finalServiceList);
  }

  // Calculate number of nights based on start and end dates
  calculateNights(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) || 1; // Ensure at least 1 night
  }

  // Remove a service from the list
  removeService(index: number) {
    this.servicePrices.splice(index, 1);
    if (this.selectedServiceIndex === index) {
      this.selectedServiceIndex = null; // Reset selected service if removed
    }
  }
}