import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TruncatePipe } from '../../../../../../shared/pipes/truncate.pipe';
import { OperatorService } from '../../../services/operator.service';
import { loadRequests } from '../../../../../../core/models/request.model';
import { FormatDatePipe } from "../../../../../../shared/pipes/format-date.pipe";
@Component({
  selector: '[app-table-row]',
  imports: [FormsModule, AngularSvgIconModule, CommonModule, TruncatePipe, FormatDatePipe],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.css',
})
export class TableRowComponent {

  @Input() request: loadRequests = <loadRequests>{};

  authorName: string = 'Loading...';
  tags: string[] = [];

  constructor(private operatorService: OperatorService,
    private router: Router
  ) { }

  openDetail(request: loadRequests): void {
    this.router.navigate(['/operator/request-details'],  {
      queryParams: { id: request.id }
    });
  }

  deleteRequest(): void {
    this.operatorService.updateRequestStatus(this.request.id, true).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.request.deleted = true;
        }
      },
      error: (err) => {
        console.error('Failed to hide request:', err);
      },
    });
  }

  recoverRequest(): void {
    this.operatorService.updateRequestStatus(this.request.id, false).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.request.deleted = false;
        }
      },
      error: (err) => {
        console.error('Failed to show request:', err);
      },
    });
  }

}
