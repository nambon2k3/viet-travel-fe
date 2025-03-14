import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TourService } from '../../../services/tour.service';
import { CreateLogComponent } from './create-log/create-log.component';
import { FormatDatePipe } from "../../../../../../shared/pipes/format-date.pipe";
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../core/services/ssr.service';
import { initFlowbite } from 'flowbite'; // Import hàm khởi tạo Flowbite

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
export class LogComponent implements AfterViewInit, OnDestroy {
  @ViewChild('logModal') logModal!: CreateLogComponent;
  listLogs: any[] = [];
  id: number = 0;
  private modalInstance: Modal | null = null;

  constructor(
    private route: ActivatedRoute,
    private tourService: TourService,
    private ssrService: SsrService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.loadLogs(this.id);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initModal();
    this.reInitFlowbite(); // Khởi tạo lại Flowbite sau khi view sẵn sàng
  }

  ngOnDestroy(): void {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
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

  initModal(): void {
    if (this.ssrService.isBrowser) {
      const modalElement = document.getElementById('logModal');
      if (modalElement && !this.modalInstance) {
        this.modalInstance = new Modal(modalElement);
      }
    }
  }

  reInitFlowbite(): void {
    if (this.ssrService.isBrowser) {
      setTimeout(() => {
        initFlowbite(); // Gọi hàm khởi tạo lại Flowbite
      }, 0); // Đặt trong setTimeout để đảm bảo DOM đã sẵn sàng
    }
  }

  onLogCreated(): void {
    this.loadLogs(this.id);
  }
}