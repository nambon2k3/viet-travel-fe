import { Component } from '@angular/core';
import { PlanService } from '../../../services/plan.service';
import { UserStorageService } from '../../../../../core/services/user-storage/user-storage.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-plan-detail',
  imports: [CommonModule, FooterComponent],
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






}
