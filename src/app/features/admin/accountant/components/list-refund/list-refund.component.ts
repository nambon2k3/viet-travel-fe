import { Component, computed, signal } from '@angular/core';
import { TableActionComponent } from './table-action/table-action.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { RefundRecord } from '../../../../../core/models/tour-accountant.model';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-list-refund',
  imports: [
    TableActionComponent,
    TableFooterComponent,
    TableHeaderComponent,
    TableRowComponent,
  ],
  templateUrl: './list-refund.component.html',
  styleUrl: './list-refund.component.css'
})
export class ListRefundComponent {
  refunds: any;
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
    this.loadRefunds();
  }

  loadRefunds(): void {
    this.transactionService.getTransactionByPage(
      this.page,
      this.size,
      this.keyword,
      this.sortField,
      this.sortDirection,
      "REFUND"
    ).subscribe({
      next: (response) => {
        this.refunds = response.data.items;
        console.log('REFUND', this.refunds);
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
    this.loadRefunds();
  }

  addRefund(): void {
    this.router.navigate(['/accountant/invoice-details']);
  }

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.page = newPage;
      this.loadRefunds();
    }
  }

  onPageSizeChange(newSize: number): void {
    this.size = newSize;
    this.page = 0;
    this.loadRefunds();
  }

}
