import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet, ActivatedRoute } from '@angular/router';
import { TourService } from '../../../services/tour.service';

@Component({
  selector: 'app-tour-operation-layout',
  imports: [
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './tour-operation-layout.component.html',
  styleUrl: './tour-operation-layout.component.css'
})
export class TourOperationLayoutComponent {
  tourId: number | null = null;

  constructor(private route: ActivatedRoute, private router: Router,
    private tourService: TourService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.tourId = params['id'] ? Number(params['id']) : null;
    });
  }

  backToList() {
    this.router.navigate(['/operator/view-list-tour']);
  }

  operateTour(tourId: number | null) {
    this.tourService.operateTour(tourId).subscribe({
      next: (response) => {
        this.router.navigate(['/operator/tour-operation'], { queryParams: { id: tourId } });
      },
      error: (error) => {
        console.error('Failed to operate tour:', error);
      }
    });
  }
}
