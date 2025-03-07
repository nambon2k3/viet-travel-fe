import { Component } from '@angular/core';
import { UserStorageService } from '../../../../../core/services/user-storage/user-storage.service';
import { BookingInfoService } from '../../../services/booking-infor.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tour-booking-confirm',
  imports: [CommonModule],
  templateUrl: './tour-booking-confirm.component.html',
  styleUrl: './tour-booking-confirm.component.css'
})
export class TourBookingConfirmComponent {
  isLoading: boolean = true;
  bookingData?: any;


  numberAdults: number = 1;
  numberChildren: number = 0;

  childrenPrice: number = 0;

  numberSingleRooms: number = 1;

  constructor(
    private bookingInforService: BookingInfoService,
    private router: Router
  ) { }


  ngOnInit(): void {
    const bookingCode = this.router.url.split('/').pop();

    console.log(bookingCode)

    if(bookingCode) {
      this.getBookingDetailByBookingCode(bookingCode);
    }

  }


  getBookingDetailByBookingCode(bookingCode: string) {
    this.bookingInforService.getBookingDetails(bookingCode).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.bookingData = response.data
        this.setExpiredDate();
        console.log(response)
      },
    })
  }

  total: number = 0;


  calculateTotal() {
    const adultsArray = this.bookingData.adults;
    const childrenArray = this.bookingData.children;

    const adultPrice = this.bookingData.tourSchedule.sellingPrice;
    const childrenPrice = adultPrice * 0.75;

    const adultTotal = adultsArray.controls.length * adultPrice!;
    const childrenTotal = childrenArray.controls.length * childrenPrice;

    const extra = this.numberSingleRooms * this.bookingData.tourSchedule.extraHotelCost!;

    this.total = adultTotal + childrenTotal + extra;


    //this.bookingForm.patchValue({ total: this.total }, { emitEvent: false });
  }


  expiredDate?:Date;

  setExpiredDate(): void {
    let date = new Date(this.bookingData.createdAt);
    date.setHours(date.getHours() + 2);
    this.expiredDate = date;
    console.log(this.expiredDate)
  }


  range(end: number): number[] {
    return Array.from({ length: end - 0 }, (_, i) => 0 + i);
  }


}
