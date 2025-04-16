import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Tour } from '../../../../../../core/models/homepage.model';
import { TourStatusDisplay } from '../../../../../../core/models/tour-request.model';
import { TourRequestService } from '../../../../ceo/services/tour-request.service';

@Component({
  selector: '[app-table-row]',
  imports: [CommonModule],
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.css'],
  standalone: true,
})
export class TableRowComponent {
  @Input() tour: Tour = <Tour>{};

  constructor(
    private router: Router,
  ) {}

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  getStatusDisplay(status: string): string {
    return TourStatusDisplay[status as keyof typeof TourStatusDisplay] || status;
  }

  openDetail(): void {
    if (this.tour.id !== undefined) {
      this.router.navigate(['/ceo/tour-request-detail'], {
        queryParams: { id: this.tour.id },
      });
    } else {
      console.error('Tour ID is undefined');
    }
  }
}