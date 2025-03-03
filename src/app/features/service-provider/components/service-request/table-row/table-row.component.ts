import { Component, Input} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ServiceContact } from '../../../../../core/models/service-contact.model';
import { ServiceContactService } from '../../../services/service-contact.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceRequest } from '../../../../../core/models/service-request.model';
import { ServiceRequestService } from '../../../services/service-request.service';
@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule, CommonModule],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {

  @Input() serviceRequest: ServiceRequest = <ServiceRequest>{};

  authorName: string = 'Loading...';
  serviceProvider: string[] = [];

  constructor(
    private serviceRequestService: ServiceRequestService,
    private router : Router
  ) {}


  onUpdate(): void{
    
  }

  

}
