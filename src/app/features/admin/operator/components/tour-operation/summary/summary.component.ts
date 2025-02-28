import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CurrencyVndPipe } from "../../../../../../shared/pipes/currency-vnd.pipe";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  imports: [
    CommonModule,
    CurrencyVndPipe
]
})
export class SummaryComponent {
  // Data for Total Collect and Total Paid sections
  totalCollect = {
    total: 80000000,
    companyCollect: 60000000,
    travelGuideCollect: 20000000,
    remain: 0
  };

  totalPaid = {
    total: 50000000,
    companyPaid: 30000000,
    travelGuidePaid: 15000000,
    remain: 5000000
  };

  // Summary data
  summary = [
    { content: 'Total Collect', estimate: 80000000, summary: 80000000 },
    { content: 'Total Paid', estimate: 50000000, summary: 50000000 },
    { content: 'Profit', estimate: 30000000, summary: 30000000 }
  ];
}
