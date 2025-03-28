import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyVndPipe } from '../../../../../../../shared/pipes/currency-vnd.pipe';
import { SsrService } from '../../../../../../../core/services/ssr.service';
import { Modal } from 'flowbite';
import { TourService } from '../../../../services/tour.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-service-detail',
  imports: [FormsModule, CommonModule, CurrencyVndPipe, NgSelectModule],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css'],
})
export class ServiceDetailComponent {
  @Output() serviceAdded = new EventEmitter<any[]>();
  @Input() scheduleId: number | null = null;
  @Input() service: any | null = null;
  modal: Modal | null = null;

  servicePrices: any[] = [];
  finalServiceList: any[] = [];

  constructor(
    private ssrService: SsrService,
    private tourService: TourService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const document = this.ssrService.getDocument();
    if (document) {
      const modalElement = document.getElementById('changeServiceModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
      }
    }
  }

  getTotalPrice(): number {
    return this.servicePrices.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }

  increaseQuantity(index: number) {
    this.servicePrices[index].quantity = Number(this.servicePrices[index].quantity) + 1;
  }

  decreaseQuantity(index: number) {
    const currentQuantity = Number(this.servicePrices[index].quantity);
    if (currentQuantity > 1) {
      this.servicePrices[index].quantity = currentQuantity - 1;
    }
  }

  updateQuantity(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    let newQuantity = Number(input.value);

    // Ensure the quantity is at least 1
    if (isNaN(newQuantity) || newQuantity < 1) {
      newQuantity = 1;
    }

    // Update the quantity in the servicePrices array
    this.servicePrices[index].quantity = newQuantity;
  }

  open() {
    this.modal?.show();
  }

  close() {
    this.modal?.hide();
  }
}