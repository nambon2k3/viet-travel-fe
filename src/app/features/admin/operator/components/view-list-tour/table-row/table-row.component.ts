import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormatDatePipe } from "../../../../../../shared/pipes/format-date.pipe";
import { TourSchedule } from '../../../../../../core/models/tour-operator.model';
import { TourService } from '../../../services/tour.service';

@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule, CommonModule, FormatDatePipe],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {

  @Input() tour: TourSchedule = <TourSchedule>{};

  authorName: string = 'Loading...';
  tags: string[] = [];

  constructor(
    private router: Router,
    private tourService: TourService
  ) { }

  openDetail(tour: TourSchedule): void {
    this.router.navigate(['/operator/tour-operation'],  {
      queryParams: { id: tour.scheduleId }
    });
  }

  operateTour(tourId: number | null) {
    this.tourService.operateTour(tourId).subscribe({
      next: (response) => {
        this.router.navigate(['/operator/tour-operation'], { queryParams: { id: tourId } });
      },
      error: (error) => {
        console.error('Failed to operate tour:', error);
      }
    });
  }
}
