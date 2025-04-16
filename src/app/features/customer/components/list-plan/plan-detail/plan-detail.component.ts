import { Component } from '@angular/core';
import { PlanService } from '../../../services/plan.service';
import { UserStorageService } from '../../../../../core/services/user-storage/user-storage.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../../shared/components/footer/footer.component';
import { SpinnerComponent } from "../../../../../shared/components/spinner/spinner.component";

@Component({
  selector: 'app-plan-detail',
  imports: [CommonModule, FooterComponent, SpinnerComponent],
  templateUrl: './plan-detail.component.html',
  styleUrl: './plan-detail.component.css'
})
export class PlanDetailComponent {

  constructor(
    private planService: PlanService,
    private userStorageService: UserStorageService,
    private router: Router,
    
  ) { }

  plan: any;


  startDate: any;
  endDate: any;

  isLoading: boolean = true;

  selectedDay: any = null;

  isEdited: boolean = false;

  onEditPlan() {
    this.isEdited = !this.isEdited;
  }


  deleteRestaurant(restaurant: any) {

    console.log(restaurant)

    console.log(this.selectedDay.restaurants)

    this.selectedDay.restaurants = this.selectedDay.restaurants.filter((r: any) => r.id !== restaurant.id);

    this.triggerSuccess();

    this.updateSelectedDay(this.selectedDay);
    
  }

  deleteActivity(activity: any) {
    console.log(activity)
    console.log(this.selectedDay.activities)
    this.selectedDay.activities = this.selectedDay.activities.filter((a: any) => a.id !== activity.id);
    this.triggerSuccess();

    this.updateSelectedDay(this.selectedDay);
  }


  deleteHotel() {
    this.selectedDay.hotels = [];
    this.triggerSuccess();

    this.updateSelectedDay(this.selectedDay);
  }




  onCancel() {
    this.getPlanDetailById(this.plan.id);
    this.isEdited = false;
  }


  onSave() {
    console.log(this.plan)
    this.isEdited = false;
    // this.planService.updatePlan(this.plan.id, this.plan).subscribe(
    //   (response) => {
    //     console.log('Plan updated successfully:', response);
    //     this.triggerSuccess();
    //   },
    //   (error) => {
    //     console.error('Error updating plan:', error);
    //     this.triggerError();
    //   }
    // );
  }

  showSuccess: boolean = false;
  showError: boolean = false;


  successMessage: string = 'Chỉnh sửa thành công';
  errorMessage: string = 'Chỉnh sửa  thất bại';

  triggerSuccess() {
    this.showSuccess = true;

    // Hide warning after 3 seconds
    setTimeout(() => {
      this.showSuccess = false;
    }, 4000);
  }

  triggerError() {
    this.showError = true;

    // Hide warning after 3 seconds
    setTimeout(() => {
      this.showError = false;
    }, 4000);
  }



  ngOnInit() {

    const planId = Number(this.router.url.split('/').pop());
    console.log(planId)
    this.getPlanDetailById(planId);
  }

  onSelectDay(day: any) {
    this.selectedDay = day;


    console.log(this.selectedDay)
  }

  getPlanDetailById(planId: number) {
    this.isLoading = true;
    this.planService.getPlanById(planId).subscribe(
      (response) => {
        this.plan = response.data;

        this.plan.content = JSON.parse(this.plan.content.replace(/^```json\n/, '').replace(/\n```$/, '')).plan

        this.startDate = this.plan.content.days[0].date;

        console.log(this.startDate)
        this.endDate = this.plan.content.days[this.plan.content.days.length - 1].date;
        console.log(this.endDate)

        this.selectedDay = this.plan.content.days[0];
        


        console.log(this.plan)
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching plan details:', error);
        this.isLoading = false;
      }
    );
  }


  updateSelectedDay(updatedDay: any): void {
    const index = this.plan.content.days.findIndex((d: any) => d.date === updatedDay.date);
    if (index !== -1) {
      this.plan.content.days[index] = { ...updatedDay };
      this.selectedDay = this.plan.content.days[index];
    }
  }






}
