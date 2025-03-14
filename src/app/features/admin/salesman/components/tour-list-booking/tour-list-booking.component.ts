import { Component, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TourDetailService } from '../../../../public/services/tour-detail.service';
import interactionPlugin from '@fullcalendar/interaction';
import { BookingService } from '../../services/booking.service';
import { TourService } from '../../services/tour.service';

@Component({
  selector: 'app-tour-list-booking',
  imports: [FullCalendarModule, CommonModule, RouterModule],
  templateUrl: './tour-list-booking.component.html',
  styleUrl: './tour-list-booking.component.css'
})
export class TourListBookingComponent {

  events: { scheduleId: number; title: string; start: string; }[] | undefined = [];

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: 'vi', // Set Vietnamese locale
    events: this.events,
    themeSystem: 'bootstrap',
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
    dateClick: (arg) => this.handleDateClick(arg),
  };


  handleDateClick(arg: any) {
    // Check if the clicked date has an event
    const eventOnDate = this.events?.find(event => event.start === arg.dateStr);

    if (eventOnDate) {
      const selectedScheduleId = eventOnDate.scheduleId;

      console.log(selectedScheduleId)

      this.getTourDetails(this.tourId!, selectedScheduleId);
    }
  }


  tourId?: number;
  tourDetails: any;

  bookedPerson: any;


  selectedSchedule: any;
  isLoading: boolean = true;

  constructor(
    private router: Router,
  private bookingService: BookingService,
  private tourService: TourService
) {
  }


  ngOnInit(): void {
    const tourId = Number(this.router.url.split('/').pop());

    if (tourId) {
      this.tourId = tourId;
      this.getTourDetails(tourId);
    }
  }

  getTourDetails(tourId: number, scheduleId?: number) {
    this.tourService.getListBooking(tourId, scheduleId).subscribe({
      next: (response) => {
        this.tourDetails = response.data;

        console.log(this.tourDetails);

        
        if(!scheduleId) {
          this.selectedSchedule = this.tourDetails?.tour.tourSchedules.at(0);
        } else {
          this.selectedSchedule = this.tourDetails?.tour.tourSchedules.find((schedule:any) => schedule.id === scheduleId);
        }


        console.log(this.selectedSchedule)


        this.events = this.tourDetails?.tour.tourSchedules.map((schedule: any) => ({
          scheduleId: schedule.id,
          title: `Vận Hành`, // Show price in title
          start: schedule.startDate.split("T")[0] // Extract only YYYY-MM-DD
        }));

        // this.selectedSchedule = this.tourDetails?.tourSchedules[0];

        const initialDate = this.events?.length ? this.events[0].start : new Date().toISOString().split("T")[0];

        this.calendarOptions = {
          ...this.calendarOptions,
          events: [...this.events!],
          initialDate: initialDate
        };

        this.isLoading = false;

      },
      error: (err) => {
        console.error('Failed to load blog:', err);
      }
    });
  }


  loadCalendar:boolean = false;

  isLoadCalendar() {
    this.loadCalendar = true;
  }


}
