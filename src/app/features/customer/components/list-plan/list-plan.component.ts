import { Component, signal } from '@angular/core';
import { PlanService } from '../../services/plan.service';
import { UserStorageService } from '../../../../core/services/user-storage/user-storage.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TableFooterComponent } from '../../../../shared/components/table/table-footer/table-footer.component';

@Component({
  selector: 'app-list-plan',
  imports: [RouterModule, CommonModule, TableFooterComponent],
  templateUrl: './list-plan.component.html',
  styleUrl: './list-plan.component.css'
})
export class ListPlanComponent {

  constructor(
    private planService: PlanService,
    private userStorageService: UserStorageService,
  ) {}

  userId: any;

  totalItems = 0;
  page = 0;
  size = 5;
  totalPages = signal(0)
  isLoading: boolean = true;

  plans: any;

  ngOnInit() {
    this.userId = this.userStorageService.getUserId();

    if(this.userId) {
      this.getListPlanByUserId();

    }
  }

  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.page = newPage;
    }
  }

  // Change page size and reload data
  onPageSizeChange(newSize: number): void {
    this.size = newSize;
    this.page = 0; // Reset to first page
  }


  getListPlanByUserId() {
    this.isLoading = true;
    this.planService.getPlanByPage(
      this.page,
      this.size,
      'id',
      'desc',
      this.userId
    ).subscribe({
      next: (response) => {
        console.log(response.data)

        this.totalItems = response.data.total;
        this.page = response.data.page;
        this.size = response.data.size;
        this.totalPages.set(Math.ceil(this.totalItems / this.size));
        this.isLoading = false;

        this.plans = response.data.items.map((item: any) => {
          return {
            ...item,
            content: JSON.parse(item.content.replace(/^```json\n/, '').replace(/\n```$/, '')).plan
          };
        });

        console.log(this.plans)
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
