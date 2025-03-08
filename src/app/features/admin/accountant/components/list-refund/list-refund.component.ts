import { Component, computed, signal } from '@angular/core';
import { TableActionComponent } from './table-action/table-action.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { RefundRecord } from '../../../../../core/models/tour-accountant.model';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { Router } from '@angular/router';

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
  refunds = signal<RefundRecord[]>([
    {
      id: 1,
      tourName: 'Tour Cái Chiên',
      createdDate: '02/02/2025',
      accountingDate: '02/02/2025',
      customerOrPartner: 'Long Nga Hotel',
      amount: 5000000,
      status: 'Hoàn thành',
    },
    {
      id: 2,
      tourName: 'Tour Cái Chiên Special',
      createdDate: '02/02/2025',
      accountingDate: '02/02/2025',
      customerOrPartner: 'Mai Restaurant',
      amount: 15000000,
      status: 'Chưa hoàn thành',
    },
    {
      id: 3,
      tourName: 'Tour Ninh Bình',
      createdDate: '02/02/2025',
      accountingDate: '03/02/2025',
      customerOrPartner: 'Cuc Phuong Resort',
      amount: 5000000,
      status: 'Hoàn thành',
    }
  ]);

  totalItems = this.refunds().length;
  page = 0;
  size = 10;
  totalPages = signal(Math.ceil(this.totalItems / this.size));
  isLoading: boolean = false;

  keyword = '';
  isDeleted?: boolean;
  sortField = 'createdAt';
  sortDirection = 'desc';

  constructor(
    private router : Router
  ) { }

  ngOnInit(): void {
    this.loadRefunds();
  }

  loadRefunds(): void {
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

  toggleRefunds(checked: boolean): void {
    this.refunds.update((refunds) => {
      return refunds.map((refunds) => {
        return { ...refunds, selected: checked };
      });
    });
  }

  filteredRefunds = computed(() => {
    return this.refunds();
  });
}
