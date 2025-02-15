import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-blog',
  imports: [
    CommonModule
  ],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  // Mảng dữ liệu cho các thẻ
  items = Array(9).fill({
    title: '3 family-friendly days in',
    location: 'Rome'
  });

  // Hàm tính chiều cao tự động
  getHeight(index: number): string {
    // Quy luật: 0 -> h-48, 1 -> h-64, 2 -> h-48 (lặp lại)
    const heightClasses = ['h-48', 'h-64', 'h-48'];
    return heightClasses[index % 3];
  }
}
