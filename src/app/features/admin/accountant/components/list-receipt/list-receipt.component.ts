import { Component, computed, signal } from '@angular/core';
import { TableActionComponent } from './table-action/table-action.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { ReceiptRecord } from '../../../../../core/models/tour-accountant.model';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { Router } from '@angular/router';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-list-receipt',
  imports: [

    TableActionComponent,
    TableFooterComponent,
    TableHeaderComponent,
    TableRowComponent,
  ],
  templateUrl: './list-receipt.component.html',
  styleUrl: './list-receipt.component.css'
})
export class ListReceiptComponent {
  receipts: any;
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
    this.loadReceipts();
  }

  loadReceipts(): void {
    this.transactionService.getTransactionByPage(
      this.page,
      this.size,
      this.keyword,
      this.sortField,
      this.sortDirection,
      "RECEIPT"
    ).subscribe({
      next: (response) => {
        this.receipts = response.data.items;
        console.log('RECEPITS', this.receipts);
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
    this.loadReceipts();
  }

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.page = newPage;
      this.loadReceipts();
    }
  }

  onPageSizeChange(newSize: number): void {
    this.size = newSize;
    this.page = 0;
    this.loadReceipts();
  }

  addReceipt(): void {
    this.router.navigate(['/accountant/invoice-details']);
  }
}
