import { Component, computed, signal } from '@angular/core';
import { TableFooterComponent } from '../../../../shared/components/table/table-footer/table-footer.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { TableActionComponent } from './table-action/table-action.component';
import { HttpClient } from '@angular/common/http';
import { ServiceContact } from '../../../../core/models/service-contact.model';
import { ServiceContactService } from '../../services/service-contact.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-service-contact',
  imports: [TableActionComponent, TableFooterComponent, TableHeaderComponent, TableRowComponent],
  templateUrl: './service-contact.component.html',
  styleUrl: './service-contact.component.css'
})
export class ServiceContactComponent {
  service_contacts = signal<ServiceContact[]>([]);
    totalItems = 0;
    page = 0;
    size = 10;
  
    constructor(
      private ServiceContactService: ServiceContactService,
      private router : Router
    ) {}
  
    ngOnInit(): void {
      this.loadServiceContact();
    }

    onAdd(): void{
      this.router.navigate(['/service-provider/add-service-contact']);
    }
  
  
    loadServiceContact(): void {
      this.ServiceContactService.getServiceContactByPage(this.page, this.size).subscribe({
        next: (response) => {
          this.service_contacts.set(response.data.items);
          this.totalItems = response.data.total;
          this.page = response.data.page;
          this.size = response.data.size;
        },
        error: (err) => {
          console.error('Failed to load Service Contacts:', err);
        },
      });
    }
    
  
    public toggleServiceContacts(checked: boolean): void {
      this.service_contacts.update((service_contacts) => {
        return service_contacts.map((service_contact) => {
          return { ...service_contact, selected: checked };
        });
      });
      
    }
  
  
    filteredServiceContacts = computed(() => {
      return this.service_contacts();
    });
}
