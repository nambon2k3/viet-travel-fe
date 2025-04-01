import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../core/services/ssr.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { TourService } from '../../../services/tour.service';

@Component({
  selector: 'app-create-open-tour-day',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule
  ],
  templateUrl: './create-open-tour-day.component.html',
  styleUrls: ['./create-open-tour-day.component.css']
})
export class CreateOpenTourDayComponent {
  @Input() selectedDate: string = '';
  @Input() tourId: string | null = null;
  @Input() tourName: string = '';

  @Output() daySetted: EventEmitter<any> = new EventEmitter<any>();

  private modalInstance!: Modal;
  dropdownList: any[] = [];
  dropdownPaxList: any[] = [];

  calculatedEndDate: string | null = null;
  calculatedEndDates: string[] = [];
  startDates: string[] = [];
  operatorId: string = '';
  paxId: string = ''; 
  addByMonth: boolean = false;

  constructor(
    private ssrService: SsrService,
    private tourService: TourService
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

  getEndDate() {
    if (this.tourId && this.selectedDate) {
      const formattedDate = `${this.selectedDate}T00:00:00`;
      this.tourService.calculateEndDates(this.tourId, formattedDate).subscribe({
        next: (response) => {
          this.calculatedEndDate = response.data[0].endDate;
          if (this.calculatedEndDate) {
            this.getAvailableOperators();
          }
        },
        error: (error) => {
          console.error('Error calculating end dates:', error);
          this.calculatedEndDate = '';
        }
      });
    }
  }

  getAvailableOperators() {
    if (this.tourId && this.selectedDate && this.calculatedEndDate) {
      const formattedDate = `${this.selectedDate}T00:00:00`;
      this.tourService.getAvailableOperators(this.tourId, formattedDate, this.calculatedEndDate).subscribe({
        next: (response) => {
          this.dropdownList = response.data || [];
        },
        error: (error) => {
          console.error('Error fetching available operators:', error);
          this.dropdownList = [];
        }
      });
    }
  }

  getTourPax() {
    if (this.tourId) {
      this.tourService.getTourPax(this.tourId).subscribe({
        next: (response) => {
          this.dropdownPaxList = response.data || [];
        },
        error: (error) => {
          console.error('Error fetching tour pax:', error);
          this.dropdownPaxList = [];
        }
      });
    }
  }

  openModal(date: string, tourName: string) {
    this.selectedDate = date;
    this.tourName = tourName;
    this.getEndDate();
    this.getTourPax();
    if (this.modalInstance) {
      this.modalInstance.show();
    }
  }

  onSelectedDateChange(newDate: string) {
    this.selectedDate = newDate;

    if (this.addByMonth) {
      this.generateMonthSchedules();
    } else {
      this.getEndDate();
    }
  }

  async generateMonthSchedules() {
    if (!this.selectedDate) return;

    const startDate = new Date(this.selectedDate);
    const month = startDate.getMonth();
    const year = startDate.getFullYear();
    const dayOfWeek = startDate.getDay();
    const startDay = startDate.getDate();

    let dateList: string[] = [];

    for (let i = startDay; i <= 31; i++) {
      let tempDate = new Date(year, month, i);
      if (tempDate.getMonth() !== month) break;

      if (tempDate.getDay() === dayOfWeek) {
        dateList.push(tempDate.toISOString().split('T')[0]);
      }
    }

    this.startDates = dateList;
    this.calculatedEndDates = [];

    try {
      const endDates = await Promise.all(
        dateList.map(date =>
          this.tourService.calculateEndDates(this.tourId!, `${date}T00:00:00`).toPromise()
        )
      );

      this.calculatedEndDates = endDates.map(response => response.data[0].endDate);
    } catch (error) {
      console.error('Error calculating end dates:', error);
    }
  }

  onCheckboxChange() {
    if (this.addByMonth) {
      this.generateMonthSchedules();
    } else {
      this.getEndDate();
    }
  }

  close() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }



  createTourSaleDay() {
    if (!this.tourId || !this.operatorId || !this.paxId) {
      console.error("Missing required fields!");
      return;
    }

    if (this.addByMonth) {
      // Kiểm tra xem startDates và calculatedEndDates có cùng số lượng phần tử không
      if (this.startDates.length !== this.calculatedEndDates.length) {
        console.error("Mismatch between startDates and endDates!");
        return;
      }

      this.startDates.forEach((startDate, index) => {
        const endDate = this.calculatedEndDates[index];

        const requestBody = {
          tourId: this.tourId,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          operatorId: this.operatorId,
          tourPaxId: this.paxId
        };

        console.log("Request Body:", requestBody);

        this.tourService.createTourSchedule(requestBody).subscribe({
          next: (response) => {
            this.daySetted.emit(response.data);
            console.log("Successfully created tour schedule:", response);
          },
          error: (error) => {
            console.error("Error creating tour schedule:", error);
          }
        });
      });
    } else {
      const requestBody = {
        tourId: this.tourId,
        startDate: new Date(this.selectedDate).toISOString(),
        endDate: this.calculatedEndDate ? new Date(this.calculatedEndDate).toISOString() : null,
        operatorId: this.operatorId,
        tourPaxId: this.paxId
      };

      this.tourService.createTourSchedule(requestBody).subscribe({
        next: (response) => {
          this.daySetted.emit(response.data);
          console.log("Successfully created tour schedule:", response);
        },
        error: (error) => {
          console.error("Error creating tour schedule:", error);
        }
      });
    }

    this.modalInstance.hide();
  }
}