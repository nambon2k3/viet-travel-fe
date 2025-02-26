import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tour-detail',
  imports: [FullCalendarModule, CommonModule],
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.css'
})
export class TourDetailComponent {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: 'vi', // Set Vietnamese locale
    events: [
      { title: '18,990K', start: '2025-03-05', color: 'red' },
      { title: '18,990K', start: '2025-03-12', color: 'red' },
      { title: '18,990K', start: '2025-03-19', color: 'red' },
      { title: '18,990K', start: '2025-03-26', color: 'red' }
    ],
    headerToolbar: false // ✅ Remove this line if it causes issues
  };


  isShow = false;

  showOrHide() {
    this.isShow = !this.isShow;
  }

}
