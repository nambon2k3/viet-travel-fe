import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormatDatePipe } from "../../../../../../shared/pipes/format-date.pipe";
import { TourService } from '../../../services/tour.service';
import { Tour } from '../../../../../../core/models/tour.model';
@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule, CommonModule, FormatDatePipe],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {

  @Input() tour: Tour = <Tour>{};

  authorName: string = 'Loading...';
  tags: string[] = [];

  constructor(private tourService: TourService,
    private router: Router
  ) { }

  openDetail(tour: Tour): void {
    this.router.navigate(['/operator/tour-operation'],  {
      queryParams: { id: tour.id }
    });
  }

  openTourOperation(tour: Tour): void {
    this.router.navigate(['/operator/tour-operation'],  {
      queryParams: { id: tour.id }
    });
  }
}
