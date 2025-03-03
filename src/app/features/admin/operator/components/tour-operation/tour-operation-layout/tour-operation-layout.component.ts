import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tour-operation-layout',
  imports: [
    RouterOutlet
  ],
  templateUrl: './tour-operation-layout.component.html',
  styleUrl: './tour-operation-layout.component.css'
})
export class TourOperationLayoutComponent {
  constructor(
    private router : Router
  ) { }

  backToList() {
    this.router.navigate(['/operator/view-list-tour']);
  }
}
