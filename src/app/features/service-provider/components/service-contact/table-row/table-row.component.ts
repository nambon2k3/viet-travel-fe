import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ServiceContact } from '../../../../../core/models/service-contact.model';
import { ServiceContactService } from '../../../services/service-contact.service';
import { CommonModule, DatePipe } from '@angular/common';
@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule, DatePipe, CommonModule],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {
  @Input() serviceContact: ServiceContact = <ServiceContact>{};

  authorName: string = 'Loading...';
  tags: string[] = [];

  constructor(private serviceContactService: ServiceContactService) {}

deleteServiceContact(): void {
    this.serviceContactService.deleteServiceContact(this.serviceContact.id, true).subscribe({
      next: (response) => {
        if(response.code === 200) {
          this.serviceContact.deleted = true;
        }
      },
      error: (err) => {
        console.error('Failed to delete Service Contact:', err);
      },
    });
  }

  showServiceContact(): void {
  //   this.blogService.updateBlogStatus(this.blog.id, false).subscribe({
  //     next: (response) => {
  //       if(response.code === 200) {
  //         this.blog.deleted = false;
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Failed to show blog:', err);
  //     },
  //   });
  }

  showPopup = false; // Biến để điều khiển hiển thị popup
  isChecked = false; // Biến để theo dõi trạng thái checkbox

  // Method to toggle the service contact status
  toggleServiceContact() {
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
