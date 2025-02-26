import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Customer {
  id: number;
  fullname: string;
  phone?: string;
  email?: string;
  birthdate: string;
  gender: string;
  pickup: string;
}

interface BookingGroup {
  salesman: string;
  bookingId: number;
  groupLeader: string;
  customers: Customer[];
}

@Component({
  selector: 'app-list-customer',
  imports: [
    CommonModule
  ],
  templateUrl: './list-customer.component.html',
  styleUrl: './list-customer.component.css'
})
export class ListCustomerComponent {
  bookingGroups: BookingGroup[] = [
    {
      salesman: 'Như Hoa',
      bookingId: 234,
      groupLeader: 'Lan Than',
      customers: [
        {
          id: 1,
          fullname: 'Lan Than',
          phone: '0723647838',
          email: 'lanthan@gmail.com',
          birthdate: '20/03/2003',
          gender: 'Female',
          pickup: 'Viet Yen',
        },
        { id: 2, fullname: 'Con Vit 1', birthdate: '20/03/2003', gender: 'Female', pickup: 'Viet Yen' },
        { id: 3, fullname: 'Con Vit 2', birthdate: '20/03/2003', gender: 'Female', pickup: 'Viet Yen' },
      ],
    },
    {
      salesman: 'Online',
      bookingId: 122,
      groupLeader: 'Dai Hinh',
      customers: [
        {
          id: 4,
          fullname: 'Dai Hinh',
          phone: '0723647836',
          email: 'bom@gmail.com',
          birthdate: '24/08/2003',
          gender: 'Male',
          pickup: 'Kim Quan',
        },
        { id: 5, fullname: 'Con Vit 3', birthdate: '24/08/2003', gender: 'Male', pickup: 'Kim Quan' },
      ],
    },
  ];

  onEditCustomer(customer: Customer) {
    console.log(customer);
  }

  onDeleteCustomer(customer: Customer) {
    console.log(customer);
  }
}
