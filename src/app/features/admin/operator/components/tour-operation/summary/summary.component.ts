import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrencyVndPipe } from "../../../../../../shared/pipes/currency-vnd.pipe";
import { TourService } from '../../../services/tour.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    CurrencyVndPipe
  ]
})
export class SummaryComponent implements OnInit {
  id: number | null = null;
  totalCollect = {
    total: 0,
    companyCollect: 0,
    travelGuideCollect: 0,
    remain: 0
  };

  totalPaid = {
    total: 0,
    companyPaid: 0,
    travelGuidePaid: 0,
    remain: 0
  };

  summary = [
    { content: 'Đã thu', estimate: 0, summary: 0 },
    { content: 'Đã chi', estimate: 0, summary: 0 },
    { content: 'Lợi nhuận', estimate: 0, summary: 0 }
  ];

  constructor(
    private tourService: TourService,
    private route : ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.fetchTourSummary(this.id);
      }
    });
  }

  fetchTourSummary(id : number): void {
    this.tourService.getSummary(id).subscribe({
      next: (response: any) => {
        if (response.code === 200 && response.data) {
          const tourData = response.data;

          this.totalCollect = {
            total: tourData.totalReceiptAmount,
            companyCollect: tourData.receiptedAmount,
            travelGuideCollect: tourData.collectionAmount,
            remain: tourData.remainingReceiptAmount
          };

          this.totalPaid = {
            total: tourData.totalPaymentAmount,
            companyPaid: tourData.paymentAmount,
            travelGuidePaid: tourData.advanceAmount,
            remain: tourData.remainingPaymentAmount
          };

          const profit = (tourData.totalReceiptAmount) - (tourData.totalPaymentAmount);
          this.summary = [
            { content: 'Đã thu', estimate: tourData.totalReceiptAmount, summary: tourData.totalReceiptAmount },
            { content: 'Đã chi', estimate: tourData.totalPaymentAmount, summary: tourData.totalPaymentAmount },
            { content: 'Lợi nhuận', estimate: profit, summary: profit }
          ];
          console.log("this.summary");
        }
      },
      error: (error) => {
        console.error('Error fetching tour summary:', error);
      }
    });
  }
}