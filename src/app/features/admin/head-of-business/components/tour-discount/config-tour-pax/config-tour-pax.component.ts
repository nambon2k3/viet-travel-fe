import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourDiscountService } from '../../../services/discount.service';

interface TourPax {
  id: number;
  tourId: number;
  minPax: number;
  maxPax: number;
  paxRange: string;
  fixedCost: number;
  extraHotelCost: number;
  nettPricePerPax: number;
  sellingPrice: number;
  validFrom: string;
  validTo: string;
  valid: boolean;
}

interface ApiResponse {
  code: number;
  message: string;
  data: TourPax[];
}

@Component({
  selector: 'app-config-tour-pax',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './config-tour-pax.component.html',
  styleUrls: ['./config-tour-pax.component.css']
})
export class ConfigTourPaxComponent {
  @Input() tourId!: number;

  tourPaxList: TourPax[] = [];

  constructor(
    private tourDiscountService: TourDiscountService,
  ) {}

  ngOnInit() {
    console.log('Tour ID:', this.tourId);
    if (this.tourId) {
      this.fetchTourPaxData();
    }
  }

  fetchTourPaxData() {
    this.tourDiscountService.getTourPaxById(this.tourId).subscribe({
      next: (response: ApiResponse) => {
        if (response.code === 200) {
          this.tourPaxList = response.data;
        } else {
          console.error('Error fetching tour pax data:', response.message);
        }
      },
      error: (error) => {
        console.error('HTTP error fetching tour pax data:', error);
      }
    });
  }

  deleteTourPax(id: number) {
    this.tourDiscountService.deleteTourPax(this.tourId, id).subscribe({
      next: (response: ApiResponse) => {
        if (response.code === 200) {
          this.fetchTourPaxData();
        }
        else {
          console.error('Error deleting tour pax:', response.message);
        }
      },
      error: (error : any) => {
        console.error('HTTP error deleting tour pax:', error);
      }
    });
  }
}