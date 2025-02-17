import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() serviceDeleted = new EventEmitter<void>(); // Thông báo component cha cập nhật danh sách


  authorName: string = 'Loading...';
  tags: string[] = [];

  constructor(
    private serviceContactService: ServiceContactService,
    private router : Router
  ) {}


  onUpdate(): void{
    this.router.navigate(['/service-provider/update-service-contact']);
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
    this.serviceContactService.deleteServiceContact(this.serviceContact.id, true).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.showPopup = false; // Ẩn popup
          this.serviceDeleted.emit(); // Gửi sự kiện lên component cha để cập nhật danh sách
        }
      },
      error: (err) => {
        console.error('Failed to delete Service Contact:', err);
      },
    });
  }

  // Method to cancel action
  onCancel() {
    this.showPopup = false; // Ẩn popup
  }

}
