import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { CommonModule } from '@angular/common';
import { BirthDate } from "../../../../../../shared/pipes/birthdate.pipe";

@Component({
  selector: 'app-list-customer',
  standalone: true,
  imports: [
    CommonModule,
    BirthDate
],
  templateUrl: './list-customer.component.html',
  styleUrl: './list-customer.component.css'
})
export class ListCustomerComponent implements OnInit {
  listCustomers: any[] = [];

  constructor(private route: ActivatedRoute, private tourService: TourService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadCustomers(id);
      }
    });
  }

  loadCustomers(id: number): void {
    this.tourService.getTourCustomers(id).subscribe({
      next: (response : any) => {
        if (response.code === 200) {
          this.listCustomers = response.data;
        } else {
          console.error('Lỗi:', response.message);
        }
      },
      error: (error : any) => {
        console.error('Lỗi khi tải danh sách khách hàng:', error);
      }
    });
  }

  onEditCustomer(customer: any) {
    console.log('Chỉnh sửa:', customer);
  }
  
  onDeleteCustomer(customer: any) {
    console.log('Xóa:', customer);
  }  
}
