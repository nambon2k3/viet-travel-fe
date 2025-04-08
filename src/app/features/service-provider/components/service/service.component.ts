// src/app/features/service-provider/components/service/service.component.ts
import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableFooterComponent } from '../../../../shared/components/table/table-footer/table-footer.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { TableActionComponent } from './table-action/table-action.component';
import { Router } from '@angular/router';
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";
import { ServiceService } from '../../services/service.service';
import { ApiResponse, PaginatedData } from '../../../../core/models/api-response.model';
import { ServiceBase } from '../../../../core/models/service.model';

@Component({
  selector: 'app-service',
  imports: [
    CommonModule,
    TableActionComponent,
    TableFooterComponent,
    TableHeaderComponent,
    TableRowComponent,
    SpinnerComponent
  ],
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
  serviceProviderName = signal<string | null>(null);

  searchQuery: string = '';
  statusFilter: string = '';
  orderFilter: string = '1';

  constructor(
    private router: Router,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    console.log('ServiceComponent initialized. Loading services...');
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    console.log('Calling getServices with params:', {
      page: this.page(),
      size: this.pageItemCount(),
      keyword: this.searchQuery,
      isDeleted: this.statusFilter === '2' ? true : this.statusFilter === '1' ? false : undefined,
      sortField: 'createdAt',
      sortDirection: this.orderFilter === '1' ? 'desc' : 'asc'
    });

    this.serviceService.getServices(
      this.page(),
      this.pageItemCount(),
      this.searchQuery,
      this.statusFilter === '2' ? true : this.statusFilter === '1' ? false : undefined,
      'createdAt',
      this.orderFilter === '1' ? 'desc' : 'asc'
    ).subscribe({
      next: (response: ApiResponse<PaginatedData<ServiceBase>>) => {
        console.log('API response:', response);
        if (response.code === 200) {
          const data = response.data as PaginatedData<ServiceBase>;
          console.log('Parsed data:', data);
          console.log('Services received:', data.items);
          this.services.set(data.items || []);
          console.log('Services signal updated:', this.services());
          this.totalItems.set(data.total || 0);
          this.page.set(data.page || 0);
          this.pageItemCount.set(data.size || 10);
          this.totalPages.set(Math.ceil(this.totalItems() / this.pageItemCount()));
          console.log('Pagination info:', {
            totalItems: this.totalItems(),
            page: this.page(),
            pageItemCount: this.pageItemCount(),
            totalPages: this.totalPages()
          });
          if (data.items && data.items.length > 0) {
            this.serviceProviderName.set(data.items[0].serviceProviderName || null);
            console.log('Service provider name set to:', this.serviceProviderName());
          } else {
            console.log('No services found, serviceProviderName not set.');
          }
        } else {
          console.error('API returned non-success code:', response.code, response.message);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load services:', err);
        this.isLoading = false;
      }
    });
  }

  onAdd(): void {
    console.log('Navigating to add service page...');
    this.router.navigate(['/service-provider/services/add']);
  }

  onSearch(filters: any): void {
    console.log('Search filters received:', filters);
    this.searchQuery = filters.keyword || '';
    this.statusFilter = filters.status || '';
    this.orderFilter = filters.order || '1';
    this.page.set(0);
    this.loadServices();
  }

  onPageChange(newPage: number): void {
    console.log('Page change requested to:', newPage);
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.page.set(newPage);
      this.loadServices();
    }
  }

  onPageSizeChange(newSize: number): void {
    console.log('Page size change requested to:', newSize);
    this.pageItemCount.set(newSize);
    this.page.set(0);
    this.loadServices();
  }

  toggleServices(checked: boolean): void {
    console.log('Toggling services selection to:', checked);
    this.services.update((services) => {
      return services.map((service) => {
        return { ...service, selected: checked };
      });
    });
  }

  filteredServices = computed(() => {
    const filtered = this.services();
    console.log('Filtered services computed:', filtered);
    return filtered;
  });

  onUpdate(service: ServiceBase): void {
    if (service.id !== undefined) {
      console.log('Navigating to update service page for ID:', service.id);
      this.router.navigate([`/service-provider/service/${service.id}/edit`]); // Cập nhật routing
    } else {
      console.error('Service ID is undefined');
    }
  }

  onDelete(service: ServiceBase): void {
    if (service.id !== undefined) {
      console.log('Attempting to delete service with ID:', service.id);
      this.serviceService.updateServiceStatus(service.id, true).subscribe({
        next: (response) => {
          if (response.code === 200) {
            console.log('Service deleted successfully:', response);
            this.services.update((services) => {
              return services.map(s =>
                s.id === service.id ? { ...s, deleted: true } : s
              );
            });
          } else {
            console.error('Failed to delete service, response:', response);
          }
        },
        error: (err) => {
          console.error('Failed to delete service:', err);
        }
      });
    } else {
      console.error('Service ID is undefined');
    }
  }
}