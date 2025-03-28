// config-price.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyVndPipe } from "../../../../../../shared/pipes/currency-vnd.pipe";
import { CommonModule } from '@angular/common';
import { TourDiscountService } from '../../../services/discount.service';

interface PaxOption {
  id: number;
  minPax: number;
  maxPax: number;
  paxRange: string;
  //fixedCost: number;
  sellingPrice: number;
}

interface PriceRange {
  [key: string]: number;
}

@Component({
  selector: 'app-config-price',
  standalone: true,
  imports: [FormsModule, CurrencyVndPipe, CommonModule],
  templateUrl: './config-price.component.html'
})
export class ConfigPriceComponent {
  @Input() tourId!: number;
  @Input() set prices(value: PaxOption[]) {
    this._prices = value.map(p => ({
      ...p,
      //fixedCostFormatted: p.fixedCost.toLocaleString('vi-VN'),
      sellingPriceFormatted: p.sellingPrice.toLocaleString('vi-VN')
    }));
  }
  @Output() confirm = new EventEmitter<PaxOption[]>();
  @Output() cancel = new EventEmitter<void>();
  @Input() totalNetPrice: PriceRange = {};

  constructor(
    private discountService: TourDiscountService,
  ) { }

  _prices: { id: number, paxRange: string, sellingPriceFormatted: string }[] = [];
  startDate: string = new Date().toISOString().split('T')[0];
  endDate: string = new Date().toISOString().split('T')[0];

  formatPrice(index: number): void {
    let value = this._prices[index].sellingPriceFormatted.replace(/[^0-9]/g, '');
    if (value) {
      this._prices[index].sellingPriceFormatted = parseInt(value).toLocaleString('en-US');
    } else {
      this._prices[index].sellingPriceFormatted = '';
    }
  }

  getMinPax(range: string): number {
    return parseInt(range.split('-')[0], 10);
  }

  getMaxPax(range: string): number {
    return parseInt(range.split('-')[1], 10);
  }

  onConfirm(): void {
    console.log('Confirming prices:', this._prices);
    const parsedPrices = this._prices.map((p) => ({
      id: p.id,
      minPax: this.getMinPax(p.paxRange),
      maxPax: this.getMaxPax(p.paxRange),
      paxRange: p.paxRange,
      //fixedCost: parseInt(p.fixedCostFormatted.replace(/,/g, ''), 10),
      sellingPrice: parseInt(p.sellingPriceFormatted.replace(/,/g, ''), 10),
      validFrom: new Date(this.startDate).toISOString(),
      validTo: new Date(this.endDate).toISOString(),
    }));

    parsedPrices.forEach(price => {
      this.discountService.updatePrice(this.tourId, price.id, price)
        .subscribe({
          next: () => console.log(`Updated price for paxId: ${price.id}`),
          error: (err: any) => console.error(`Failed to update paxId: ${price.id}`, err)
        });
    });

    this.confirm.emit(parsedPrices);
  }
}