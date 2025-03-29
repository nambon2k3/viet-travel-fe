import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { TruncatePipe } from "../../../../../../shared/pipes/truncate.pipe";
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
  @ViewChild('updateTourDayModal') updateTourDayModal!: UpdateTourDayComponent;
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
}