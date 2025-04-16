import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyVndPipe } from '../../../../../../../shared/pipes/currency-vnd.pipe';
import { SsrService } from '../../../../../../../core/services/ssr.service';
import { Modal } from 'flowbite';
import { TourService } from '../../../../services/tour.service';
import { error } from 'console';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [FormsModule, CommonModule, CurrencyVndPipe],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css'],
})
export class ServiceDetailComponent {
  @Input() service: any | null = null;
  @Output() serviceChange = new EventEmitter<any[]>();
  modal: Modal | null = null;
  serviceDetail: any | null = null;
  quantity: number = 1;
  totalPrice: number = 0;

  constructor(
    private tourService: TourService,
    private ssrService: SsrService  
  ) {}

  ngOnInit() {
  }

  ngAfterViewInit() {
    const document = this.ssrService.getDocument();
    if (!document) return;
    const modalElement = document.getElementById('changeServiceModal'); 
    if (modalElement) {
      this.modal = new Modal(modalElement);
    }
  }  

  getServiceDetail() {
    if (!this.service?.id) return;

    this.tourService.getServiceDetails(this.service.id).subscribe((response) => {
      if (response.code === 200) {
        this.serviceDetail = response.data;
        this.calculateTotal();
      }
    });
  }

  calculateTotal() {
    this.totalPrice = (this.serviceDetail?.sellingPrice || 0) * this.service.quantity;
  }

  updateQuantity(change: number) {
    this.service.quantity = Math.max(1, this.service.quantity + change);
    this.calculateTotal();
  }

  updateService() {
    if (!this.service?.id) return;
  
    const requestData = {
      tourBookingServiceId: this.service.bookingServiceId, // Đảm bảo ID này đúng
      newQuantity: this.service.quantity // Lấy số lượng từ input
    };
  
    this.tourService.updateServiceQuantity(requestData).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.serviceDetail = response.data;
          this.calculateTotal();
          this.serviceChange.emit(this.serviceDetail); 
          this.close();

        } else {
          console.error('Cập nhật thất bại:', response.message);
        }
      }, 
      error: (error: any) => {
        console.error('Lỗi khi gọi API:', error);
      }
    });
  }
  

  open() {
    const doc = this.ssrService.getDocument();
    if (doc) {
      const modalElement = document.getElementById('changeServiceModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
        this.modal.show();
      }
    }
  }

  close() {
    this.modal?.hide();
  }
}
