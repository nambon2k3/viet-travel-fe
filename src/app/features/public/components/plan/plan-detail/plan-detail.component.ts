import { Component } from '@angular/core';
import { PlanService } from '../../../services/plan.service/plan.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { SpinnerComponent } from '../../../../../shared/components/spinner/spinner.component';
import { AddTransportationComponent } from "../../../../admin/head-of-business/components/tour-discount/add-transportation/add-transportation.component";
import { ImageSearchService } from './imge.service';

@Component({
  selector: 'app-plan-detail',
  imports: [SpinnerComponent, RouterModule],
  templateUrl: './plan-detail.component.html',
  styleUrl: './plan-detail.component.css'
})
export class PlanDetailComponent {

  isLoading: boolean = false;


  constructor(
    private planService: PlanService,
    private fb: FormBuilder,
    private router: Router,
    private imageSearchService: ImageSearchService
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
  async getPlanById(planId: number) {
    this.isLoading = true;
  
    this.planService.getPlanById(planId).subscribe({
      next: async (response) => {
        this.plan = response.data;
  
        const cleanJsonString = this.plan.content
          .replace(/^```json\n/, '')
          .replace(/\n```$/, '');
  
        try {
          const parsedData = JSON.parse(cleanJsonString);
          this.planContent = parsedData;
  
          this.restaurants = Array.from(
            new Map(
              this.planContent.plan.days
                .flatMap((dayObj: any) => dayObj.restaurants || [])
                .map((rest: any) => [rest.name, rest])
            ).values()
          );
  
          this.hotels = Array.from(
            new Map(
              this.planContent.plan.days
                .flatMap((dayObj: any) => dayObj.hotels || [])
                .map((hotel: any) => [hotel.name, hotel])
            ).values()
          );
  
          // 👉 Tạo danh sách activities
          this.activities = this.planContent.plan.days
            .flatMap((dayObj: any) => dayObj.activities || []);
  
          console.log('DEBUG:');

          // 👉 Gọi đồng thời tất cả ảnh và gán lại
          const updatedActivities = await Promise.all(
            this.activities.map(async (activity: any) => {
              const imageUrl = await this.imageSearchService.getImageUrl(activity.title);
              return { ...activity, imageUrl };
            })
          );
  
          this.activities = updatedActivities;
  
          console.log('All activities with images:', this.activities);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
  
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching plan', error);
        this.isLoading = false;
      }
    });
  }
  

  async setImageUrl(planId: number) {
    this.plan = await this.planService.getPlanById(planId).toPromise();
  
    this.activities = this.plan.activities;
  
    for (const activity of this.activities) {
      const imageUrl = await this.imageSearchService.getImageUrl(activity.title);
      activity.imageUrl = imageUrl;
    }
  }


  onSave() {
    this.planService.updateStatusPlan(this.plan.id).subscribe({
      next: (response) => {
        console.log('Plan generated successfully', response);
        this.router.navigate(['/customer/plan-detail', this.plan.id]);
      },
      error: (error) => {
        console.error('Error generating plan', error);
      }
    });

  }

}
