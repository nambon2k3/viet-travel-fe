import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../services/request.service';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from "../../../../../shared/components/spinner/spinner.component";
import { CurrencyVndPipe } from "../../../../../shared/pipes/currency-vnd.pipe";
import { FormatDatePipe } from "../../../../../shared/pipes/format-date.pipe";

interface RequestDetail {
  tourBookingServiceId: number;
  tourName: string;
  tourType: string;
  startDate: string;
  endDate: string;
  dayNumber: number | null;
  bookingCode: string;
  status: string;
  reason: string;
  proposer: string;
  updatedAt: string;
  serviceName: string;
  nettPrice: number;
  currentQuantity: number;
  requestQuantity: number;
  totalPrice: number;
}

@Component({
  selector: 'app-view-request-detail',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    CurrencyVndPipe,
    FormatDatePipe
],
  templateUrl: './view-request-detail.component.html',
  styleUrls: ['./view-request-detail.component.css']
})
export class ViewRequestDetailComponent implements OnInit {
  requestDetail: RequestDetail | null = null;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private requestService: RequestService,
    private route : ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tourBookingServiceId = params['id'];
      if (tourBookingServiceId) {
        this.loadRequestDetail(tourBookingServiceId);
      }
    });
  }

  loadRequestDetail(tourBookingServiceId : any): void {
    this.isLoading = true;
    this.requestService.getRequestDetail(tourBookingServiceId).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.requestDetail = response.data;
        } else {
          console.error('Failed to load request detail:', response.message);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching request detail:', err);
        this.isLoading = false;
      }
    });
  }

  onCanceled(): void {
    this.router.navigate(['/operator/view-list-request']);
  }

  onApproved(): void {
    this.requestService.updateRequestStatus(this.requestDetail?.tourBookingServiceId!).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.router.navigate(['/operator/view-list-request']);
        } else {
          console.error('Failed to approve request:', response.message);
        }
      },
      error: (err) => {
        console.error('Error approving request:', err);
      }
    });
  }

  onRejected(): void {
    this.requestService.rejectRequest(this.requestDetail?.tourBookingServiceId!).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.router.navigate(['/operator/view-list-request']);
        } else {
          console.error('Failed to rejectRequest:', response.message);
        }
      },
      error: (err) => {
        console.error('Error rejectRequest:', err);
      }
    });
  }
}