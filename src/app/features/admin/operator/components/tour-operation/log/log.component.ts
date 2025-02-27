import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-log-table',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent {
  logs = [
    { id: 1, title: "Lu’s Lunch", date: "20/03/2025", action: "Pay", logContent: "This is order lunch service for Lan Than" },
    { id: 2, title: "Lu’s Dinner", date: "20/03/2025", action: "Change service", logContent: "This is order lunch service for Lan Than" }
  ];
}
