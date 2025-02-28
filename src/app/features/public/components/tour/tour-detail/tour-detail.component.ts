import { Component, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TourDetail, TourSchedule } from '../../../../../core/models/tour-detail.model';
import { TourDetailService } from '../../../services/tour-detail.service';
import { ActivatedRoute } from '@angular/router';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-tour-detail',
  imports: [FullCalendarModule, CommonModule],
  templateUrl: './tour-detail.component.html',
  styleUrl: './tour-detail.component.css',
  providers: [DatePipe]
})
export class TourDetailComponent {

  tourDetails: TourDetail | undefined;

  isLoading = true;


  events: { scheduleId: number; title: string; start: string; }[] | undefined = [];


  uniqueMonths = new Set<string>();


  selectedSchedule: TourSchedule | undefined;


  minPrice: number | undefined;

  constructor(
    private tourDetailService: TourDetailService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) { }


  ngOnInit(): void {
    const tourId = 1
    if (tourId) {
      this.tourDetailService.getTourDetails(tourId).subscribe({
        next: (response) => {
          this.tourDetails = response.data;
          this.tourDetails?.tourDays.sort((a: any, b: any) => a.id - b.id);
          this.isLoading = false;


          this.events = this.tourDetails?.tourSchedules.map(schedule => ({
            scheduleId: schedule.scheduleId,
            title: `${schedule.sellingPrice}K`, // Show price in title
            start: schedule.startDate.split("T")[0] // Extract only YYYY-MM-DD
          }));

          console.log(this.tourDetails?.tourSchedules)

          if (this.tourDetails?.tourSchedules.length) {
            this.minPrice = Math.min(
              ...this.tourDetails.tourSchedules.map(schedule => schedule.sellingPrice)
            );
          }

         // this.selectedSchedule = this.tourDetails?.tourSchedules[0];

          const initialDate = this.events?.length ? this.events[0].start : new Date().toISOString().split("T")[0];

          this.calendarOptions = {
            ...this.calendarOptions,
            events: [...this.events!],
            initialDate: initialDate
          };




          this.tourDetails?.tourSchedules.forEach(schedule => {
            const formattedDate = this.datePipe.transform(schedule.startDate, 'MM/yyyy');
            if (formattedDate) {
              this.uniqueMonths.add(formattedDate);
            }
          });

          console.log(this.events)

        },
        error: (err) => {
          console.error('Failed to load blog:', err);
        }
      });
    } else {
      console.error('Invalid blog id');
    }
  }


  scrollToSchedule(sectionId: string) {
    const element = document.getElementById(sectionId);
    console.log(element)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  resetSchedule() {
    this.selectedSchedule = undefined;
    this.scrollToSchedule('schedule2');
  }


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

    console.log(eventOnDate)

    if (eventOnDate) {
      this.selectedSchedule = this.tourDetails?.tourSchedules.find(schedule => schedule.scheduleId === eventOnDate.scheduleId);
    } 
  }


  goToMonth(month: string, year: string) {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.gotoDate(`${year}-${month.padStart(2, '0')}-01`);
  }



  isShow = false;

  showOrHide() {
    this.isShow = !this.isShow;
  }

}
