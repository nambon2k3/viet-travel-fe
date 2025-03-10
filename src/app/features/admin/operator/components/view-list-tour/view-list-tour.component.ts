import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { Tour } from '../../../../../core/models/tour.model';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { TableActionComponent } from './table-action/table-action.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';

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
  tours = signal<Tour[]>([ ]);

  totalItems = this.tours().length;
  page = 0;
  size = 10;
  totalPages = signal(Math.ceil(this.totalItems / this.size));
  isLoading: boolean = false;

  keyword = '';
  status?: boolean;
  sortDirection = 'desc';

  constructor(private router: Router, private tourService: TourService) {}

  ngOnInit(): void {
    this.loadTours();
  }

  loadTours(): void {
    this.isLoading = true;
    // this.tourService.getTourByPage(
    //   this.page,
    //   this.size,
    //   this.keyword,
    //   this.status,
    //   this.sortDirection
    // ).subscribe({
    //   next: (response) => {
    //     this.tours.set(response.data.items);
    //     this.totalItems = response.data.total;
    //     this.page = response.data.page;
    //     this.size = response.data.size;
    //     this.totalPages.set(Math.ceil(this.totalItems / this.size));
    //     this.isLoading = false;
    //   },
    //   error: (err) => {
    //     console.error('Failed to load tours:', err);
    //   }
    // });
  }

  onSearch(filters: any): void {
    this.keyword = filters.keyword || '';
    this.status = filters.status === '2' ? true : filters.status === '1' ? false : undefined;
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

  openPostTourDetail(): void {
    this.router.navigate(['/marketer/add-tour']);
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
