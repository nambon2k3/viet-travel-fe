import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ServiceProvided } from '../../../../../core/models/service-provided.model';
import { ServiceProvidedService } from '../../../services/service-provided.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {
  @Input() serviceProvided: ServiceProvided = <ServiceProvided>{};

  authorName: string = 'Loading...';
  tags: string[] = [];

  constructor(private serviceProvidedService: ServiceProvidedService) {}


  

}
