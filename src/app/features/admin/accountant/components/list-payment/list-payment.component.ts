import { Component, computed, signal } from '@angular/core';
import { TableActionComponent } from './table-action/table-action.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { PaymentRecord } from '../../../../../core/models/tour-accountant.model';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-list-payment',
  imports: [

    TableActionComponent,
    TableFooterComponent,
    TableHeaderComponent,
    TableRowComponent,
  ],
  templateUrl: './list-payment.component.html',
  styleUrl: './list-payment.component.css'
})
export class ListPaymentComponent {
  payments: any;
  totalItems = 0;
    page = 0;
    size = 10;
    totalPages = signal(0);
    isLoading: boolean = false;
  
    keyword = '';
    isDeleted?: boolean;
    sortField = 'createdAt';
    sortDirection = 'desc';
  
    constructor(
      private router: Router,
      private transactionService: TransactionService
    ) { }
  
    ngOnInit(): void {
      this.loadPayments();
    }
  
    loadPayments(): void {
      this.transactionService.getTransactionByPage(
        this.page,
        this.size,
        this.keyword,
        this.sortField,
        this.sortDirection,
        "PAYMENT"
      ).subscribe({
        next: (response) => {
          this.payments = response.data.items;
          console.log('RECEPITS', this.payments);
        },
        error: (error) => {
          console.log(error);
          this.isLoading = false;
        }
      });
    }

  onSearch(filters: any): void {
    this.keyword = filters.keyword || '';
    this.isDeleted = filters.status === '2' ? true : filters.status === '1' ? false : undefined;
    this.sortDirection = filters.order === '1' ? 'desc' : 'asc';
    this.page = 0;
    this.loadPayments();
  }

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.page = newPage;
      this.loadPayments();
    }
  }

  onPageSizeChange(newSize: number): void {
    this.size = newSize;
    this.page = 0;
    this.loadPayments();
  }

  addPayment(): void {
    this.router.navigate(['/accountant/invoice-details']);
  }

}
