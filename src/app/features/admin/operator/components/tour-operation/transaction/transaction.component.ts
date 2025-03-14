import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { PostAdvancePaymentComponent } from './post-advance-payment/post-advance-payment.component';
import { Router } from '@angular/router';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../core/services/ssr.service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    CommonModule,
    PostAdvancePaymentComponent
  ],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent {
  @ViewChild('paymentModal') paymentModal!: PostAdvancePaymentComponent;

  logs = [
    { id: 1, title: "Lu’s Lunch", date: "20/03/2025", action: "Pay", logContent: "This is order lunch service for Lan Than" },
    { id: 2, title: "Lu’s Dinner", date: "20/03/2025", action: "Change service", logContent: "This is order lunch service for Lan Than" }
  ];

  private modalInstance: Modal | null = null;

  constructor(
    private router: Router,
    private ssrService: SsrService
  ) { }

  ngAfterViewInit(): void {
    this.initModal();
  }

  openPostReceipt(): void {
    this.router.navigate(['/operator/tour-operation/create-receipt']);
  }

  initModal(): void {
    if (this.ssrService.isBrowser) {
      const modalElement = document.getElementById('paymentModal');
      if (modalElement && !this.modalInstance) {
        this.modalInstance = new Modal(modalElement);
      }
    }
  }
}