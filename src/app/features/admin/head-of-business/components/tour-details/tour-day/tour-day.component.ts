import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-day',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tour-day.component.html', 
  styleUrls: ['./tour-day.component.css']
})
export class TourDayComponent {
  constructor(
    private router : Router
  ) {}
  tourDays = [
    { day: 'Ngày 1', title: 'Hà Nội - Tuần Chùa', services: 'Xe, Phòng, Nhà Hàng' },
    { day: 'Ngày 2', title: 'Tuần Chùa - Cát Bà - Tuần Chùa', services: 'Xe, Phòng, Nhà Hàng' },
    { day: 'Ngày 3', title: 'Tuần Chùa - Vĩnh Long - Vĩnh Lan Hà - Tuần Chùa', services: 'Xe, Phòng, Nhà Hàng' },
    { day: 'Ngày 4', title: 'Tuần Chùa - Hà Nội', services: 'Xe, Nhà Hàng' },
  ];

  openUpdateTourDay() {
    this.router.navigate(['/head-business/update-tour-day']);
  }
}