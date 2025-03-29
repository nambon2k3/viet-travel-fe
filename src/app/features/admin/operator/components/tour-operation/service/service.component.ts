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
import { ServiceDetailComponent } from './service-detail/service-detail.component';
import { PayServiceComponent } from './pay-service/pay-service.component';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
  imports: [
    CommonModule,
    TourGuidePayComponent,
    PostServiceComponent,
    OrderServiceComponent,
    ServiceDetailComponent,
    CurrencyVndPipe,
    FormatDatePipe,
    PayServiceComponent
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
  @ViewChild('changeServiceModal') changeServiceModal!: ServiceDetailComponent;
  @ViewChild('tourGuidePayModal') tourGuidePayModal!: TourGuidePayComponent;
  @ViewChild('orderModal') orderModal!: OrderServiceComponent;
  @ViewChild('paymentModal') paymentModal!: PayServiceComponent;

  constructor(
    private ssrService: SsrService,
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
            bookingServiceId: service.bookingServiceId,
            bookingCode: service.bookingCode,
            bookingStatus: service.bookingStatus,
            location: service.location,
            bookingId: service.bookingId,
            id: service.serviceId,
            providerName: service.providerName,
            uniqueId: `${service.serviceId}-${service.bookingId}-${service.bookingServiceId}`,
            name: service.serviceName,
            type: this.mapCategory(service.serviceCategory),
            date: service.usingDate ? service.usingDate : 'Chưa đặt',
            quantity: service.currentQuantity,
            requestQuantity: service.requestQuantity,
            amountToPayForBooking: service.amountToPayForBooking,
            paidForBooking: service.paidForBooking,
            serviceName: service.serviceName,
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

  mapOrderStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'APPROVED': 'Đã phê duyệt',
      'NOT_ORDERED': 'Chưa đặt hàng',
      'CANCELLED': 'Bị hủy',
      'REJECTED': 'Bị từ chối',
      'ADD_REQUEST': 'Chờ phê duyệt',
      'PENDING': 'Đang xử lý',
      'SUCCESS': 'Hoàn thành',
      'NOT_AVAILABLE': 'Không có sẵn',
      'AVAILABLE': 'Có sẵn',
      'CHECKING': 'Đang kiểm tra',
      'PAID': 'Đã thanh toán',
      'UNPAID': 'Chưa thanh toán',
      'PARTIALLY_PAID': 'Thanh toán một phần'
    };
    return statusMap[status] || 'Không xác định';
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
      'Bị hủy': 'bg-red-500/20 text-red-800',
      'Bị từ chối': 'bg-red-600/20 text-red-900',
      'Chờ phê duyệt': 'bg-blue-500/20 text-blue-800',
      'Đang xử lý': 'bg-orange-500/20 text-orange-800',
      'Hoàn thành': 'bg-green-700/20 text-green-900',
      'Không có sẵn': 'bg-gray-500/20 text-gray-800',
      'Có sẵn': 'bg-green-400/20 text-green-700',
      'Đang kiểm tra': 'bg-blue-400/20 text-blue-700',
      'Đã thanh toán': 'bg-green-500/20 text-green-800',
      'Chưa thanh toán': 'bg-yellow-600/20 text-yellow-900',
      'Thanh toán một phần': 'bg-orange-400/20 text-orange-800'
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
        } else {
          console.error('Lỗi:', response.message);
        }
      },
      error: (error: any) => {
        console.error('Lỗi khi xóa dịch vụ:', error);
      }
    });
  }

  openDeleteModal(index: number) {
    const doc = this.ssrService.getDocument();
    if (doc) {
      const modalElement = doc.getElementById(`deleteTourPaxModal-${index}`) as HTMLElement;
      if (modalElement) {
        modalElement.classList.remove('hidden');
        modalElement.setAttribute('aria-hidden', 'false');
      }
    }
  }

  closeDeleteModal(index: number) {
    const doc = this.ssrService.getDocument();
    if (doc) {
      const modalElement = doc.getElementById(`deleteTourPaxModal-${index}`) as HTMLElement;
      if (modalElement) {
        modalElement.classList.add('hidden');
        modalElement.setAttribute('aria-hidden', 'true');
      }
    }
    this.fetchServices(this.scheduleId!);
    this.fetchTourGuide(this.scheduleId!);
  }

  changeOrderStatus(service: any, status: string) {
    this.selectedService = service;
    service.order = this.mapOrderStatus(status);
  }

  changePaymentStatus(service: any, status: string) {
    service.payment = this.mapPaymentStatus(status);
  }

  openPayModal(service: any) {
    this.paymentModal.selectedService = service;
    this.paymentModal.open();
  }

  openServiceDetail(service: any) {
    this.changeServiceModal.service = service;
    this.changeServiceModal.getServiceDetail();
    this.changeServiceModal.open();
  }

  openOrderModal(service: any) {
    this.orderModal.selectedService = service;
    this.orderModal.open();
  }

  onEmailSent(event: any) {
    this.fetchServices(this.scheduleId!);
    this.fetchTourGuide(this.scheduleId!);
  }

  onServiceAdded(event: any) {
    this.fetchServices(this.scheduleId!);
    this.fetchTourGuide(this.scheduleId!);
  }

  onPaymentSent(event: any) {
    this.fetchServices(this.scheduleId!);
    this.fetchTourGuide(this.scheduleId!);
  }

  openTourGuidePayModal(service: any) {
    this.tourGuidePayModal.selectedService = service;
    this.tourGuidePayModal.open();
  }
}