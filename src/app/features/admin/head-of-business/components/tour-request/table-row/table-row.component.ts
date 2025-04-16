import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStorageService } from '../../../../../../core/services/user-storage/user-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: '[app-table-row]',
  imports: [CommonModule],
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.css'],
  standalone: true,
})
export class TableRowComponent {
  @Input() tourBookingDetail: any = <any>{};
  @Input() index: any = <any>{};
  @Output() bookingTaken = new EventEmitter<number>();

  ngOnInit(): void {
    console.log(this.tourBookingDetail)
  }

  userId: number = 0;

  constructor(
    private userStorageService: UserStorageService,
    private router : Router,

  ) {
    this.userId = this.userStorageService.getUserId()!;
  }

  showError: boolean = false;

  openDetail(bookingId: number): void {
    if (bookingId) {
      this.router.navigate(['/head-business/tour-request-detail'], {
        queryParams: { id: bookingId },
      });
    } else {
      console.error('Tour booking không tồn tại');
    }
  }

  triggerError() {
    this.showError = true;


    // Hide warning after 3 seconds
    setTimeout(() => {
      this.showError = false;
    }, 4000);
  }
}