import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ServiceProvider } from '../../../../../core/models/service-provider.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceProvidedService } from '../../services/service-provider.service';

@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule, CommonModule],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {
  @Input() serviceProvider: ServiceProvider = <ServiceProvider>{};

  @Output() onUpdate = new EventEmitter<ServiceProvider>();
  @Output() onDelete = new EventEmitter<ServiceProvider>();

  constructor(
    private router: Router,
    private serviceProvidedService: ServiceProvidedService
  ) {}

  openDetail(serviceProvider: ServiceProvider): void {
    if (serviceProvider.id !== undefined) {
      this.router.navigate([`/ceo/service-provider/${serviceProvider.id}/edit`]);
    } else {
      console.error('Service provider ID is undefined');
    }
  }

  hideServiceProvider(): void {
    if (this.serviceProvider.id !== undefined) {
      this.serviceProvidedService.updateServiceProvidedStatus(this.serviceProvider.id, true).subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.serviceProvider.deleted = true;
          }
        },
        error: (err) => {
          console.error('Failed to hide service provider:', err);
        },
      });
    } else {
      console.error('Service provider ID is undefined');
    }
  }

  showServiceProvider(): void {
    if (this.serviceProvider.id !== undefined) {
      this.serviceProvidedService.updateServiceProvidedStatus(this.serviceProvider.id, false).subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.serviceProvider.deleted = false;
          }
        },
        error: (err) => {
          console.error('Failed to show service provider:', err);
        },
      });
    } else {
      console.error('Service provider ID is undefined');
    }
  }
}