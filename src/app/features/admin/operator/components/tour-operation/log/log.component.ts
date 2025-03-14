import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { CreateLogComponent } from './create-log/create-log.component';
import { FormatDatePipe } from "../../../../../../shared/pipes/format-date.pipe";

@Component({
  selector: 'app-log-table',
  standalone: true,
  imports: [
    CommonModule,
    CreateLogComponent,
    FormatDatePipe
  ],
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent {
  @ViewChild('logModal') logModal!: CreateLogComponent;
  listLogs: any[] = [];
  id: number = 0;

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.loadLogs(this.id);
      }
    });
  }

  loadLogs(id: number): void {
    this.tourService.getLogs(id).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.listLogs = response.data;
        } else {
          console.error('Lỗi:', response.message);
        }
      },
      error: (error: any) => {
        console.error('Lỗi khi tải danh sách log:', error.message);
      }
    });
  }

  onLogCreated(): void {
    this.loadLogs(this.id);
  }
}