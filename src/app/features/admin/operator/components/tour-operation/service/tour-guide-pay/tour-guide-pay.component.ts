import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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
  @Output() close = new EventEmitter();

  tourGuideName = 'Nguyen Van A';
  amount = '2.000.000';
  note = 'Nguyen Van A pay for ...';
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

  sendRequest() {
    console.log('Sending request...', {
      tourGuideName: this.tourGuideName,
      amount: this.amount,
      note: this.note,
    });
  }
}