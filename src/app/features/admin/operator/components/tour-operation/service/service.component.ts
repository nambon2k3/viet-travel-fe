import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { SsrService } from '../../../../../../core/services/ssr.service';
import { Modal } from 'flowbite';
import { TourGuidePayComponent } from './tour-guide-pay/tour-guide-pay.component';
import { PostServiceComponent } from "./post-service/post-service.component";
import { ActivatedRoute, Router } from '@angular/router';
import { OrderServiceComponent } from "./order-service/order-service.component";
import { TourService } from '../../../services/tour.service';
import { CurrencyVndPipe } from "../../../../../../shared/pipes/currency-vnd.pipe";
import { FormatDatePipe } from "../../../../../../shared/pipes/format-date.pipe";

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
export class ServiceComponent implements AfterViewInit {
  selectedService: any = null;
  services: any[] = [];
  totalService: number = 0;
  paid: number = 0;
  remain: number = 0;
  totalCost: number = 0;
  modal: Modal | null = null;

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
      console.log('id:', id);
      if (id) {
        this.fetchServices(id);
      }
    });
  }

  fetchServices(id : number) {
    this.tourService.getServices(id).subscribe({
      next: (response : any) => {
        if (response.code === 200) {
          this.services = response.data.services.map((service: any) => ({
            id: service.serviceId,
            name: service.serviceName,
            type: service.serviceCategory,
            bookingId: service.bookingId,
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
        } else {
          console.error('Lỗi:', response.message);
        }
      },
      error: (error : any) => {
        console.error('Lỗi khi tải danh sách dịch vụ:', error);
      }
    });
  }

  mapStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Waiting For Accept': 'continuing',
      'Paid': 'completed',
      'Not Ordered': 'not-started'
    };
    return statusMap[status] || 'not-started';
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

  getStatusClass(status: string): string {
    return {
      'continuing': 'bg-blue-400 text-white px-2 py-1 rounded-md',
      'completed': 'bg-green-300 text-black px-2 py-1 rounded-md',
      'not-started': 'bg-gray-200 text-black px-2 py-1 rounded-md'
    }[status] || '';
  }

  async ngAfterViewInit() {
    const { Dropdown } = await import('flowbite');
    const doc = this.ssrService.getDocument();

    if (doc) {
      this.services.forEach(service => {
        const orderButton = doc.getElementById(`dropdownOrderButton-${service.id}`);
        const orderDropdown = doc.getElementById(`dropdownOrder-${service.id}`);
        if (orderButton && orderDropdown) {
          new Dropdown(orderDropdown, orderButton);
        }

        const paymentButton = doc.getElementById(`dropdownPaymentButton-${service.id}`);
        const paymentDropdown = doc.getElementById(`dropdownPayment-${service.id}`);
        if (paymentButton && paymentDropdown) {
          new Dropdown(paymentDropdown, paymentButton);
        }
      });
    }
  }
}
