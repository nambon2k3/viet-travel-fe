import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-view-request-detail',
  imports: [],
  templateUrl: './view-request-detail.component.html',
  styleUrl: './view-request-detail.component.css'
})
export class ViewRequestDetailComponent {
  constructor(
    private router: Router,
    private requestService: RequestService
  ) { }

  ngOnInit(): void {
  }

  onCanceled(): void {
    this.router.navigate(['/operator/view-list-request']);
  }
}
