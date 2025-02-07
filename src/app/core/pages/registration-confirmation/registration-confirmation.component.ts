import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-confirmation',
  imports: [
    CommonModule
  ],
  templateUrl: './registration-confirmation.component.html',
  styleUrls: ['./registration-confirmation.component.css']
})
export class RegistrationConfirmationComponent implements OnInit {
  errorMessage = "";
  isLoading = false;

  constructor(private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.route.queryParams.subscribe(params => {
        this.errorMessage = params['error'] || null;
        this.isLoading = false;
      });
    }, 3000);
  }
}
