import { Component, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tour-detail',
  imports: [FullCalendarModule, CommonModule],
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.css'
})
export class TourDetailComponent {


  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: 'vi', // Set Vietnamese locale
    events: [
      { title: '18,990K', start: '2025-03-05' },
      { title: '18,990K', start: '2025-03-12' },
      { title: '18,990K', start: '2025-03-19' },
      { title: '18,990K', start: '2025-03-26' }
    ],
    themeSystem: 'bootstrap',
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
  };


  goToMonth(month: number, year: number) {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(`${year}-${month.toString().padStart(2, '0')}-01`);
  }
  


  isShow = false;

  showOrHide() {
    this.isShow = !this.isShow;
  }

}
