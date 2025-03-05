import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-open-tour-for-sale',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, FormsModule],
  templateUrl: './open-tour-for-sale.component.html',
  styleUrls: ['./open-tour-for-sale.component.css']
})
export class OpenTourForSaleComponent {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  constructor() {}

  // Initialize tourSaleEvents before using it in calendarOptions
  private tourSaleEvents: EventInput[] = [
    { 
      title: 'Number of Seats: 45, Sold: 0, Waiting: 0', 
      start: '2025-03-08', 
      backgroundColor: '#E6F4EA', 
      borderColor: '#E6F4EA', 
      extendedProps: { seats: 45, sold: 0, waiting: 0 } 
    },
    { 
      title: 'Number of Seats: 45, Sold: 0, Waiting: 0', 
      start: '2025-03-15', 
      backgroundColor: '#E6F4EA', 
      borderColor: '#E6F4EA', 
      extendedProps: { seats: 45, sold: 0, waiting: 0 } 
    },
    { 
      title: 'Number of Seats: 40, Sold: 4, Waiting: 8', 
      start: '2025-03-26', 
      backgroundColor: '#E6F4EA', 
      borderColor: '#E6F4EA', 
      extendedProps: { seats: 40, sold: 4, waiting: 8 } 
    }
  ];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin], // Correctly imported interactionPlugin
    initialDate: '2025-03-15', // Set to March 15, 2025, as shown in the Figma
    initialView: 'dayGridMonth',
    locale: 'en', // Using English for simplicity; change to 'vi' for Vietnamese if needed
    events: this.tourSaleEvents,
    themeSystem: 'bootstrap',
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
    eventContent: (arg) => {
      return {
        html: `
          <div style="background-color: #E6F4EA; border: 1px solid #E6F4EA; padding: 2px; border-radius: 4px; display: flex; flex-direction: column;">
            <span>${arg.event.title}</span>
            <span style="font-size: 0.7em; color: #333;">Number of Seats: ${arg.event.extendedProps['seats'] || 0}</span>
            <span style="font-size: 0.7em; color: #333;">Sold: ${arg.event.extendedProps['sold'] || 0}, Waiting: ${arg.event.extendedProps['waiting'] || 0}</span>
          </div>
        `
      };
    },
    dayMaxEventRows: true, // Limits the number of events per day to prevent overflow
    moreLinkClick: 'popover' // Optional: Shows a popover for additional events
  };

  showCreateModal = false;
  showUpdateModal = false;
  selectedDate: string = '';
  numberOfSeats: number = 45;
  soldSeats: number = 0;
  waitingSeats: number = 0;

  openCreateModal(): void {
    this.showCreateModal = true;
    this.selectedDate = '';
    this.numberOfSeats = 45;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  createTourSaleDay(): void {
    if (this.selectedDate && this.numberOfSeats > 0) {
      const duration = 3; // Assuming a 3-day tour duration (3N2D as per Figma)
      const start = new Date(this.selectedDate);
      const events: EventInput[] = [];

      for (let i = 0; i < duration; i++) {
        const date = new Date(start);
        date.setDate(date.getDate() + i);
        events.push({
          title: `Number of Seats: ${this.numberOfSeats}, Sold: 0, Waiting: 0`,
          start: date.toISOString().split('T')[0],
          backgroundColor: '#E6F4EA',
          borderColor: '#E6F4EA',
          extendedProps: { seats: this.numberOfSeats, sold: 0, waiting: 0 }
        });
      }

      this.tourSaleEvents = [...this.tourSaleEvents, ...events];
      this.calendarOptions.events = this.tourSaleEvents;
      this.closeCreateModal();
    }
  }

  handleEventClick(event: any): void {
    this.selectedDate = event.event.startStr;
    this.numberOfSeats = event.event.extendedProps['seats'] || 45;
    this.soldSeats = event.event.extendedProps['sold'] || 0;
    this.waitingSeats = event.event.extendedProps['waiting'] || 0;
    this.showUpdateModal = true;
  }

  closeUpdateModal(): void {
    this.showUpdateModal = false;
  }

  updateTourSaleDay(): void {
    if (this.selectedDate && this.numberOfSeats >= 0 && this.soldSeats >= 0 && this.waitingSeats >= 0) {
      const updatedEvents = this.tourSaleEvents.map(event => {
        if (event.start === this.selectedDate) {
          return {
            ...event,
            title: `Number of Seats: ${this.numberOfSeats}, Sold: ${this.soldSeats}, Waiting: ${this.waitingSeats}`,
            extendedProps: { seats: this.numberOfSeats, sold: this.soldSeats, waiting: this.waitingSeats }
          };
        }
        return event;
      });
      this.tourSaleEvents = updatedEvents;
      this.calendarOptions.events = this.tourSaleEvents;
      this.closeUpdateModal();
    }
  }
}