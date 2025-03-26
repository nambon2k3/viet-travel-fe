import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourDiscountService } from '../../../../services/discount.service';
import { FormsModule } from '@angular/forms';

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
  data: TourPax;
}

@Component({
  selector: 'app-update-tour-pax',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-tour-pax.component.html',
  styleUrls: ['./update-tour-pax.component.css']
})
export class UpdateTourPaxComponent {
  @Input() tourPax!: TourPax;
  @Output() confirmUpdate = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  updatedPax: TourPax = { ...this.tourPax };

  constructor(private tourDiscountService: TourDiscountService) {}

  ngOnChanges() {
    this.updatedPax = { ...this.tourPax };
  }

  updateTourPax() {
    const updatedTourPax: TourPax = {
      ...this.updatedPax,
      paxRange: `${this.updatedPax.minPax.toString().padStart(2, '0')}-${this.updatedPax.maxPax.toString().padStart(2, '0')}`
    };

    this.tourDiscountService.updateTourPax(updatedTourPax.id, updatedTourPax).subscribe({
      next: (response: ApiResponse) => {
        if (response.code === 200) {
          this.confirmUpdate.emit();
        } else {
          console.error('Error updating tour pax:', response.message);
        }
      },
      error: (error : any) => {
        console.error('HTTP error updating tour pax:', error);
      }
    });
  }

  onCancel() {
    this.cancel.emit();
  }
}