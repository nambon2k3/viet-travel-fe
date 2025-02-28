import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyVndPipe } from "../../../../../../../shared/pipes/currency-vnd.pipe";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-receipt',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyVndPipe,
    CommonModule
],
  templateUrl: './post-receipt.component.html',
  styleUrls: ['./post-receipt.component.css']
})
export class PostReceiptComponent {
  receiptForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.receiptForm = this.fb.group({
      tourBookingId: [234, Validators.required],
      tourBookingName: ['Tour Cái Chiên - Đầu Rồng - 23/02/2025', Validators.required],
      receiptId: [123, Validators.required],
      createdDate: ['2025-02-23', Validators.required],
      payFor: ['Viet Travel', Validators.required],
      accountedDate: ['2025-02-25', Validators.required],
      payer: ['Lan Than', Validators.required],
      email: ['lanthan@mail.vn', [Validators.required, Validators.email]],
      accountant: ['Dai Hinh', Validators.required],
      type: ['Pay', Validators.required],
      method: ['Cash', Validators.required],
      note: ['Viet Travel'],
      paymentRows: this.fb.array([]) // Initialize FormArray
    });

    // Add default payment rows
    this.addPaymentRow('Pay for Hotel Service', 10000000);
    this.addPaymentRow('Pay for Restaurant Service', 5000000);
  }

  get paymentRows(): FormArray {
    return this.receiptForm.get('paymentRows') as FormArray;
  }

  addPaymentRow(content: string = '', amount: number = 0) {
    this.paymentRows.push(this.fb.group({
      content: [content, Validators.required],
      amount: [amount, [Validators.required, Validators.min(0)]]
    }));
  }

  deletePaymentRow(index: number) {
    this.paymentRows.removeAt(index);
  }

  getTotalAmount(): number {
    return this.paymentRows.value.reduce((sum: number, row: any) => sum + row.amount, 0);
  }

  onCancel() {
    this.router.navigate(['/operator/tour-operation/log']);
  }

  onSave() {
    if (this.receiptForm.valid) {
      const formData = { ...this.receiptForm.value, totalAmount: this.getTotalAmount() };
      console.log("Form Submitted!", formData);
    } else {
      alert("Please fill all required fields correctly.");
    }
  }

  onReceive() {
    if (this.receiptForm.valid) {
      const formData = { ...this.receiptForm.value, totalAmount: this.getTotalAmount() };
      console.log("Form Submitted!", formData);
    } else {
      alert("Please fill all required fields correctly.");
    }
  }
}
