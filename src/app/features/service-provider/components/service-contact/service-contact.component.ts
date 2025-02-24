import { Component, computed, signal } from '@angular/core';
import { TableFooterComponent } from '../../../../shared/components/table/table-footer/table-footer.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { TableActionComponent } from './table-action/table-action.component';
import { SpinnerComponent } from "../../../../shared/components/spinner/spinner.component";
import { ServiceContact } from '../../../../core/models/service-contact.model';
import { ServiceContactService } from '../../services/service-contact.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-service-contact',
  imports: [TableActionComponent, TableFooterComponent, TableHeaderComponent, TableRowComponent, SpinnerComponent],
  templateUrl: './service-contact.component.html',
  styleUrl: './service-contact.component.css'
})
export class ServiceContactComponent {
  serviceContacts = signal<ServiceContact[]>([]);
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
      private serviceContactService: ServiceContactService,
      private router : Router
    ) {}
  
    ngOnInit(): void {
      this.loadServiceContact();
    }

    loadServiceContact(): void {
      this.isLoading = true;
      this.serviceContactService.getServiceContactByPage(this.page, this.size, this.search, this.status).subscribe({
        next: (response) => {
          this.serviceContacts.set(response.data.items);
          this.totalItems = response.data.total;
          this.page = response.data.page;
          this.size = response.data.size;
          this.totalPages.set(Math.ceil(this.totalItems / this.size));
          this.pageItemCount = this.serviceContacts().length;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load Service Contacts:', err);
        },
      });
    } 

    onFilter(filterData: { search: string; orderType: string; status: boolean | undefined; }) {
      this.search = filterData.search
      this.orderType = filterData.orderType
      this.status = filterData.status
      this.onPageChange(0);
    }

    onAdd(): void{
      this.router.navigate(['/service-provider/add-service-contact']);
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
