import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyVndPipe } from '../../../../../../../shared/pipes/currency-vnd.pipe';
import { Router } from '@angular/router';
import { DateRangePicker } from 'flowbite-datepicker';
import { SsrService } from '../../../../../../../core/services/ssr.service';

@Component({
  selector: 'app-service-detail',
  imports: [FormsModule, CommonModule, CurrencyVndPipe],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css'],
})
export class ServiceDetailComponent {
  services = [
    { id: 1, name: 'Peridot Grand Luxury Boutique Hotel', type: 'Hotel', unitPrice: 5000000 },
    { id: 2, name: 'Le Jardin Hotel & Spa', type: 'Restaurant', unitPrice: 3000000 },
    { id: 3, name: 'JM Marvel Hotel & Spa', type: 'Hotel', unitPrice: 4000000 },
  ];

  startDate = '';
  endDate = '';
  roomCount = 1;

  selectedServiceIndex: number | null = null;
  servicePrices: any[] = [];
  finalServiceList: any[] = [];

  searchTerm: string = '';

  constructor(
    private router: Router,
  ) {
    const preSelectedService = this.services[0];
    if (preSelectedService) {
      this.addService(preSelectedService);
    }
  }

  get filteredServices() {
    return this.services.filter(
      (service) =>
        service.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        service.type.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  getTotalPrice(): number {
    return this.servicePrices.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity * item.nights,
      0
    );
  }

  // Increment room count
  incrementRoom() {
    this.roomCount++;
    this.updateRoomCount();
  }

  // Decrement room count
  decrementRoom() {
    if (this.roomCount > 1) this.roomCount--;
    this.updateRoomCount();
  }

  // Select a service from the list
  selectService(index: number) {
    this.selectedServiceIndex = index;
    const selectedService = this.servicePrices[index];
    this.startDate = selectedService.startDate || this.startDate;
    this.endDate = selectedService.endDate || this.endDate;
    this.roomCount = selectedService.quantity || this.roomCount;
  }

  // Add a service to the servicePrices array
  addService(service?: any) {
    if (!service || this.servicePrices.length >= 1) return;

    const nights = this.calculateNights(this.startDate, this.endDate);
    this.servicePrices.push({
      id: service.id,
      type: service.name,
      unitPrice: service.unitPrice,
      quantity: this.roomCount,
      nights: nights,
      startDate: this.startDate,
      endDate: this.endDate,
    });
    this.selectedServiceIndex = this.servicePrices.length;
  }

  // Update the selected service's details
  updateSelectedService() {
    console.log('Service Prices:', this.servicePrices);
    if (this.servicePrices.length > 0) {
      for(let i = 0; i < this.servicePrices.length; i++) {
        const selectedService = this.servicePrices[i];
        selectedService.quantity = this.roomCount;
        selectedService.startDate = this.startDate;
        selectedService.endDate = this.endDate;
        selectedService.nights = this.calculateNights(this.startDate, this.endDate);
      }
    }
  }

  calculateNights(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) || 1; // Ensure at least 1 night
  }

  removeService(index: number) {
    this.servicePrices.splice(index, 1);
    if (this.selectedServiceIndex === index) {
      this.selectedServiceIndex = null;
      this.startDate = '';
      this.endDate = '';
      this.roomCount = 1;
    }
  }

  // Add all services to the final list
  addServicesToFinalList() {
    this.finalServiceList = [...this.servicePrices]; // Copy servicePrices to finalServiceList
    console.log('Final Service List:', this.finalServiceList);
    this.router.navigate(['/operator/tour-operation/service']);
  }

  // Update room count in the selected service
  updateRoomCount() {
    if (this.selectedServiceIndex !== null) {
      const selectedService = this.servicePrices[0];
      selectedService.quantity = this.roomCount;
      selectedService.nights = this.calculateNights(this.startDate, this.endDate);
    }
  }

  // Navigate back to the service list
  backToList() {
    this.router.navigate(['/operator/tour-operation/service']);
  }
}