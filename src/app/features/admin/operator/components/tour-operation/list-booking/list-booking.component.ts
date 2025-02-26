import { Component } from '@angular/core';
import { CurrencyVndPipe } from "../../../../../../shared/pipes/currency-vnd.pipe";
import { CommonModule } from '@angular/common';

interface Booking {
  id: number;
  customer: string;
  slot: { total: number; adult: number; child: number };
  from: string;
  payment: { total: number; received: number; remain: number; guideCollect: number };
  createDate: string;
  status: string;
  salesman?: string;
}

@Component({
  selector: 'app-list-booking',
  imports: [
    CurrencyVndPipe, 
    CommonModule
  ],
  templateUrl: './list-booking.component.html',
  styleUrl: './list-booking.component.css'
})
export class ListBookingComponent {
  bookings: Booking[] = [
    {
      id: 1,
      customer: 'Lan Than',
      slot: { total: 9, adult: 7, child: 2 },
      from: 'Sale',
      payment: { total: 5000000, received: 2000000, remain: 3000000, guideCollect: 3000000 },
      createDate: '20/03/2025',
      status: 'Completed',
      salesman: 'Như Hoa',
    },
    {
      id: 2,
      customer: 'Con Vit 1',
      slot: { total: 9, adult: 7, child: 2 },
      from: 'Online',
      payment: { total: 5000000, received: 2000000, remain: 3000000, guideCollect: 3000000 },
      createDate: '20/03/2025',
      status: 'Completed',
    },
  ];

  editBooking(booking: Booking) {
    console.log('Edit booking:', booking);
    // Add logic to edit booking
  }

  deleteBooking(id: number) {
    this.bookings = this.bookings.filter((booking) => booking.id !== id);
  }
}
