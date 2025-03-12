import { Component } from '@angular/core';
import { CurrencyVndPipe } from "../../../../../../shared/pipes/currency-vnd.pipe";
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../../services/tour.service';

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
  listBookings: any[] = [];
  
    constructor(private route: ActivatedRoute, private tourService: TourService) { }
  
    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        const id = params['id'];
        if (id) {
          this.loadBookings(id);
        }
      });
    }
  
    loadBookings(id: number): void {
      this.tourService.getTourBookings(id).subscribe({
        next: (response : any) => {
          if (response.code === 200) {
            this.listBookings = response.data;
          } else {
            console.error('Lỗi:', response.message);
          }
        },
        error: (error : any) => {
          console.error('Lỗi khi tải danh sách khách hàng:', error);
        }
      });
    }

  editBooking(booking: any) {
    console.log('Edit booking:', booking);
  }

  deleteBooking(id: number) {
    console.log('Delete booking:', id);
  }
}
