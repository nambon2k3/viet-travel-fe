// config-price.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyVndPipe } from "../../../../../../shared/pipes/currency-vnd.pipe";
import { CommonModule } from '@angular/common';

interface PaxOption {
  id: number;
  minPax: number;
  maxPax: number;
  paxRange: string;
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
      sellingPriceFormatted: p.sellingPrice.toLocaleString('vi-VN')
    }));
  }
  @Output() confirm = new EventEmitter<PaxOption[]>();
  @Output() cancel = new EventEmitter<void>();
  @Input() totalNetPrice: PriceRange = {};

  _prices: { paxRange: string, sellingPriceFormatted: string }[] = [];
  startDate: string = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
  endDate: string = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];

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

  deletePrice(index: number): void {
    this._prices.splice(index, 1);
  }

  onConfirm(): void {
    const parsedPrices = this._prices.map((p, index) => ({
      id: index, 
      minPax: 0, 
      maxPax: 0, 
      paxRange: p.paxRange,
      sellingPrice: parseInt(p.sellingPriceFormatted.replace(/,/g, ''), 10)
    }));
    this.confirm.emit(parsedPrices);
  }
}