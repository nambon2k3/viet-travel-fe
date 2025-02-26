import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyVnd',
  standalone: true
})
export class CurrencyVndPipe implements PipeTransform {
  transform(
    value: number | null | undefined,
    currencyType: 'VND' | 'USD' = 'VND',
    showSymbol: boolean = true
  ): string {
    if (value === null || value === undefined) return '';

    const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    if (currencyType === 'USD') {
      return showSymbol ? `$ ${formattedValue}` : formattedValue;
    }

    return showSymbol ? `${formattedValue} ₫` : formattedValue;
  }
}
