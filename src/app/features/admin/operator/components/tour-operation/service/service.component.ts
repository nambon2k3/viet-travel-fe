import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { SsrService } from '../../../../../../core/services/ssr.service';
import { TourGuidePayComponent } from './tour-guide-pay/tour-guide-pay.component';
import { PostServiceComponent } from './post-service/post-service.component';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderServiceComponent } from './order-service/order-service.component';
import { CurrencyVndPipe } from '../../../../../../shared/pipes/currency-vnd.pipe';
import { FormatDatePipe } from '../../../../../../shared/pipes/format-date.pipe';
import { TourService } from '../../../services/tour.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
  imports: [
    CommonModule,
    TourGuidePayComponent,
    PostServiceComponent,
    OrderServiceComponent,
    CurrencyVndPipe,
    FormatDatePipe
  ]
})
export class ServiceComponent {
  selectedService: any = null;
  services: any[] = [];
  totalService: number = 0;
  paid: number = 0;
  remain: number = 0;
  totalCost: number = 0;
  tourGuide: any = null;

  @ViewChild('chooseServiceModal') chooseServiceModal!: PostServiceComponent;
  @ViewChild('tourGuidePayModal') tourGuidePayModal!: TourGuidePayComponent;
  @ViewChild('orderModal') orderModal!: OrderServiceComponent;

  constructor(
    private ssrService: SsrService,
    private router: Router,
    private tourService: TourService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.fetchServices(id);
        this.fetchTourGuide(id);
      }
    });
  }

  fetchTourGuide(id: number) {
    this.tourService.getTourById(id).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.tourGuide = response.data.tourGuideName;
        } else {
          console.error('Lỗi:', response.message);
        }
      },
      error: (error: any) => {
        console.error('Lỗi khi tải chi tiết tour:', error);
      }
    });
  }

  fetchServices(id: number) {
    this.tourService.getServices(id).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.services = response.data.services.map((service: any) => ({
            id: service.serviceId,
            name: service.serviceName,
            type: service.serviceCategory,
            bookingId: service.bookingCode,
            date: service.usingDate,
            quantity: service.requestQuantity,
            order: service.bookingStatus,
            payment: service.paymentStatus,
            status: this.mapStatus(service.bookingStatus)
          }));
          this.totalService = response.data.totalNumOfService;
          this.paid = response.data.paidAmount;
          this.remain = response.data.remainingAmount;
          this.totalCost = response.data.totalAmount;

          this.inits(); // Initialize dropdowns and modals after data is fetched
        } else {
          console.error('Lỗi:', response.message);
        }
      },
      error: (error: any) => {
        console.error('Lỗi khi tải danh sách dịch vụ:', error);
      }
    });
  }

  mapStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'APPROVED': 'continuing', // Updated to match your CSS classes
      'Paid': 'completed',
      'Not Ordered': 'not-started'
    };
    return statusMap[status] || 'not-started';
  }

  async inits() {
    const { Dropdown } = await import('flowbite');
    const doc = this.ssrService.getDocument();

    if (doc) {
      this.services.forEach(service => {
        const orderButton = doc.getElementById(`dropdownOrderButton-${service.id}`);
        const orderDropdown = doc.getElementById(`dropdownOrder-${service.id}`);
        if (orderButton && orderDropdown) {
          new Dropdown(orderDropdown, orderButton);
        } else {
          console.error(`Order dropdown elements not found for service ${service.id}`);
        }

        const paymentButton = doc.getElementById(`dropdownPaymentButton-${service.id}`);
        const paymentDropdown = doc.getElementById(`dropdownPayment-${service.id}`);
        if (paymentButton && paymentDropdown) {
          new Dropdown(paymentDropdown, paymentButton);
        } else {
          console.error(`Payment dropdown elements not found for service ${service.id}`);
        }
      });
    }
  }

  deleteService(serviceId: number) {
    this.tourService.deleteService(serviceId).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.services = this.services.filter(service => service.id !== serviceId);
          this.inits(); // Re-initialize after DOM changes
        } else {
          console.error('Lỗi:', response.message);
        }
      },
      error: (error: any) => {
        console.error('Lỗi khi xóa dịch vụ:', error);
      }
    });
  }

  changeOrderStatus(service: any, status: string) {
    this.selectedService = service;
    service.order = status;
  }

  changePaymentStatus(service: any, status: string) {
    service.payment = status;
  }

  openServiceDetail(serviceId: number) {
    this.router.navigate(['/operator/tour-operation/service', serviceId]);
  }

  openOrderModal(service: any) {
    this.selectedService = service;
    this.orderModal.open();
  }

  openTourGuidePayModal(service: any) {
    this.selectedService = service;
    this.tourGuidePayModal.open();
  }

  getStatusClass(status: string): string {
    return {
      'continuing': 'bg-blue-400 text-white px-2 py-1 rounded-md',
      'completed': 'bg-green-300 text-black px-2 py-1 rounded-md',
      'not-started': 'bg-gray-200 text-black px-2 py-1 rounded-md'
    }[status] || '';
  }
}