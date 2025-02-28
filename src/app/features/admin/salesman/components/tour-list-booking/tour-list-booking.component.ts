import { Component, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CommonModule } from '@angular/common';

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
}
