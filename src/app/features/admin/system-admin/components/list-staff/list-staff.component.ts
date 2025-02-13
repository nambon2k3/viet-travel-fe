import { Component, computed, signal } from '@angular/core';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { TableActionComponent } from './table-action/table-action.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { User } from '../../../../../core/models/user.model';
import { StaffService } from '../../services/staff.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-staff',
  imports: [
    TableActionComponent,
    TableFooterComponent,
    TableHeaderComponent,
    TableRowComponent,
    CommonModule
  ],
  templateUrl: './list-staff.component.html',
  styleUrl: './list-staff.component.css'
})
export class ListStaffComponent {
  staffs = signal<User[]>([]);
  totalItems = 0;
  page = 0;
  size = 10;

  constructor(private staffService: StaffService) { }

  ngOnInit(): void {
    // Temporary mock data for testing UI
    // const mockStaffs: User[] = [
    //   {
    //     id: 1,
    //     fullName: 'John Doe',
    //     username: 'johndoe',
    //     email: 'john@example.com',
    //     gender: true,
    //     phone: '123-456-7890',
    //     address: '123 Main St, City',
    //     role: ['Admin'],
    //     deleted: false,
    //     selected: false,
    //     createdAt: new Date('2023-01-01')
    //   },
    //   {
    //     id: 2,
    //     fullName: 'Jane Smith',
    //     username: 'janesmith',
    //     email: 'jane@example.com',
    //     gender: false,
    //     phone: '098-765-4321',
    //     address: '456 Elm St, City',
    //     role: ['User'],
    //     deleted: false,
    //     selected: false,
    //     createdAt: new Date('2023-02-01')
    //   }
    // ];

    // this.staffs.set(mockStaffs);

    this.loadStaffs();
  }


  loadStaffs(): void {
    this.staffService.getStaffByPage(this.page, this.size).subscribe({
      next: (response) => {
        this.staffs.set(response.data.items);
        this.totalItems = response.data.total;
        this.page = response.data.page;
        this.size = response.data.size;
      },
      error: (err) => {
        console.error('Failed to load staffs:', err);
      },
    });
  }


  public toggleStaffs(checked: boolean): void {
    this.staffs.update((staffs) => {
      return staffs.map((staff) => {
        return { ...staff, selected: checked };
      });
    });

  }


  filteredStaffs = computed(() => {
    return this.staffs();
  });
}
