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
  scheduleId: number | null = null;

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
        this.scheduleId = id;
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
            uniqueId: `${service.serviceId}-${service.bookingId}`,
            name: service.serviceName,
            type: this.mapCategory(service.serviceCategory),
            bookingId: service.bookingCode,
            date: service.usingDate,
            quantity: service.requestQuantity,
            order: this.mapOrderStatus(service.bookingStatus),
            payment: this.mapPaymentStatus(service.paymentStatus),
            status: this.mapOrderStatus(service.bookingStatus)
          }));
          this.totalService = response.data.totalNumOfService;
          this.paid = response.data.paidAmount;
          this.remain = response.data.remainingAmount;
          this.totalCost = response.data.totalAmount;
  
          this.inits();
        } else {
          console.error('Lỗi:', response.message);
        }
      },
      error: (error: any) => {
        console.error('Lỗi khi tải danh sách dịch vụ:', error);
      }
    });
  }

  // Map booking status to Vietnamese and for display
  mapOrderStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'APPROVED': 'Đã phê duyệt',
      'NOT_ORDERED': 'Chưa đặt hàng',
      'CANCEL_REQUEST': 'Bị từ chối',
      'ADD_REQUEST': 'Chờ phê duyệt'
    };
    return statusMap[status] || 'Chưa đặt hàng';
  }

  mapCategory(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Hotel': 'Khách sạn',
      'Restaurant': 'Nhà hàng',
      'Transport': 'Phương tiện'
    };
    return statusMap[status] || 'Nhà hàng';
  }

  // Map payment status to Vietnamese
  mapPaymentStatus(status: string): string {
    const paymentStatusMap: { [key: string]: string } = {
      'UNPAID': 'Chưa thanh toán',
      'PAID': 'Đã thanh toán',
      'PARTIALLY_PAID': 'Thanh toán một phần'
    };
    return paymentStatusMap[status] || 'Chưa thanh toán';
  }

  // Map status to colors for both order and payment
  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      'Đã phê duyệt': 'bg-green-500/20 text-green-800',
      'Chưa đặt hàng': 'bg-yellow-500/20 text-yellow-800',
      'Bị từ chối': 'bg-red-500/20 text-red-800',
      'Chờ phê duyệt': 'bg-blue-500/20 text-blue-800',
      'Đã thanh toán': 'bg-green-500/20 text-green-800',
      'Chưa thanh toán': 'bg-yellow-500/20 text-yellow-800',
      'Thanh toán một phần': 'bg-orange-500/20 text-orange-800'
    };
    return colorMap[status] || 'bg-gray-500/20 text-gray-800';
  }

  async inits() {
    const { Dropdown } = await import('flowbite');
    const doc = this.ssrService.getDocument();
  
    if (doc) {
      this.services.forEach(service => {
        const orderButton = doc.getElementById(`dropdownOrderButton-${service.uniqueId}`);
        const orderDropdown = doc.getElementById(`dropdownOrder-${service.uniqueId}`);
        if (orderButton && orderDropdown) {
          new Dropdown(orderDropdown, orderButton);
        } else {
          console.error(`Order dropdown elements not found for service ${service.uniqueId}`);
        }
  
        const paymentButton = doc.getElementById(`dropdownPaymentButton-${service.uniqueId}`);
        const paymentDropdown = doc.getElementById(`dropdownPayment-${service.uniqueId}`);
        if (paymentButton && paymentDropdown) {
          new Dropdown(paymentDropdown, paymentButton);
        } else {
          console.error(`Payment dropdown elements not found for service ${service.uniqueId}`);
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
    service.order = this.mapOrderStatus(status); // Update to Vietnamese
  }

  changePaymentStatus(service: any, status: string) {
    service.payment = this.mapPaymentStatus(status); // Update to Vietnamese
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
}