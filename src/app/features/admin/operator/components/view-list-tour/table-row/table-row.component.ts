import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormatDatePipe } from "../../../../../../shared/pipes/format-date.pipe";
import { TourSchedule } from '../../../../../../core/models/tour-operator.model';
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
    private router: Router
  ) { }

  openDetail(tour: TourSchedule): void {
    this.router.navigate(['/operator/tour-operation'],  {
      queryParams: { id: tour.scheduleId }
    });
  }

  openTourOperation(tour: TourSchedule): void {
    this.router.navigate(['/operator/tour-operation'],  {
      queryParams: { id: tour.scheduleId }
    });
  }
}
