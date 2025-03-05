import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css']
})
export class TourDetailsComponent {
  constructor(
    private router : Router
  ) {}

  onCancel() {
    this.router.navigate(['/head-of-business/list-tour']);
  }
}
