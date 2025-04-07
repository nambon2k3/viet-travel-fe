import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { CurrencyVndPipe } from "../../../../../shared/pipes/currency-vnd.pipe";
import { CommonModule } from '@angular/common';
import { AssignTourGuideComponent } from './assign-tour-guide/assign-tour-guide.component';
import { SpinnerComponent } from "../../../../../shared/components/spinner/spinner.component";

@Component({
  selector: 'app-tour-operation',
  standalone: true,
  templateUrl: './tour-operation.component.html',
  styleUrls: ['./tour-operation.component.css'],
  imports: [CurrencyVndPipe, CommonModule, AssignTourGuideComponent, SpinnerComponent]
})
export class TourOperationComponent {
  @ViewChild('assignTourGuideModal') assignTourGuideModal!: AssignTourGuideComponent;
  tour: any;
  tags: string = '';
  errorMessage: string = '';
  id: number = 0;
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.getTourDetails(this.id);
      }
    });
  }

  getTourDetails(id: number) {
    this.isLoading = true;
    this.tourService.getTourById(id).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response.code === 200) {
          this.tour = response.data; // Ensure tour is set here
          this.tags = this.tour.tags?.map((tag: any) => tag.name).join(', ') || '';
        } else {
          this.errorMessage = response.message;
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.message;
      },
    });
  }

  onTourGuideAssigned(): void {
    this.getTourDetails(this.id);
  }
}