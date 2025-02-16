import { Component, computed, signal } from '@angular/core';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { TableHeaderComponent } from '../table-header/table-header.component';
import { TableRowComponent } from '../table-row/table-row.component';
import { TableActionComponent } from '../table-action/table-action.component';
import { HttpClient } from '@angular/common/http';
import { ServiceContact } from '../../../../../core/models/service-contact.model';
import { ServiceContactService } from '../../../services/service-contact.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-service-contact',
  templateUrl: './add-service-contact.component.html',
  styleUrls: ['./add-service-contact.component.css']
})
export class AddServiceContactComponent {

  constructor(private router: Router) {}

  onSubmit(form: any) {
    // Handle form submission logic, e.g., send the data to a backend service
    console.log(form.value);
    this.router.navigate(['/service-contact']);
  }

  onCancel(): void {
    this.router.navigate(['/service-provider/service-contact']);
  }
}