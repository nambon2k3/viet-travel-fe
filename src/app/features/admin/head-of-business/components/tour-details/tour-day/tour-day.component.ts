import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { TourDay } from '../../../../../../core/models/tour.model';
import { UpdateTourDayComponent } from '../update-tour-day/update-tour-day.component';
import { CreateTourDayComponent } from './create-tour-day/create-tour-day.component';

@Component({
  selector: 'app-tour-day',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UpdateTourDayComponent,
    CreateTourDayComponent
  ],
  templateUrl: './tour-day.component.html',
  styleUrls: ['./tour-day.component.css']
})
export class TourDayComponent implements OnInit {
  @ViewChild('editTourDayModal') editTourDayModal!: UpdateTourDayComponent;
  @ViewChild('createTourDayModal') createTourDayModal!: CreateTourDayComponent;

  tourId: string | null = null;
  tourDays: TourDay[] = [];

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService,
  ) { }

  ngOnInit(): void {
    this.tourId = this.route.snapshot.queryParamMap.get('id');
    if (this.tourId) {
      this.getTourDays();
    }
  }

  getTourDays(): void {
    if (this.tourId) {
      this.tourService.getTourDayById(this.tourId).subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            this.tourDays = response.data;
          } else {
            console.error('Failed to get Tour Days: Invalid response code', response.message);
          }
        },
        error: (err: any) => {
          console.error('Failed to get Tour Days:', err);
        },
      });
    }
  }

  onEdit(day: TourDay): void {
    if(this.editTourDayModal) {
      this.editTourDayModal.tourId = this.tourId;
      this.editTourDayModal.day = day;
      this.editTourDayModal.mapDataToForm(day);
      this.editTourDayModal.showModal();
    }
  }

  onCreate(): void {
    this.getTourDays();
  }

  onDelete(id: any): void {
    if (this.tourId) {
      this.tourService.changeTourDayStatus(this.tourId, id, true).subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            console.log('Tour Day deleted successfully:', response.data);
            window.location.reload();
          } else {
            console.error('Failed to delete Tour Day:', response.message);
          }
        },
        error: (err: any) => {
          console.error('Failed to delete Tour Day:', err);
        },
      });
    }
  }
}