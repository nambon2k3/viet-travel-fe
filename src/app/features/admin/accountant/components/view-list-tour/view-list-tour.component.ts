import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TableActionComponent } from './table-action/table-action.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { TourAccountant } from '../../../../../core/models/tour-accountant.model';

@Component({
  selector: 'app-view-list-tour',
  imports: [
      TableActionComponent,
      TableFooterComponent,
      TableHeaderComponent,
      TableRowComponent, 
      //SpinnerComponent
    ],
  templateUrl: './view-list-tour.component.html',
  styleUrl: './view-list-tour.component.css'
})
export class ViewListTourComponent {
  tours = signal<TourAccountant[]>([
    {
      id: 1,
      tourName: "Tour Cái Chiên - Đầu Rồng",
      startDate: "02/02/2025",
      totalCost: 20000000,
      profit: 5000000,
      bookingCode: 234,
      status: "Đã quyết toán"
    },
    {
      id: 2,
      tourName: "Tour Cái Chiên - Đầu Rồng",
      startDate: "03/02/2025",
      totalCost: 30000000,
      profit: 5000000,
      bookingCode: 347,
      status: "Collected"
    },
    {
      id: 3,
      tourName: "Tour Đà Nẵng - Hội An 4D...",
      startDate: "02/02/2025",
      totalCost: 20000000,
      profit: 5000000,
      bookingCode: 345,
      status: "Đã thanh toán"
    }
  ]);

  totalItems = this.tours().length;
  page = 0;
  size = 10;
  totalPages = signal(Math.ceil(this.totalItems / this.size));
  isLoading: boolean = false;

  keyword = '';
  isDeleted?: boolean;
  sortField = 'createdAt';
  sortDirection = 'desc';

  constructor() {}

  ngOnInit(): void {
    this.loadTours();
  }

  loadTours(): void {
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
    this.loadTours();
  }

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.page = newPage;
      this.loadTours();
    }
  }

  onPageSizeChange(newSize: number): void {
    this.size = newSize;
    this.page = 0;
    this.loadTours();
  }

  toggleTours(checked: boolean): void {
    this.tours.update((tours) => {
      return tours.map((tour) => {
        return { ...tour, selected: checked };
      });
    });
  }

  filteredTours = computed(() => {
    return this.tours();
  });
}
