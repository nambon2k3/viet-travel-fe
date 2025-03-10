import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TourService } from '../../../services/tour.service';

@Component({
  selector: 'app-log-table',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent {
  listLogs: any[] = [];

  constructor(private route: ActivatedRoute, private tourService: TourService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadLogs(id);
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
        console.error('Lỗi khi tải danh sách khách hàng:', error);
      }
    });
  }


  async ngAfterViewInit() {
    const { Modal } = await import('flowbite');

  }
  openCreateLog() {
  }
}
