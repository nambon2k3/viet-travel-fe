import { Component, computed, signal } from '@angular/core';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { TableHeaderComponent } from '../table-header/table-header.component';
import { TableRowComponent } from '../table-row/table-row.component';
import { TableActionComponent } from '../table-action/table-action.component';
import { HttpClient } from '@angular/common/http';
import { ServiceContact } from '../../../../../core/models/service-contact.model';
import { ServiceContactService } from '../../../services/service-contact.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-service-contact',
  imports: [FormsModule],
  templateUrl: './add-service-contact.component.html',
  styleUrls: ['./add-service-contact.component.css']
})
export class AddServiceContactComponent {

  fullName: string = '';
  email: string = '';
  phone: string = '';
  website: string = '';
  gender: string = '';
  position: string = '';
  services: string = '';

  constructor(private router: Router, private serviceContactService: ServiceContactService) {}

  onSubmit() {
    const newContact: ServiceContact = {
      id: 0,
      fullName: this.fullName,
      email: this.email,
      phoneNumber: this.phone,
      gender: this.gender.toUpperCase(),
      position: this.position,
      serviceProviderName: this.services,
      deleted: false,
      selected: false
    };

    this.serviceContactService.addServiceContact(newContact).subscribe(() => {
      this.router.navigate(['/service-contact']);
    });
  }

  onCancel(): void {
    this.router.navigate(['/service-provider/service-contact']);
  }
}