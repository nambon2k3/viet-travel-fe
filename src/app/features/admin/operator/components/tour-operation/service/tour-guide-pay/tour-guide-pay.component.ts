import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../../core/services/ssr.service';

@Component({
  selector: 'app-tour-guide-pay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tour-guide-pay.component.html',
  styleUrls: ['./tour-guide-pay.component.css'], 
})
export class TourGuidePayComponent {
  @Input() tourGuide: any;
  amount: number = 0;
  note: string = '';
  modal: Modal | null = null;

  constructor(private ssrService: SsrService) {}

  ngAfterViewInit() {
    const document = this.ssrService.getDocument();
    if (document) {
      const modalElement = document.getElementById('tourGuidePayModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
      }
    }
  }

  open() {
    this.modal?.show();
  }

  close() {
    this.modal?.hide();
  }

  sendRequest() {
    console.log('Sending request...', { tourGuide: this.tourGuide });
    this.close();
  }
}