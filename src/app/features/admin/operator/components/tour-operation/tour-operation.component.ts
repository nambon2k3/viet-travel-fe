import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../services/tour.service';
import { CurrencyVndPipe } from "../../../../../shared/pipes/currency-vnd.pipe";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tour-operation',
  templateUrl: './tour-operation.component.html',
  styleUrl: './tour-operation.component.css',
  imports: [CurrencyVndPipe,
    CommonModule
  ]
})
export class TourOperationComponent implements OnInit {
  tour: any = null;
  tags: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.getTourDetails(id);
      }
    });
  }

  getTourDetails(id: number) {
    this.tourService.getTourById(id).subscribe(response => {
      if (response.code === 200) {
        this.tour = response.data;
        this.tags = this.tour.tags?.map((tag: any) => tag.name).join(', ') || '';
      } else {
        // Handle error
        this.errorMessage = response.message;
      }
    });
  }
}
