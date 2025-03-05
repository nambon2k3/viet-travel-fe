import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

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
}
