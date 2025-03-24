import { Component, Input, AfterViewInit } from '@angular/core';
import { BlogContentComponent } from '../../../../../marketer/components/blog-detail/blog-content/blog-content.component';
import { TourService } from '../../../../services/tour.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../../core/services/ssr.service';

@Component({
  selector: 'app-order-service',
  templateUrl: './order-service.component.html',
  styleUrls: ['./order-service.component.css'],
  imports: [
    BlogContentComponent,
    FormsModule,
    CommonModule
  ]
})
export class OrderServiceComponent implements AfterViewInit {
  @Input() selectedService: any;
  to: string = '';
  email: string = '';
  content: string = '';
  private modal: Modal | null = null;

  constructor(
    private tourService: TourService,
    private ssrService: SsrService
  ) { }

  ngAfterViewInit() {
    const document = this.ssrService.getDocument();
    if (document) {
      const modalElement = document.getElementById('orderModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
      }
    }
  }

  open() {
    this.to = this.selectedService?.name || '';
    this.email = this.selectedService?.name || '';
    this.content = this.selectedService?.content || '';
    this.modal?.show();
  }

  close() {
    this.modal?.hide();
  }

  sendOrder() {
    const payload = {
      providerId: this.selectedService?.id || 0,
      providerName: this.to,
      emailSubject: `[Viet Travel - ${this.selectedService?.name}] - Order Service Information`,
      emailContent: this.content
    };

    this.tourService.sendOrder(payload).subscribe({
      next: (response: any) => {
        console.log('Email sent successfully:', response.message);
        this.close();
      },
      error: (error) => {
        console.error('Error sending email:', error);
      }
    });
  }
}