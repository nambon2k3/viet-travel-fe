import { AfterViewInit, Component } from '@angular/core';
import { TourService } from '../../services/tour.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CurrencyVndPipe } from "../../../../../shared/pipes/currency-vnd.pipe";
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { Modal } from 'flowbite';
import { CANCELLED } from 'node:dns';

@Component({
  selector: 'app-tour-booking-service',
  imports: [CommonModule, CurrencyVndPipe, ReactiveFormsModule, RouterModule],
  templateUrl: './tour-booking-service.component.html',
  styleUrl: './tour-booking-service.component.css'
})
export class TourBookingServiceComponent implements AfterViewInit{

  tourBookingId?: number;

  dayServices : any;

  totalServices: number = 0;

  selectedTourBookingService: any;

  serviceCategoryMap: { [key: string]: string } = {
    'Hotel': 'Khách sạn',
    'Restaurant': 'Nhà hàng',
    'Transport': 'Phương tiện'
  };

  constructor(
    private tourService: TourService,
    private router: Router,
    private fb: FormBuilder,
    private bookingService: BookingService,
  ) {

  }

  bookingServiceForm!: FormGroup;

  bookingServiceNotOrderForm!: FormGroup;

  serviceNotOrderModal: Modal | null = null;

  serviceModal: Modal | null = null;

  ngAfterViewInit(): void {
    this.serviceModal = new Modal(document.getElementById('service-modal'));
    this.serviceNotOrderModal = new Modal(document.getElementById('service-not-order-modal'));
  }


  openModal(service: any): void {
    if(service.status === 'NOT_ORDERED' || service.status === 'CANCELLED' || service.status === 'CHECKING' || service.status === 'SUCCESS') {
      this.openServiceNotOrderModal(service);
    } else {
      this.openServiceModal(service);
    }
  }

  openServiceNotOrderModal(service: any): void {
    this.serviceNotOrderModal?.show();
    this.selectedTourBookingService = service;
    this.updateInfoBookingServiceNotOrderForm();
  }

  closeServiceNotOrderModal(): void {
    this.serviceNotOrderModal?.hide();
  }

  openServiceModal(service: any): void {
    this.serviceModal?.show();
    this.selectedTourBookingService = service;
    this.updateInfoBookingServiceForm();
  }

  closeServiceModal(): void {
    this.serviceModal?.hide();
  }

  updateInfoBookingServiceForm() {
    this.bookingServiceForm.patchValue({
      tourBookingServiceId: this.selectedTourBookingService.id,
      currentQuantity: this.selectedTourBookingService.currentQuantity,
    });
  }

  ngOnInit():void {
    const tourBookingId = Number(this.router.url.split('/').pop());
    //const tourBookingId = 84;

    if (tourBookingId) {
      this.tourBookingId = tourBookingId;
      this.getBookingService(tourBookingId);
    }

    this.bookingServiceForm = this.fb.group({
      tourBookingServiceId: [5, Validators.required],
      currentQuantity: [0, [Validators.required, Validators.min(0)]],
      requestedQuantity: [0, [Validators.required, Validators.min(0)]],
      reason: ['', Validators.required]
    });

    this.bookingServiceNotOrderForm = this.fb.group({
      tourBookingServiceId: [5, Validators.required],
      currentQuantity: [0, [Validators.required, Validators.min(0)]],
    });
  }

  updateInfoBookingServiceNotOrderForm() {
    this.bookingServiceNotOrderForm.patchValue({
      tourBookingServiceId: this.selectedTourBookingService.id,
      currentQuantity: this.selectedTourBookingService.currentQuantity
    });
  }

  getBookingService(tourBookingId: number): void {
    this.bookingService.getBookingService(tourBookingId).subscribe({
      next: (response) => {
        this.dayServices = response.data;
        this.dayServices.sort((a:any, b:any) => a.tourDay.dayNumber - b.tourDay.dayNumber);
        this.calculateSummary()

        console.log('Day Services:', this.dayServices);
      },
      error: (error) => {
        console.error('Booking Failed:', error);
      }
    });

  }

  totalDays = 0;
  statusCounter = {
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    NOT_ORDERED: 0,
    CANCELLED: 0
  };

  statusLabels: { [key: string]: string } = {
    PENDING: 'Đang chờ xử lý',
    APPROVED: 'Đã phê duyệt',
    REJECTED: 'Bị từ chối',
    NOT_ORDERED: 'Chưa đặt dịch vụ',
    CANCELLED: 'Đã hủy'
  };

  statusKeys(): string[] {
    return Object.keys(this.statusCounter);
  }

  getStatusCount(status: string): number {
    return this.statusCounter[status as keyof typeof this.statusCounter] || 0;
  }

  calculateSummary(): void {
    this.totalDays = this.dayServices.length;
    this.totalServices = 0;
    this.statusCounter = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      NOT_ORDERED: 0,
      CANCELLED: 0
    };
    this.dayServices.forEach((dayService: any) => {
      this.totalServices += dayService.bookingServices.length;
      dayService.bookingServices.forEach((service:any) => {
        const status = service.status as keyof typeof this.statusCounter
        if (this.statusCounter.hasOwnProperty(status)) {
          this.statusCounter[status]++;
        }
      });
    });
  }


  onSubmit(): void {
    if (this.bookingServiceForm.valid) {
      console.log('Updated booking service:', this.bookingServiceForm.value);
      // call your update API here
    }
  }


  submitBooking(action: string) {
    switch(action) {
      case 'CHECKING':
        this.chekingService();
        break;
      case 'SAVE':
        this.saveChanges();
        break;
      case 'CANCEL':
        this.cancelService();
        break;
    }
  }

  chekingService() {
    // Logic đặt dịch vụ
    console.log('Đặt dịch vụ:', this.bookingServiceNotOrderForm.value);

    this.bookingService.sendCheckingAvailable(this.bookingServiceNotOrderForm.value.tourBookingServiceId).subscribe({
      next: (response) => {
        console.log('Updated service:', response);
        this.getBookingService(this.tourBookingId!);
        this.closeServiceNotOrderModal();
      }
    });

  }
  
  saveChanges() {
    // Logic lưu thay đổi
    console.log('Lưu thay đổi:', this.bookingServiceNotOrderForm.value);

    this.bookingService.updateServiceQuantity(this.bookingServiceNotOrderForm.value).subscribe({
      next: (response) => {
        console.log('Updated service:', response);
        this.getBookingService(this.tourBookingId!);
        this.closeServiceNotOrderModal();
      }
    });


  }
  
  cancelService() {
    // Logic hủy dịch vụ
    console.log('Hủy dịch vụ:', this.bookingServiceNotOrderForm.value);

    this.bookingService.cancelService(this.bookingServiceNotOrderForm.value.tourBookingServiceId).subscribe({
      next: (response) => {
        console.log('Canceled service:', response);
        this.getBookingService(this.tourBookingId!);
        this.closeServiceNotOrderModal();
      }
    });
  }

}
