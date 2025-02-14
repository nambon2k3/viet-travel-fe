import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    const date = new Date(value);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  }
}
