import { Component, computed, signal } from '@angular/core';
import { TableFooterComponent } from '../../../../shared/components/table/table-footer/table-footer.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { TableActionComponent } from './table-action/table-action.component';
import { HttpClient } from '@angular/common/http';
import { ServiceProvider } from '../../../../core/models/service-provider.model';
import { ServiceProvidedService } from '../../services/service-provided.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-service-provided',
  imports: [TableActionComponent, TableFooterComponent, TableHeaderComponent, TableRowComponent],
  templateUrl: './service-provided.component.html',
  styleUrl: './service-provided.component.css'
})
export class ServiceProvidedComponent {
  service_provideds = signal<ServiceProvider[]>([]);
    totalItems = 0;
    page = 0;
    size = 10;
  
    constructor(
      private ServiceProvidedService: ServiceProvidedService,
      private router : Router
    ) {}
  
    ngOnInit(): void {
      this.loadServiceProvided();
    }

    onAdd(): void{
      this.router.navigate(['/service-provider/add-services']);
    }
  
  
    loadServiceProvided(): void {
      this.ServiceProvidedService.getServiceProvidedByPage(this.page, this.size).subscribe({
        next: (response) => {
          this.service_provideds.set(response.data.items);
          this.totalItems = response.data.total;
          this.page = response.data.page;
          this.size = response.data.size;
        },
        error: (err) => {
          console.error('Failed to load Services Provided:', err);
        },
      });
    }
    
  
    public toggleServiceProvided(checked: boolean): void {
      this.service_provideds.update((service_provideds) => {
        return service_provideds.map((service_provided) => {
          return { ...service_provided, selected: checked };
        });
      });
      
    }
  
  
    filteredServiceProvideds = computed(() => {
      return this.service_provideds();
    });
}
