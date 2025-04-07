import { AfterViewInit, Component } from '@angular/core';
import { TourService } from '../../services/tour.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CurrencyVndPipe } from "../../../../../shared/pipes/currency-vnd.pipe";
import { SpinnerComponent } from '../../../../../shared/components/spinner/spinner.component';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Modal } from 'flowbite';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-booking-settlement',
  imports: [
    CommonModule,
    CurrencyVndPipe,
    SpinnerComponent,
    ReactiveFormsModule,

  ],
  templateUrl: './booking-settlement.component.html',
  styleUrl: './booking-settlement.component.css'
})
export class BookingSettlementComponent implements AfterViewInit {

  tourScheduleSettlement: any;

  isLoading: boolean = false;

  totalSeatsBookings = 0;

  transactionForm: FormGroup;

  transactionModal: Modal | null = null;
  transactionModalId: string = 'transaction-modal';

  selectedTransaction: any = null;

  selectedBookingCode: string | null = null;


  constructor(
    private tourService: TourService,
    private router: Router,
    private fb: FormBuilder,
    private transactionService: TransactionService // Assuming you have a service for transactions

  ) {
    this.transactionForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      amount: ['', Validators.required],
      category: ['', Validators.required],
      paidBy: ['', Validators.required],
      receivedBy: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      notes: [''],
      createdAt: [{ value: '', disabled: true }],
      costAccount: this.fb.array([]) // Array chứa các dòng cost
    });
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById(this.transactionModalId);
    if (modalElement) {
      this.transactionModal = new Modal(modalElement);
    }
  }

  deleteCostAccount(index: number) {
    this.costAccount.removeAt(index);
  }

  addCostAccount() {
    const costAccountGroup = this.fb.group({
      id: [null],
      content: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0)]],
      discount: [0],
      quantity: [1],
      finalAmount: [0], // Initialize finalAmount with amount
      status: ['PENDING']
    });

    // Listen for changes in 'amount' and update 'finalAmount'
    costAccountGroup.get('amount')?.valueChanges.subscribe((newAmount) => {
      const quantity = costAccountGroup.get('quantity')?.value || 1;
      const discount = costAccountGroup.get('discount')?.value || 0;

      costAccountGroup.get('finalAmount')?.setValue((newAmount! * quantity) * (100 - discount!) / 100.0, { emitEvent: true });
    });

    costAccountGroup.get('quantity')?.valueChanges.subscribe((newQuantity) => {
      const amount = costAccountGroup.get('amount')?.value || 1;
      const discount = costAccountGroup.get('discount')?.value || 0;

      costAccountGroup.get('finalAmount')?.setValue((Number(amount) * Number(newQuantity)) * (100 - Number(discount)) / 100.0, { emitEvent: false });
    });

    costAccountGroup.get('discount')?.valueChanges.subscribe((newDiscount) => {

      const quantity = costAccountGroup.get('quantity')?.value || 1;
      const amount = costAccountGroup.get('amount')?.value || 0;

      costAccountGroup.get('finalAmount')?.setValue((amount! * quantity) * (100 - newDiscount!) / 100.0, { emitEvent: true });
    });

    this.costAccount.push(costAccountGroup);
  }

  openTransactionModal(transaction: any) {
    this.transactionForm.reset(); // Reset form fields
    this.transactionForm.patchValue(transaction); // Set the values of the form fields


    this.selectedBookingCode = this.tourScheduleSettlement?.bookings?.find((booking: any) => booking.transactions?.some((t: any) => t.id === transaction.id))?.bookingCode || null;

    this.transactionForm.patchValue({
      id: transaction.id,
      amount: transaction.amount,
      category: transaction.category,
      paidBy: transaction.paidBy,
      receivedBy: transaction.receivedBy,
      paymentMethod: transaction.paymentMethod,
      notes: transaction.notes,
      createdAt: transaction.createdAt
    });

    const costAccountsArray = this.transactionForm.get('costAccount') as FormArray;
    costAccountsArray.clear(); // Clear existing entries if any

    transaction.costAccount.forEach((account: any) => {

      const costAccountGroup = this.fb.group(account);

      // Listen for changes in 'amount' and update 'finalAmount'
      costAccountGroup.get('amount')?.valueChanges.subscribe((newAmount) => {
        const quantity = costAccountGroup.get('quantity')?.value || 1;
        const discount = costAccountGroup.get('discount')?.value || 0;

        costAccountGroup.get('finalAmount')?.setValue((Number(newAmount) * Number(quantity)) * (100 - Number(discount)) / 100.0, { emitEvent: false });
      });

      costAccountGroup.get('quantity')?.valueChanges.subscribe((newQuantity) => {
        const amount = costAccountGroup.get('amount')?.value || 1;
        const discount = costAccountGroup.get('discount')?.value || 0;

        costAccountGroup.get('finalAmount')?.setValue((Number(amount) * Number(newQuantity)) * (100 - Number(discount)) / 100.0, { emitEvent: false });
      });

      costAccountGroup.get('discount')?.valueChanges.subscribe((newDiscount) => {

        const quantity = Number(costAccountGroup.get('quantity')?.value || 1);
        const amount = Number(costAccountGroup.get('amount')?.value || 0);

        costAccountGroup.get('finalAmount')?.setValue((amount * quantity) * (100 - Number(newDiscount)) / 100.0, { emitEvent: false });
      });

      costAccountsArray.push(costAccountGroup);
    });


    console.log('Transaction:', this.transactionForm.value);


    if (this.transactionModal) {
      this.transactionModal.show();
    }
    this.selectedTransaction = transaction; // Set the selected transaction
  }

  getTotalAmount(): number {
    return this.costAccount.value.reduce((sum: number, row: any) => sum + row.amount * row.quantity * (100 - row.discount) / 100.0, 0);
  }

  closeTransactionModal() {
    if (this.transactionModal) {
      this.transactionModal.hide();
    }
  }

  get costAccount(): FormArray {
    return this.transactionForm.get('costAccount') as FormArray;
  }


  onSave() {
    if (this.transactionForm.valid) {
      const formData = { ...this.transactionForm.value, totalAmount: this.getTotalAmount() };
      console.log("Form Submitted!", formData);
      this.isLoading = true; // Start loading
      this.transactionService.updateTransaction(formData).subscribe({
        next: (response) => {
          this.isLoading = false; // Stop loading
          console.log('Transaction updated successfully:', response);
          this.triggerSuccess(); // Show success message
        },
        error: (error) => {
          this.isLoading = false; // Stop loading
          console.error('Error updating transaction:', error);
        }
      });
    } else {
      this.transactionForm.markAllAsTouched(); // Mark all fields as touched to show validation errors
    }
  }

  showSuccess: boolean = false;

  triggerSuccess() {
    this.showSuccess = true;


    // Hide warning after 3 seconds
    setTimeout(() => {
      this.showSuccess = false;
    }, 4000);
  }


  ngOnInit(): void {

    const tourScheduleId = Number(this.router.url.split('/').pop());

    // Initialization logic here\
    this.getSettlementDetails(tourScheduleId);

  }

  getSettlementDetails(tourScheduleId: number) {
    this.isLoading = true;
    this.tourService.getSettlementDetails(tourScheduleId).subscribe(
      (response) => {
        console.log('Settlement Details:', response);
        // Handle the response data as needed
        this.tourScheduleSettlement = response.data;

        this.setReceiptStatistic();
        this.setTransactionArray();
        this.calculateActualPaidAmounts();

        console.log('After: ', this.tourScheduleSettlement);
        console.log('Receipts:', this.receipts);
        console.log('Payments:', this.payments);
        console.log('Refunds:', this.refunds);
        this.checkAllTransactionsCompleted();
        this.getTotalSeatsBookings();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching settlement details:', error);
        this.isLoading = false;
        // Handle the error as needed
      }
    );
  }

  getTotalSeatsBookings() {
    this.totalSeatsBookings = this.tourScheduleSettlement.bookings
      ?.filter((booking: any) => booking.status === 'SUCCESS')
      .reduce((sum: number, booking: any) => sum + (booking.seats || 0), 0);
  }

  calculateActualPaidAmounts() {
    if (!this.tourScheduleSettlement?.bookings) return;

    this.tourScheduleSettlement.bookings.forEach((booking: any) => {
      booking.transactions?.forEach((transaction: any) => {
        const totalPaid = transaction.costAccount
          ?.filter((item: any) => item.status === 'PAID')
          .reduce((sum: number, item: any) => sum + item.finalAmount, 0);

        transaction.actualPaid = totalPaid || 0;
      });
    });
  }

  receipts: any[] = [];
  payments: any[] = [];
  refunds: any[] = [];


  setTransactionArray(bookingCode?: string) {
    this.receipts = [];
    this.payments = [];
    this.refunds = [];

    this.tourScheduleSettlement.bookings.forEach((booking: any) => {
      const matchBooking = !bookingCode || booking.bookingCode === bookingCode;

      if (matchBooking) {
        booking.transactions.forEach((transaction: any) => {
          if (transaction.category === 'RECEIPT') {
            this.receipts.push(transaction);
          } else if (transaction.category === 'PAYMENT') {
            this.payments.push(transaction);
          } else if (transaction.category === 'REFUND') {
            this.refunds.push(transaction);
          }
        });
      }
    });
  }

  onBookingSelectChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    const bookingCode = value || null;
    this.setTransactionArray(bookingCode!);

    console.log('Selected Booking Code:', bookingCode);
  }

  allTransactionsCompleted: boolean = false;

  checkAllTransactionsCompleted() {
    const allTransactionsCompleted: boolean = this.tourScheduleSettlement.bookings
      ?.every((booking: any) =>
        booking.transactions?.every(
          (transaction: any) => transaction.transactionStatus === 'COMPLETED'
        )
      ) ?? false;
    this.allTransactionsCompleted = allTransactionsCompleted;
  }


  setReceiptStatistic() {
    this.tourScheduleSettlement.bookings = this.tourScheduleSettlement.bookings.map((booking: any) => {
      const totalRevenue = booking.transactions
        ?.filter((t: any) => t.category === 'RECEIPT')
        .reduce((sum: any, t: any) => sum + t.amount, 0) || 0;

      const actualRevenue = booking.transactions
        ?.filter((t: any) => t.category === 'RECEIPT')
        .reduce((sum: number, t: any) => {
          // Sum the finalAmount of all costAccount items with status 'PAID'
          const paidAmount = t.costAccount
            ?.filter((account: any) => account.status === 'PAID')
            .reduce((accountSum: number, account: any) => accountSum + account.finalAmount, 0) || 0;

          return sum + paidAmount;
        }, 0) || 0;

      return {
        ...booking,
        totalRevenue,
        actualRevenue
      };
    });


  }


  finishSettlement() {
    this.isLoading = true;
    this.tourService.finishSettlement(this.tourScheduleSettlement.id).subscribe(
      (response: any) => {
        console.log('Settlement finished successfully:', response);
        this.isLoading = false;
        // Handle success response
      },
      (error: any) => {
        console.error('Error finishing settlement:', error);
        this.isLoading = false;
        // Handle error response
      }
    );
  }

}
