import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { PostAdvancePaymentComponent } from '../log/post-advance-payment/post-advance-payment.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction',
  imports: [
    CommonModule,
    PostAdvancePaymentComponent
  ],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent {
  @ViewChild('paymentModal') paymentModal!: PostAdvancePaymentComponent;
  
    logs = [
      { id: 1, title: "Lu’s Lunch", date: "20/03/2025", action: "Pay", logContent: "This is order lunch service for Lan Than" },
      { id: 2, title: "Lu’s Dinner", date: "20/03/2025", action: "Change service", logContent: "This is order lunch service for Lan Than" }
    ];
  
    constructor(
      private router: Router
    ) { }
  
    async ngAfterViewInit() {
      const { Modal } = await import('flowbite');
  
    }
    openPostReceipt() {
      this.router.navigate(['/operator/tour-operation/create-receipt']);
    }
}
