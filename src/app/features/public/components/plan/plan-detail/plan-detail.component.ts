import { Component } from '@angular/core';
import { PlanService } from '../../../services/plan.service/plan.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SpinnerComponent } from '../../../../../shared/components/spinner/spinner.component';
import { AddTransportationComponent } from "../../../../admin/head-of-business/components/tour-discount/add-transportation/add-transportation.component";

@Component({
  selector: 'app-plan-detail',
  imports: [SpinnerComponent],
  templateUrl: './plan-detail.component.html',
  styleUrl: './plan-detail.component.css'
})
export class PlanDetailComponent {

  isLoading: boolean = false;


  constructor(
    private planService: PlanService,
    private fb: FormBuilder,
    private router: Router
  ) {


  }


  plan: any;

  planContent: any;

  restaurants: any[] = [];
  hotels: any[] = [];
  activities: any[] = []

  ngOnInit() {
    const planId = Number(this.router.url.split('/').pop());

    console.log(planId)

    if (planId) {
      this.getPlanById(planId);
    }
  }
  getPlanById(planId: number) {
    this.isLoading = true;
    this.planService.getPlanById(planId).subscribe({
      next: (response) => {
        this.plan = response.data;

        const cleanJsonString = this.plan.content
          .replace(/^```json\n/, '')  // Remove the opening triple backticks
          .replace(/\n```$/, '');
        let parsedData: any;
        try {
          parsedData = JSON.parse(cleanJsonString);
          this.planContent = parsedData;
          console.log('Parsed JSON:', this.planContent);



          this.restaurants = this.planContent.plan.days
            .map((dayObj: any) => {
              const key = Object.keys(dayObj)[0]; // e.g., "day_1", "day_2"
              return dayObj[key]?.restaurants || [];
            })
            .flat();

          console.log('Restaurant: ', this.restaurants);

          this.hotels = this.planContent.plan.days
            .map((dayObj: any) => {
              const key = Object.keys(dayObj)[0]; // e.g., "day_1", "day_2"
              return dayObj[key]?.hotels || [];
            })
            .flat();

          console.log('Hotels: ', this.hotels);

          this.activities = this.planContent.plan.days
            .map((dayObj: any) => {
              const key = Object.keys(dayObj)[0]; // e.g., "day_1", "day_2"
              return dayObj[key]?.activities || [];
            })
            .flat();

          console.log('Activities: ', this.activities);


        } catch (error) {
          console.error('Error parsing JSON:', error);
        }

        this.isLoading = false;

      },
      error: (error) => {
        console.error('Error fetching plan', error);
      }
    });
  }

}
