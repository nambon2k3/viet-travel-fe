// src/app/features/service-provider/components/service/service.component.ts
import { Component, computed, signal } from '@angular/core';
import { TableFooterComponent } from '../../../../shared/components/table/table-footer/table-footer.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { TableActionComponent } from './table-action/table-action.component';
import { Router } from '@angular/router';
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";
import { ServiceService } from '../../services/service.service';
import { ApiResponse, PaginatedData } from '../../../../core/models/api-response.model';
import { ServiceBase, ServiceResponse } from '../../../../core/models/service.model';
import { AuthService } from '../../services/auth-service.service'; // Cập nhật import

@Component({
  selector: 'app-service',
  imports: [TableActionComponent, TableFooterComponent, TableHeaderComponent, TableRowComponent, SpinnerComponent],
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css'],
  standalone: true
})
export class ServiceComponent {
  services = signal<ServiceBase[]>([]);
  totalItems = signal(0);
  page = signal(0);
  pageItemCount = signal(10);
  totalPages = signal(0);
  isLoading: boolean = false;
  serviceProviderName: string | null;

  searchQuery: string = '';
  statusFilter: string = '';
  orderFilter: string = '1';

  constructor(
    private router: Router,
    private serviceService: ServiceService,
    private authService: AuthService // Inject AuthService từ path mới
  ) {
    this.serviceProviderName = this.authService.getProviderName();
    if (!this.authService.isLoggedIn()) {
      console.warn('User not logged in. Redirecting to login...');
      this.router.navigate(['/login']);
    }
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadServices();
    }
  }

  loadServices(): void {
    this.isLoading = true;
    this.serviceService.getServices(
      this.page(),
      this.pageItemCount(),
      this.searchQuery,
      this.statusFilter === '2' ? true : this.statusFilter === '1' ? false : undefined,
      'createdAt',
      this.orderFilter === '1' ? 'desc' : 'asc'
    ).subscribe({
      next: (response: ApiResponse<PaginatedData<ServiceBase>>) => {
        if (response.code === 0) {
          const data = response.data as PaginatedData<ServiceBase>;
          this.services.set(data.items || []);
          this.totalItems.set(data.total || 0);
          this.page.set(data.page || 0);
          this.pageItemCount.set(data.size || 10);
          this.totalPages.set(Math.ceil(this.totalItems() / this.pageItemCount()));
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load services:', err);
        this.isLoading = false;
        if (err.message === 'No authentication token found') {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onAdd(): void {
    this.router.navigate(['/service-provider/services/add']);
  }

  onSearch(filters: any): void {
    this.searchQuery = filters.keyword || '';
    this.statusFilter = filters.status || '';
    this.orderFilter = filters.order || '1';
    this.page.set(0);
    this.loadServices();
  }

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.page.set(newPage);
      this.loadServices();
    }
  }

  onPageSizeChange(newSize: number): void {
    this.pageItemCount.set(newSize);
    this.page.set(0);
    this.loadServices();
  }

  toggleServices(checked: boolean): void {
    this.services.update((services) => {
      return services.map((service) => {
        return { ...service, selected: checked };
      });
    });
  }

  filteredServices = computed(() => {
    return this.services();
  });
}