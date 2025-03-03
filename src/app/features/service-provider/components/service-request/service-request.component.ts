import { Component, computed, signal } from '@angular/core';
import { TableFooterComponent } from '../../../../shared/components/table/table-footer/table-footer.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { TableActionComponent } from './table-action/table-action.component';
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";
import { Router } from '@angular/router';
import { ServiceRequestService } from '../../services/service-request.service';
import { ServiceRequest } from '../../../../core/models/service-request.model';

@Component({
  selector: 'app-service-request',
  imports: [TableActionComponent, TableFooterComponent, TableHeaderComponent, TableRowComponent, SpinnerComponent],
  templateUrl: './service-request.component.html',
  styleUrl: './service-request.component.css'
})
export class ServiceRequestComponent {

   serviceContacts = signal<ServiceRequest[]>([]);
    totalItems = 0;
    page = 0;
    size = 10;
    totalPages = signal(0);
    search = '';
    orderType = 'Newest';
    status = undefined as boolean | undefined;
    pageItemCount = 0;
    isLoading: boolean = false;

  constructor(
    private serviceRequestService: ServiceRequestService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.loadServiceContact();
  }

  loadServiceContact(): void {
    
  } 

  onFilter(filterData: { search: string; orderType: string; status: boolean | undefined; }) {
    this.search = filterData.search
    this.orderType = filterData.orderType
    this.status = filterData.status
    this.onPageChange(0);
  }

  onAdd(): void{
    
  }

  public toggleServiceContacts(checked: boolean): void {
    this.serviceContacts.update((service_contacts) => {
      return service_contacts.map((service_contact) => {
        return { ...service_contact, selected: checked };
      });
    });
    
  }

  filteredServiceContacts = computed(() => {
    return this.serviceContacts();
  });

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.page = newPage;
      this.loadServiceContact();
    }
  }

  onPageSizeChange(newSize: number): void {
    this.size = newSize;
    this.page = 0; // Reset về trang đầu tiên
    this.loadServiceContact();
  }
}
