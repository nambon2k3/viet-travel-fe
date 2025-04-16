import { Component } from '@angular/core';
import { TourService } from '../../../services/tour.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TourStatusDisplay } from '../../../../../../core/models/tour-request.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-request-detail',
  imports: [
    CommonModule
  ],
  templateUrl: './request-detail.component.html',
  styleUrl: './request-detail.component.css'
})
export class RequestDetailComponent {
  tourDetail: any | null = null;
  showPopup: boolean = false; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tourService: TourService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.loadTourDetail(+id);
    } else {
      console.error('No tour ID provided');
      this.router.navigate(['/ceo/tour-request']);
    }
  }

  loadTourDetail(tourId: number): void {
    this.tourService.getTourBookingDetail(tourId).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.tourDetail = response.data;
        } else {
          console.error('Failed to load tour detail:', response.message);
          this.router.navigate(['/head-business/tour-request']);
        }
      },
      error: (err) => {
        console.error('Error loading tour detail:', err);
        this.router.navigate(['/head-business/tour-request']);
      },
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    const words = name.split(' ');
    return words
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getStatusDisplay(status: string): string {
    return TourStatusDisplay[status as keyof typeof TourStatusDisplay] || status;
  }

  onCancel(): void {
    this.router.navigate(['//head-business/tour-request']);
  }

  onApprove(): void {
    if (this.tourDetail) {
      this.tourService.approveRequest(this.tourDetail.id).subscribe({
        next: (response) => {
          if (response.code === 200) {
            console.log('Request approved successfully');
            this.router.navigate(['/head-business/tour-request']);
          } else {
            console.error('Failed to approve tour:', response.message);
          }
        },
        error: (err) => {
          console.error('Error approving tour:', err);
        },
      });
    }
  }

  onReject(): void {
    if (this.tourDetail) {
      this.tourService.rejectRequest(this.tourDetail.id).subscribe({
        next: (response) => {
          if (response.code === 200) {
            console.log('Request rejected successfully');
            this.router.navigate(['/head-business/tour-request']);
          } else {
            console.error('Failed to reject tour:', response.message);
          }
        },
        error: (err) => {
          console.error('Error rejecting tour:', err);
        },
      });
    }
  }
}
