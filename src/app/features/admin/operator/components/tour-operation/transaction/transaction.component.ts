import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { PostAdvancePaymentComponent } from './post-advance-payment/post-advance-payment.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { TruncatePipe } from "../../../../../../shared/pipes/truncate.pipe";
import { FormatDatePipe } from "../../../../../../shared/pipes/format-date.pipe";

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [
    CommonModule,
    PostAdvancePaymentComponent,
    TruncatePipe,
    FormatDatePipe
],
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent {
  @ViewChild('paymentModal') paymentModal!: PostAdvancePaymentComponent;
  listTransactions: any[] = [];
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.loadTransactions(this.id);
      }
    });
  }

  loadTransactions(id: number): void {
    this.tourService.getTransactions(id).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.listTransactions = response.data;
        } else {
          console.error('Lỗi:', response.message);
        }
      },
      error: (error: any) => {
        console.error('Lỗi khi tải danh sách transaction:', error.message);
      }
    });
  }

  openPostReceipt(): void {
    this.router.navigate(['/operator/tour-operation/create-receipt']);
  }
}