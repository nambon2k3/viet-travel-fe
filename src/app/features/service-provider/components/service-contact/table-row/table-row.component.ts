import { Component, Input} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ServiceContact } from '../../../../../core/models/service-contact.model';
import { ServiceContactService } from '../../../services/service-contact.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule, CommonModule],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {

  @Input() serviceContact: ServiceContact = <ServiceContact>{};

  authorName: string = 'Loading...';
  serviceProvider: string[] = [];

  constructor(
    private serviceContactService: ServiceContactService,
    private router : Router
  ) {}


  onUpdate(serviceContact: ServiceContact): void{
    this.router.navigate(['/service-provider/update-service-contact'], 
      { queryParams: 
        { id: serviceContact.id } 
      }
    );
  }

  hideServiceContact(): void {
    this.serviceContactService.updateServiceContactStatus(this.serviceContact.id, true).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.serviceContact.deleted = true;
        }
      },
      error: (err) => {
        console.error('Failed to hide Service Contact:', err);
      },
    });
  }

  showServiceContact(): void {
    this.serviceContactService.updateServiceContactStatus(this.serviceContact.id, false).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.serviceContact.deleted = false;
        }
      },
      error: (err) => {
        console.error('Failed to show Service Contact:', err);
      },
    });
  }

}
