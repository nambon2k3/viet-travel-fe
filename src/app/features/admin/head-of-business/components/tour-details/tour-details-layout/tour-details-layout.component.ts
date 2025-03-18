import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tour-details-layout',
  imports: [
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './tour-details-layout.component.html',
  styleUrl: './tour-details-layout.component.css'
})
export class TourDetailsLayoutComponent {
  tourId: number | null = null;
  
  constructor(
    private router : Router,
    private route: ActivatedRoute, 
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.tourId = params['id'] ? Number(params['id']) : null;
    });
  }

  backToList() {
    this.router.navigate(['/head-business/tour-list']);
  }
}
