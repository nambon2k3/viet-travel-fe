import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { TourDay } from '../../../../../../core/models/tour.model';
import { UpdateTourDayComponent } from '../update-tour-day/update-tour-day.component';
import { CreateTourDayComponent } from './create-tour-day/create-tour-day.component';
import { SpinnerComponent } from "../../../../../../shared/components/spinner/spinner.component";

@Component({
  selector: 'app-tour-day',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UpdateTourDayComponent,
    CreateTourDayComponent,
    SpinnerComponent
],
  templateUrl: './tour-day.component.html',
  styleUrls: ['./tour-day.component.css']
})
export class TourDayComponent implements OnInit {
  @ViewChild('editTourDayModal') editTourDayModal!: UpdateTourDayComponent;
  @ViewChild('createTourDayModal') createTourDayModal!: CreateTourDayComponent;

  tourId: string | null = null;
  tourDays: TourDay[] = [];
  isLoading: boolean = false;

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
    this.isLoading = true;
    if (this.tourId) {
      this.tourService.getTourDayById(this.tourId).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.code === 200) {
            this.tourDays = response.data;
          } else {
            console.error('Lỗi: ', response.message);
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          console.error('Lỗi: ', err);
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
    this.isLoading = true;
    if (this.tourId) {
      this.tourService.changeTourDayStatus(this.tourId, id, true).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          if (response.code === 200) {
            window.location.reload();
          } else {
            console.error('Lỗi: ', response.message);
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          console.error('Lỗi: ', err);
        },
      });
    }
  }
}