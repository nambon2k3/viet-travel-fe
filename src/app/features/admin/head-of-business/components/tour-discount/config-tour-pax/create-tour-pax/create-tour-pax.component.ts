import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourDiscountService } from '../../../../services/discount.service';
import { FormsModule } from '@angular/forms';

interface TourPax {
  minPax: number;
  maxPax: number;
  fixedCost: number;
  extraHotelCost: number;
  nettPricePerPax: number;
  sellingPrice: number;
  validFrom: string;
  validTo: string;
}

@Component({
  selector: 'app-create-tour-pax',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-tour-pax.component.html',
  styleUrls: ['./create-tour-pax.component.css']
})
export class CreateTourPaxComponent {
  @Input() tourId!: number;
  @Output() confirmCreate = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  newPax: TourPax = {
    minPax: 0,
    maxPax: 0,
    fixedCost: 0,
    extraHotelCost: 0,
    nettPricePerPax: 0,
    sellingPrice: 0,
    validFrom: new Date().toISOString(), // Default to current date
    validTo: new Date().toISOString()   // Default to current date
  };

  constructor(private tourDiscountService: TourDiscountService) {}

  createTourPax() {
    const tourPaxData: TourPax = {
      minPax: this.newPax.minPax,
      maxPax: this.newPax.maxPax,
      fixedCost: this.newPax.fixedCost,
      extraHotelCost: this.newPax.extraHotelCost,
      nettPricePerPax: this.newPax.nettPricePerPax,
      sellingPrice: this.newPax.sellingPrice,
      validFrom: this.newPax.validFrom,
      validTo: this.newPax.validTo
    };

    this.tourDiscountService.createTourPax(this.tourId, tourPaxData).subscribe({
      next: (response: any) => {
        if (response.code === 201) {
          this.confirmCreate.emit();
        } else {
          console.error('Error creating tour pax:', response.message);
        }
      },
      error: (error) => {
        console.error('HTTP error creating tour pax:', error);
      }
    });
  }
}