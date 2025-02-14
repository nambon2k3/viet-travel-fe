import { Component, computed, signal } from '@angular/core';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { TableActionComponent } from './table-action/table-action.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { User } from '../../../../../core/models/user.model';
import { StaffService } from '../../services/staff.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-staff',
  standalone: true,
  imports: [
    TableActionComponent,
    TableFooterComponent,
    TableHeaderComponent,
    TableRowComponent,
    CommonModule
  ],
  templateUrl: './list-staff.component.html',
  styleUrls: ['./list-staff.component.css']
})
export class ListStaffComponent {
  staffs = signal<User[]>([]);
  totalItems = 0;
  page = 0;
  size = 10;
  totalPages = signal(0); 

  constructor(
    private staffService: StaffService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.loadStaffs();
  }

  // Load staffs với page và size hiện tại
  loadStaffs(): void {
    this.staffService.getStaffByPage(this.page, this.size).subscribe({
      next: (response) => {
        this.staffs.set(response.data.items);
        this.totalItems = response.data.total;
        this.page = response.data.page;
        this.size = response.data.size;
        this.totalPages.set(Math.ceil(this.totalItems / this.size));
      },
      error: (err) => {
        console.error('Failed to load staffs:', err);
      },
    });
  }

  // Thay đổi số lượng hiển thị trên mỗi trang
  onPageSizeChange(newSize: number): void {
    this.size = newSize;
    this.page = 0; // Reset về trang đầu tiên
    this.loadStaffs();
  }

  openAddStaffModal(): void {
    this.router.navigate(['/sa/staff-details']);
  }


  // Thay đổi trang hiện tại
  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.page = newPage;
      this.loadStaffs();
    }
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
