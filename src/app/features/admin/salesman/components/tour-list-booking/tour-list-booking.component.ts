import { Component, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TourDetailService } from '../../../../public/services/tour-detail.service';

@Component({
  selector: 'app-tour-list-booking',
  imports: [FullCalendarModule, CommonModule],
  templateUrl: './tour-list-booking.component.html',
  styleUrl: './tour-list-booking.component.css'
})
export class TourListBookingComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialDate: '2025-03-05',
    initialView: 'dayGridMonth',
    locale: 'vi', // Set Vietnamese locale
    events: [
      { title: 'On', start: '2025-03-05' },
      { title: 'ON', start: '2025-03-12' },
      { title: 'On', start: '2025-03-19' },
      { title: 'On', start: '2025-03-26' }
    ],
    themeSystem: 'bootstrap',
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
  };


  tourId?: number;
  tourDetails: any;

  events: { scheduleId: number; title: string; start: string; }[] | undefined = [];

  constructor(
    private router: Router,
  private tourDetailService: TourDetailService,
) {
  }


  ngOnInit(): void {
    const tourId = Number(this.router.url.split('/').pop());

    if (tourId) {
      this.getTourDetails(tourId);
    }
  }

  getTourDetails(tourId: number) {
    this.tourDetailService.getTourDetails(tourId).subscribe({
      next: (response) => {
        this.tourDetails = response.data;

        this.tourDetails?.tourDays.sort((a: any, b: any) => a.id - b.id);



        this.events = this.tourDetails?.tourSchedules.map((schedule: { scheduleId: any; sellingPrice: any; startDate: string; }) => ({
          scheduleId: schedule.scheduleId,
          title: `${schedule.sellingPrice}K`, // Show price in title
          start: schedule.startDate.split("T")[0] // Extract only YYYY-MM-DD
        }));

        // this.selectedSchedule = this.tourDetails?.tourSchedules[0];

        const initialDate = this.events?.length ? this.events[0].start : new Date().toISOString().split("T")[0];

        this.calendarOptions = {
          ...this.calendarOptions,
          events: [...this.events!],
          initialDate: initialDate
        };

      },
      error: (err) => {
        console.error('Failed to load blog:', err);
      }
    });
  }


}
