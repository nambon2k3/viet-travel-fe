import { Component, Input } from '@angular/core';
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

  constructor(
    private tourService: TourService,
    private router: Router
  ) { }

  deleteTour(): void {
    this.tourService.deleteTour(this.tour.id).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.tour.deleted = true;
        }
      },
      error: (err) => {
        console.error('Failed to hide Tour:', err);
      },
    });
  }

  openDetail(tour: TourHOB): void {
    this.router.navigate(['/head-business/tour-details'], {
      queryParams: { id: tour.id }
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
        }
      },
      error: (err) => {
        console.error('Failed to show Tour:', err);
      },
    });
  }
}
