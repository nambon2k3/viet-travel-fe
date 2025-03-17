import { Component, computed, signal } from '@angular/core';
import { TableActionComponent } from './table-action/table-action.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { PaymentRecord } from '../../../../../core/models/tour-accountant.model';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { Router } from '@angular/router';

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
  payments = signal<PaymentRecord[]>([
    {
      id: 1,
      createdDate: '02/02/2025',
      accountingDate: '02/02/2025',
      provider: 'Long Nga Hotel',
      amount: 5000000,
      paymentMethod: 'Thanh toán',
      status: 'Hoàn thành',
    },
    {
      id: 2,
      createdDate: '02/02/2025',
      accountingDate: '02/02/2025',
      provider: 'Mai Restaurant',
      amount: 15000000,
      paymentMethod: 'Advance',
      status: 'Chưa hoàn thành',
    },
    {
      id: 3,
      createdDate: '02/02/2025',
      accountingDate: '03/02/2025',
      provider: 'Cuc Phuong Resort',
      amount: 5000000,
      paymentMethod: 'Thanh toán',
      status: 'Hoàn thành',
    }
  ]);

  totalItems = this.payments().length;
  page = 0;
  size = 10;
  totalPages = signal(Math.ceil(this.totalItems / this.size));
  isLoading: boolean = false;

  keyword = '';
  isDeleted?: boolean;
  sortField = 'createdAt';
  sortDirection = 'desc';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 500); // Simulate loading time
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

  togglePayments(checked: boolean): void {
    this.payments.update((payments) => {
      return payments.map((payments) => {
        return { ...payments, selected: checked };
      });
    });
  }

  filteredPayments = computed(() => {
    return this.payments();
  });
}
