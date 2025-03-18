import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  constructor(
    private tourService: TourService,
    private router: Router
  ) { }

  deleteTour(): void {
    this.tourService.deleteTour(this.tour.id).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.tour.deleted = true;
          this.tourUpdated.emit(); // Notify parent to reload
        }
      },
      error: (err) => {
        console.error('Failed to hide Tour:', err);
      },
    });
  }

  openDetail(tour: TourHOB): void {
    this.router.navigate(['/head-business/tour-details'], {
      queryParams: {
        id: tour.id,
        authorName: tour.createdUserName, // Pass the createdUserName
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
          this.tour.deleted = false;
          this.tourUpdated.emit();
        }
      },
      error: (err) => {
        console.error('Failed to show Tour:', err);
      },
    });
  }
}