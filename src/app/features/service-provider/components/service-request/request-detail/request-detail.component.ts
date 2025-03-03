import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-detail',
  imports: [],
  templateUrl: './request-detail.component.html',
  styleUrl: './request-detail.component.css'
})
export class RequestDetailComponent {

  constructor(private router: Router) {}

  onCancel(): void {
    this.router.navigate(['/service-provider/service-request']);
  }

}
