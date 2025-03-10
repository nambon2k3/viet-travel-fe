import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../core/services/ssr.service';

@Component({
  selector: 'app-create-open-tour-day',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-open-tour-day.component.html',
  styleUrls: ['./create-open-tour-day.component.css']
})
export class CreateOpenTourDayComponent {
  @Input() selectedDate: string = ''; // Ngày được chọn từ FullCalendar
  private modalInstance!: Modal;

  numberOfSeats: number = 0;
  name: string = '';

  constructor(
    private ssrService: SsrService,
  ) { }

  ngAfterViewInit() {
    const document = this.ssrService.getDocument();
    if (document) {
      const modalEl = document.getElementById('createOpenTourDayModal');

      if (modalEl) {
        this.modalInstance = new Modal(modalEl);
      }
    }
  }

  openModal(date: string, name: string) {
    this.selectedDate = date;
    this.name = name;
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  close() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  createTourSaleDay() {
    this.modalInstance.hide();
  }
}
