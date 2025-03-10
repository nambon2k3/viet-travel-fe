import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FormsModule } from '@angular/forms';
import { CreateOpenTourDayComponent } from './create-open-tour-day/create-open-tour-day.component';
import { UpdateOpenTourDayComponent } from './update-open-tour-day/update-open-tour-day.component';
import e from 'express';

@Component({
  selector: 'app-open-tour-for-sale',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, FormsModule, CreateOpenTourDayComponent, UpdateOpenTourDayComponent],
  templateUrl: './open-tour-for-sale.component.html',
  styleUrls: ['./open-tour-for-sale.component.css']
})
export class OpenTourForSaleComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  @ViewChild('createOpenTourDayModal') createOpenTourDayModal!: CreateOpenTourDayComponent;
  @ViewChild('updateOpenTourDayModal') updateOpenTourDayModal!: UpdateOpenTourDayComponent;

  constructor() { }

  private tourSaleEvents: EventInput[] = [
    {
      title: 'Open',
      start: '2025-03-08',
      end: '2025-03-12',
      backgroundColor: '#db736b',
      borderColor: '#db736b',
      extendedProps: { name: 'Đà Nẵng - Huế - Bà Nà - Hội An', seats: 45, sold: 0, waiting: 0 }
    },
    {
      title: 'Open',
      start: '2025-03-15',
      end: '2025-03-19',
      backgroundColor: '#E6F4EA',
      borderColor: '#E6F4EA',
      extendedProps: { name: 'Đà Nẵng - Huế - Bà Nà - Hội An', seats: 45, sold: 0, waiting: 0 }
    },
    {
      title: 'Open',
      start: '2025-03-16',
      end: '2025-03-20',
      backgroundColor: '#245B7E',
      borderColor: '#245B7E',
      extendedProps: { name: 'Đà Nẵng - Huế - Bà Nà - Hội An', seats: 45, sold: 0, waiting: 0 }
    },
    {
      title: 'Open',
      start: '2025-03-26',
      end: '2025-03-29',
      backgroundColor: '#000',
      borderColor: '#000',
      extendedProps: { name: 'Đà Nẵng - Huế - Bà Nà - Hội An', seats: 40, sold: 4, waiting: 8 }
    }
  ];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialDate: '2025-03-05',
    initialView: 'dayGridMonth',
    locale: 'vi',
    events: this.tourSaleEvents,
    timeZone: 'Asia/Ho_Chi_Minh',
    themeSystem: 'bootstrap',
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };
  
  handleDateClick(arg: any) {
    this.createOpenTourDayModal.openModal(arg.dateStr, this.tourSaleEvents[0]?.extendedProps?.['name'] || '');
  }
  
  handleEventClick(arg: any) {
    this.updateOpenTourDayModal.openModal(arg.event);
  }  
}
