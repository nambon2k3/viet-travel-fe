import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ServiceProvided } from '../../../../../core/models/service-provided.model';
import { ServiceProvidedService } from '../../../services/service-provided.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: '[app-table-row]',
  standalone: true,
  imports: [FormsModule, AngularSvgIconModule],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {
  @Input() serviceProvided: ServiceProvided = <ServiceProvided>{};

  authorName: string = 'Loading...';
  tags: string[] = [];

  constructor(
    private serviceProvidedService: ServiceProvidedService,
    private router : Router
  ) {}

  onUpdate(): void{
    this.router.navigate(['/service-provider/update-services']);
  }

  showPopup = false; // Biến để điều khiển hiển thị popup
  isChecked = false; // Biến để theo dõi trạng thái checkbox

  // Method to toggle the service contact status
  toggleServiceProvided() {
    this.showPopup = true; // Hiện popup
  }

  // Method to confirm action
  onConfirm() {
    // Logic để thực hiện deactivate ở đây
    this.showPopup = false; // Ẩn popup
  }

  // Method to cancel action
  onCancel() {
    this.showPopup = false; // Ẩn popup
  }


  

}
