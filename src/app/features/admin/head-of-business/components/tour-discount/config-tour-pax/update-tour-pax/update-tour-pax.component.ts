import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TourDiscountService } from '../../../../services/discount.service';

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
  selector: 'app-update-tour-pax',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-tour-pax.component.html',
  styleUrls: ['./update-tour-pax.component.css']
})
export class UpdateTourPaxComponent {
  @Input() tourId!: number;
  @Input() tourPaxId!: number;
  @Output() confirmUpdate = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>(); // New event for canceling

  tourPax: TourPax = {
    minPax: 0,
    maxPax: 0,
    fixedCost: 0,
    extraHotelCost: 0,
    nettPricePerPax: 0,
    sellingPrice: 0,
    validFrom: new Date().toISOString().split('T')[0],
    validTo: new Date().toISOString().split('T')[0]
  };

  constructor(private tourDiscountService: TourDiscountService) {}

  ngOnInit() {
    this.fetchTourPaxData();
  }

  fetchTourPaxData() {
    this.tourDiscountService.getTourPaxDetailById(this.tourId, this.tourPaxId).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.tourPax = response.data;
          this.tourPax.validFrom = new Date(this.tourPax.validFrom).toISOString().split('T')[0];
          this.tourPax.validTo = new Date(this.tourPax.validTo).toISOString().split('T')[0];
        }
      },
      error: (error: any) => {
        console.error('Error fetching tour pax data:', error);
      }
    });
  }

  updateTourPax() {
    this.tourDiscountService.updateTourPax(this.tourId, this.tourPaxId, this.tourPax).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.confirmUpdate.emit();
        }
      },
      error: (error: any) => {
        console.error('Error updating tour pax:', error);
      }
    });
  }

  onCancel() {
    this.cancel.emit();
  }
}