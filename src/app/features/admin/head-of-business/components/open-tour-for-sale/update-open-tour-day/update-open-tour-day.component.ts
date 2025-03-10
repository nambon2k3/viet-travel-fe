import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core/index.js';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../core/services/ssr.service';

@Component({
  selector: 'app-update-open-tour-day',
  standalone: true,
  imports: [FullCalendarModule, CommonModule, FormsModule],
  templateUrl: './update-open-tour-day.component.html',
  styleUrl: './update-open-tour-day.component.css'
})
export class UpdateOpenTourDayComponent {
  @Input() selectedEvent!: EventInput;
  private modalInstance!: Modal;

  selectedDate: string = '';
  numberOfSeats: number = 0;
  soldSeats: number = 0;
  waitingSeats: number = 0;
  name: string = '';

  constructor(private router: Router,
    private ssrService: SsrService,
  ) { }

  ngAfterViewInit() {
    const document = this.ssrService.getDocument();
    if (document) {
      const modalEl = document.getElementById('updateOpenTourDayModal');
      if (modalEl) {
        this.modalInstance = new Modal(modalEl);
      }
    }
  }

  openModal(event: EventInput) {
    this.selectedEvent = event;
    this.selectedDate = new Date(event.start as string).toISOString().split('T')[0];

    this.name = event.extendedProps?.['name'] || '';
    this.numberOfSeats = event.extendedProps?.['seats'] || 0;
    this.soldSeats = event.extendedProps?.['sold'] || 0;
    this.waitingSeats = event.extendedProps?.['waiting'] || 0;

    const modalEl = this.ssrService.getDocument()?.getElementById('updateOpenTourDayModal');
    if (modalEl) {
      modalEl.removeAttribute('inert'); // Cho phép modal nhận focus
    }

    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  close() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }

    setTimeout(() => {
      const modalEl = this.ssrService.getDocument()?.getElementById('updateOpenTourDayModal');
      if (modalEl) {
        modalEl.removeAttribute('aria-hidden');
        modalEl.setAttribute('inert', '');
      }
    }, 500);
  }

  updateTourSaleDay() {
    console.log('Updated event:', {
      date: this.selectedDate,
      seats: this.numberOfSeats,
      sold: this.soldSeats,
      waiting: this.waitingSeats
    });
    this.modalInstance.hide();
  }

  deleteDay() {
    console.log('Deleted event:', this.selectedEvent);
    this.modalInstance.hide();
  }

  viewListBooking() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.router.navigate(['/head-business/tour-list-booking']);
  }
}
