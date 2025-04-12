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
import { SpinnerComponent } from '../../../../../../shared/components/spinner/spinner.component'; // Import SpinnerComponent

interface Service {
  bookingServiceId: number;
  bookingCode: string;
  bookingStatus: string;
  location: string;
  bookingId: number;
  id: number;
  providerName: string;
  uniqueId: string;
  name: string;
  type: string;
  date: string;
  quantity: number;
  requestQuantity: number;
  amountToPayForBooking: number;
  paidForBooking: number;
  serviceName: string;
  order: string;
  payment: string;
  status: string;
}

interface ServiceGroup {
  bookingCode: string;
  services: Service[];
}

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
    PayServiceComponent,
    SpinnerComponent // Add SpinnerComponent to imports
  ]
})
export class ServiceComponent {
  selectedService: Service | null = null;
  services: Service[] = [];
  groupedServices: ServiceGroup[] = [];
  totalService: number = 0;
  paid: number = 0;
  remain: number = 0;
  totalCost: number = 0;
  tourGuide: string | null = null;
  scheduleId: number | null = null;
  isLoading: boolean = false;

  @ViewChild('chooseServiceModal') chooseServiceModal!: PostServiceComponent;
  @ViewChild('changeServiceModal') changeServiceModal!: ServiceDetailComponent;
  @ViewChild('tourGuidePayModal') tourGuidePayModal!: TourGuidePayComponent;
  @ViewChild('orderModal') orderModal!: OrderServiceComponent;
  @ViewChild('paymentModal') paymentModal!: PayServiceComponent;

  constructor(
    private ssrService: SsrService,
    private tourService: TourService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.scheduleId = +id;
        this.fetchServices(this.scheduleId);
        this.fetchTourGuide(this.scheduleId);
      } else {
        console.error('ID không hợp lệ.');
      }
    });
  }

  fetchTourGuide(id: number): void {
    this.isLoading = true;
    this.tourService.getTourById(id).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.code === 200) {
          this.tourGuide = response.data.tourGuideName;
        } else {
          console.error('Lỗi khi tải thông tin hướng dẫn viên:', response.message);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Lỗi khi tải chi tiết tour:', error);
      }
    });
  }

  fetchServices(id: number): void {
    this.isLoading = true;
    this.tourService.getServices(id).subscribe({
      next: (response: any) => {
        this.isLoading = false;
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

          this.groupServices();
          this.initDropdowns();
        } else {
          console.error('Lỗi khi tải danh sách dịch vụ:', response.message);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Lỗi khi tải danh sách dịch vụ:', error);
      }
    });
  }

  groupServices(): void {
    const grouped = this.services.reduce((acc: { [key: string]: Service[] }, service: Service) => {
      (acc[service.bookingCode] = acc[service.bookingCode] || []).push(service);
      return acc;
    }, {});

    this.groupedServices = Object.keys(grouped).map(bookingCode => ({
      bookingCode,
      services: grouped[bookingCode]
    }));
  }

  mapOrderStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'APPROVED': 'Đã phê duyệt',
      'NOT_ORDERED': 'Chưa đặt hàng',
      'CANCELLED': 'Bị hủy',
      'REJECTED': 'Bị từ chối',
      'ADD_REQUEST': 'Chờ phê duyệt',
      'PENDING': 'Đang xử lý',
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

  mapPaymentStatus(status: string): string {
    const paymentStatusMap: { [key: string]: string } = {
      'UNPAID': 'Chưa thanh toán',
      'PAID': 'Đã thanh toán',
      'PARTIALLY_PAID': 'Thanh toán một phần'
    };
    return paymentStatusMap[status] || 'Chưa thanh toán';
  }

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

  async initDropdowns(): Promise<void> {
    const { Dropdown } = await import('flowbite');
    const doc = this.ssrService.getDocument();

    if (doc) {
      this.groupedServices.forEach(group => {
        group.services.forEach(service => {
          const orderButton = doc.getElementById(`dropdownOrderButton-${service.uniqueId}`);
          const orderDropdown = doc.getElementById(`dropdownOrder-${service.uniqueId}`);
          if (orderButton && orderDropdown) {
            new Dropdown(orderDropdown, orderButton);
          } else {
            console.warn(`Order dropdown elements not found for service ${service.uniqueId}`);
          }

          const paymentButton = doc.getElementById(`dropdownPaymentButton-${service.uniqueId}`);
          const paymentDropdown = doc.getElementById(`dropdownPayment-${service.uniqueId}`);
          if (paymentButton && paymentDropdown) {
            new Dropdown(paymentDropdown, paymentButton);
          } else {
            console.warn(`Payment dropdown elements not found for service ${service.uniqueId}`);
          }
        });
      });
    }
  }

  deleteService(serviceId: number): void {
    this.isLoading = true;
    this.tourService.deleteService(serviceId).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.code === 200) {
          console.log('Dịch vụ đã được xóa thành công!');
          this.fetchServices(this.scheduleId!);
          this.fetchTourGuide(this.scheduleId!);
        } else {
          console.error('Lỗi khi xóa dịch vụ:', response.message);
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Lỗi khi xóa dịch vụ:', error);
      }
    });
  }

  openDeleteModal(index: number): void {
    const doc = this.ssrService.getDocument();
    if (doc) {
      const modalElement = doc.getElementById(`deleteTourPaxModal-${index}`) as HTMLElement;
      if (modalElement) {
        modalElement.classList.remove('hidden');
        modalElement.setAttribute('aria-hidden', 'false');
      }
    }
  }

  closeDeleteModal(index: number): void {
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

  openPayModal(service: Service): void {
    this.selectedService = service;
    this.paymentModal.selectedService = service;
    this.paymentModal.open();
  }

  openServiceDetail(service: Service): void {
    this.selectedService = service;
    this.changeServiceModal.service = service;
    this.changeServiceModal.getServiceDetail();
    this.changeServiceModal.open();
  }

  openOrderModal(service: Service): void {
    this.selectedService = service;
    this.orderModal.selectedService = service;
    this.orderModal.open();
  }

  openTourGuidePayModal(service: Service): void {
    this.selectedService = service;
    this.tourGuidePayModal.selectedService = service;
    this.tourGuidePayModal.tourGuide = this.tourGuide;
    this.tourGuidePayModal.open();
  }

  onEmailSent(event: any): void {
    console.log('Email đã được gửi thành công!');
    this.fetchServices(this.scheduleId!);
    this.fetchTourGuide(this.scheduleId!);
  }

  onServiceAdded(event: any): void {
    console.log('Dịch vụ đã được thêm thành công!');
    this.fetchServices(this.scheduleId!);
    this.fetchTourGuide(this.scheduleId!);
  }

  onPaymentSent(event: any): void {
    console.log('Thanh toán đã được gửi thành công!');
    this.fetchServices(this.scheduleId!);
    this.fetchTourGuide(this.scheduleId!);
  }
}