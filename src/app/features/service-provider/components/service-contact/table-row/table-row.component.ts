import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ServiceContact } from '../../../../../core/models/service-contact.model';
import { ServiceContactService } from '../../../services/service-contact.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule, DatePipe],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {
  @Input() serviceContact: ServiceContact = <ServiceContact>{};

  authorName: string = 'Loading...';
  tags: string[] = [];

  constructor(private serviceContactService: ServiceContactService) {}


  hideServiceContact(): void {
  //   this.serviceContactService.updateBlogStatus(this.blog.id, true).subscribe({
  //     next: (response) => {
  //       if(response.code === 200) {
  //         this.blog.deleted = true;
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Failed to hide blog:', err);
  //     },
  //   });
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

}
