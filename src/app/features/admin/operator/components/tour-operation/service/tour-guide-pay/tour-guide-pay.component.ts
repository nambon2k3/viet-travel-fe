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
    const doc = this.ssrService.getDocument();
    if (doc) {
      const modalElement = doc.getElementById('tourGuideModal');
      if (modalElement) {
        this.modal = new Modal(modalElement, {
          onHide: () => {
            this.close.emit();
            console.log('Modal hidden');
          },
        });
      } else {
        console.error('Modal element not found!');
      }
    }
  }

  openPopup() {
    this.modal?.show();
  }

  sendRequest() {
    console.log('Sending request...', {
      tourGuideName: this.tourGuideName,
      amount: this.amount,
      note: this.note,
    });
    this.close.emit();
    this.modal?.hide();
  }

  cancel() {
    if (this.modal) {
      this.modal.hide();
    }

    // Manually remove the backdrop if it still exists
    const doc = this.ssrService.getDocument();
    if (doc) {
      setTimeout(() => {
        const backdrop = doc.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }, 300); // Delay to ensure modal is closed
    }

    this.close.emit();
  }
}