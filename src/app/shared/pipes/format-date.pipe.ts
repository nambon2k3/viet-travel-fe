import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    // Chuyển đổi chuỗi ngày thành đối tượng Date
    const date = new Date(value);

    // Nếu không hợp lệ thì trả về chuỗi rỗng
    if (isNaN(date.getTime())) return '';

    // Tùy chọn định dạng ngày: Ngày (2 chữ số), Tháng (viết tắt 3 chữ cái), Năm (4 chữ số)
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };

    // Trả về ngày với định dạng mong muốn
    return date.toLocaleDateString('en-GB', options);
  }
}
