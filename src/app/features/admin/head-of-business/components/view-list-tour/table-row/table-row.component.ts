import { Component, Input, Output, EventEmitter, NgModule, ElementRef, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Router } from '@angular/router';
import { TourHOB } from '../../../../../../core/models/tour.model';
import { TourService } from '../../../services/tour.service';

@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {
  @Input() tour: TourHOB = <TourHOB>{};
  @Output() tourUpdated = new EventEmitter<void>();
  isDropdownOpen = false;

  constructor(
    private tourService: TourService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }


  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (this.isDropdownOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  deleteTour(): void {
    this.tourService.deleteTour(this.tour.id).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.tourUpdated.emit(); // Notify parent to reload
        }
      },
      error: (err) => {
        console.error('Failed to hide Tour:', err);
      },
    });
  }

  openDiscount(tour: TourHOB): void {
    this.router.navigate(['/head-business/tour-discount'], {
      queryParams: { id: tour.id },
    });
  }

  openDetail(tour: TourHOB): void {
    this.router.navigate(['/head-business/tour-details'], {
      queryParams: {
        id: tour.id,
      },
    });
  }

  openSaleTour(tour: TourHOB): void {
    this.router.navigate(['/head-business/open-sale-tour'], {
      queryParams: { id: tour.id }
    });
  }

  recoverTour(): void {
    this.tourService.recoverTour(this.tour.id).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.tourUpdated.emit();
        }
      },
      error: (err) => {
        console.error('Failed to show Tour:', err);
      },
    });
  }

  getVietnameseStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      OPENED: 'Đang mở bán',
      CLOSED: 'Đã đóng',
      DRAFT: 'Bản nháp',
      PENDING_PRICING: 'Chờ chiết tính',
      APPROVED: 'Đã duyệt',
      REJECTED: 'Bị từ chối',
      PENDING: 'Chờ duyệt',
    };
    return statusMap[status] || 'Chưa cập nhật';
  }
  
}