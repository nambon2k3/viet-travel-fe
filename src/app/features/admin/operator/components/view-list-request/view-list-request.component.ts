import { Component, computed, signal } from '@angular/core';
import { TableActionComponent } from './table-action/table-action.component';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { SpinnerComponent } from '../../../../../shared/components/spinner/spinner.component';
import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { loadRequests } from '../../../../../core/models/request.model';

const mockRequests: loadRequests[] = [
  { id: 1, tourName: "Paris Adventure", bookingId: 101, note: "VIP client", createdAt: "2024-02-20T10:30:00", deleted: false, status: 'Approved', type: "Luxury" },
  { id: 2, tourName: "Tokyo Explorer", bookingId: 102, note: "Requires translator", createdAt: "2024-02-18T09:15:00", deleted: false, status: 'Approved', type: "Standard" },
  { id: 3, tourName: "Bali Escape", bookingId: 103, note: "Anniversary trip", createdAt: "2024-02-15T14:45:00", deleted: false, status: 'Approved', type: "Honeymoon" },
  { id: 4, tourName: "New York City Tour", bookingId: 104, note: "Family trip", createdAt: "2024-02-10T08:00:00", deleted: false, status: 'Approved', type: "Family" },
  { id: 5, tourName: "London Discovery", bookingId: 105, note: "Business trip", createdAt: "2024-02-05T12:20:00", deleted: false, status: 'Approved', type: "Business" },
  { id: 6, tourName: "Rome Cultural Trip", bookingId: 106, note: "History enthusiastsHistory enthusiastsHistory enthusiasts", createdAt: "2024-01-28T16:10:00", deleted: false, status: 'Approved', type: "Cultural" },
  { id: 7, tourName: "Sydney Adventure", bookingId: 107, note: "Backpacking group", createdAt: "2024-01-22T18:40:00", deleted: false, status: 'Approved', type: "Backpacking" },
  { id: 8, tourName: "Dubai Luxury Trip", bookingId: 108, note: "Honeymoon couple", createdAt: "2024-01-15T07:25:00", deleted: false, status: 'Approved', type: "Luxury" },
  { id: 9, tourName: "Maldives Getaway", bookingId: 109, note: "Relaxation trip", createdAt: "2024-01-08T11:50:00", deleted: false, status: 'Approved', type: "Resort" },
  { id: 10, tourName: "Thailand Island Tour", bookingId: 110, note: "Group of friends", createdAt: "2024-01-02T05:30:00", deleted: false, status: 'Approved', type: "Adventure" },
];

@Component({
  selector: 'app-view-list-request',
  imports: [
    TableActionComponent,
    TableFooterComponent,
    TableHeaderComponent,
    TableRowComponent, 
    SpinnerComponent],
  templateUrl: './view-list-request.component.html',
  styleUrl: './view-list-request.component.css'
})

export class ViewListRequestComponent {
  requests = signal<loadRequests[]>(mockRequests);
    totalItems = 0;
    page = 0;
    size = 10;
    totalPages = signal(0)
    isLoading: boolean = true;
  
    
    // Store filters to persist data across pages
    keyword = '';
    isDeleted?: boolean;
    sortField = 'createdAt';
    sortDirection = 'desc';
  
    constructor(
      private router: Router,
      private requestService: RequestService) { }
  
    ngOnInit(): void {
      this.loadRequests();
    }
  
    loadRequests(): void {
      this.isLoading = true;
      this.requestService.getRequestByPage(
        this.page,
        this.size,
        this.keyword,
        this.isDeleted,
        this.sortField,
        this.sortDirection
      ).subscribe({
        next: (response) => {
          this.requests.set(response.data.items);
          this.totalItems = response.data.total;
          this.page = response.data.page;
          this.size = response.data.size;
          this.totalPages.set(Math.ceil(this.totalItems / this.size));
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load requests:', err);
        }
      });
    }
  
  
    onSearch(filters: any): void {
      this.keyword = filters.keyword || '';
      this.isDeleted = filters.status === '2' ? true : filters.status === '1' ? false : undefined;
      this.sortDirection = filters.order === '1' ? 'desc' : 'asc';
      this.page = 0; // Reset to first page on new search
      this.loadRequests();
    }
  
    onPageChange(newPage: number): void {
      if (newPage >= 0 && newPage < this.totalPages()) {
        this.page = newPage;
        this.loadRequests();
      }
    }
  
    // Change page size and reload data
    onPageSizeChange(newSize: number): void {
      this.size = newSize;
      this.page = 0; // Reset to first page
      this.loadRequests();
    }
  
    openPostRequestDetail(): void {
      this.router.navigate(['/marketer/add-request']);
    }
  
    public toggleRequests(checked: boolean): void {
      this.requests.update((requests) => {
        return requests.map((request) => {
          return { ...request, selected: checked };
        });
      });
  
    }
  
    filteredRequests = computed(() => {
      return this.requests();
    });
}
