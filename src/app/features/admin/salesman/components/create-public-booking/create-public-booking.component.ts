import { Component } from '@angular/core';
import { TourService } from '../../services/tour.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { CurrencyVndPipe } from "../../../../../shared/pipes/currency-vnd.pipe";
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { scheduled } from 'rxjs';
import { UserStorageService } from '../../../../../core/services/user-storage/user-storage.service';
@Component({
  selector: 'app-create-public-booking',
  imports: [DatePipe, CommonModule, CurrencyVndPipe, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './create-public-booking.component.html',
  styleUrl: './create-public-booking.component.css'
})
export class CreatePublicBookingComponent {


  createBookingForm: FormGroup;

  numberAdults: number = 1;
  numberChildren: number = 0;
  numberSingleRoom: number = 0;

  totalAmountCustomers: number = 0;

  tourDetial: any;


  selectedScheduleId: number = 0;
  selectedSchedule: any;

  selectedCustomer: any;

  customers: any[] = [];
  isLoading = false;


  tourId?: number;


  get fullName() {
    return this.createBookingForm.get('fullName');
  }

  selectUser(customer: any) {
    this.customers = [];
    this.selectedCustomer = customer;

    this.createBookingForm.patchValue({
      fullName: customer.fullName,
      address: customer.address,
      email: customer.email,
      phone: customer.phone,
      userId: customer.id
    });


  }


  getUser() {

  }


  minLengthArray(min: number) {
    return (formArray: AbstractControl): ValidationErrors | null => {
      const array = formArray as FormArray;
      return array.length >= min ? null : { minLengthArray: { requiredLength: min, actualLength: array.length } };
    };
  }

  constructor(
    private tourService: TourService,
    private router: Router,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private userService : UserStorageService
  ) {
    this.createBookingForm = this.fb.group({
      customers: this.fb.array([], this.minLengthArray(1)),
      paymentMethod: ['CASH', Validators.required],
      fullName: ['', Validators.required],
      address: [null],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, Validators.required],
      expiredAt: [null, Validators.required],
      tourId: [null, Validators.required],
      scheduleId: [null, Validators.required],
      note: [null],
      totalAmount: [0, Validators.required],
      saleId: [this.userService.getUserId(), Validators.required],
      userId: [null, Validators.required],
      sellingPrice: [0, Validators.required],
      extraHotelCost: [0, Validators.required],
    });

    this.addCustomer()


    this.customersFormArray.valueChanges.subscribe(() => {
      this.calculateNumberAdultsAndChildren();
      this.calculateSingleRoom();
      this.calculatetotalAmountCost();
    });

    this.createBookingForm.get('fullName')?.valueChanges
      .pipe(
        debounceTime(800),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value && value.length >= 2) {
          this.isLoading = true;
          if(value !== this.selectedCustomer?.fullName) {
            this.bookingService.getCustomers(value).subscribe(res => {
              this.customers = res.data;
              this.isLoading = false;
            }, () => this.isLoading = false);
          } else {
            this.isLoading = false;
          }
            
          
        } else {
          this.customers = [];
        }
      });

    

  }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const tourId = Number(params.get('tourId'));
      const scheduleId = params.get('scheduleId') ? Number(params.get('scheduleId')) : undefined;
    
      console.log(tourId, scheduleId)

      if (tourId && scheduleId) {
       this.tourId = tourId;
        this.selectedScheduleId = scheduleId;
       this.getTourDetail(tourId, scheduleId);
        this.createBookingForm.patchValue({
          tourId: tourId,
          scheduleId: scheduleId
        });
      }
    });
  }

  get customersFormArray(): FormArray {
    return this.createBookingForm.get('customers') as FormArray;
  }

  createCustomerGroup(): FormGroup {
    return this.fb.group({
      fullName: [null, Validators.required],
      address: [null],
      email: [null, [Validators.email]],
      dateOfBirth: [null, [Validators.required]],
      phoneNumber: [null],
      pickUpLocation: [null],
      note: [null],
      gender: ['MALE', Validators.required],
      ageType: ['ADULT', Validators.required],
      singleRoom: [false],
      deleted: [false],
      bookedPerson: [false],
    });
  }

  addCustomer(): void {
    this.customersFormArray.push(this.createCustomerGroup());
  }

  calculateNumberAdultsAndChildren(): void {
    this.numberAdults = 0;
    this.numberChildren = 0;
    this.totalAmountCustomers = 0;
    this.customersFormArray.controls.forEach((customer: any) => {
      if (customer.get('ageType').value === 'ADULT') {
        this.numberAdults++;
      } else {
        this.numberChildren++;
      }

      this.totalAmountCustomers++;
    });
  }

  calculateSingleRoom(): void {
    this.numberSingleRoom = 0;
    this.customersFormArray.controls.forEach((customer: any) => {
      if (customer.get('singleRoom').value) {
        if(customer.get('ageType').value === 'CHILDREN') {
          customer.get('singleRoom').setValue(false);
        } else {
          this.numberSingleRoom++;
        }
      }
      
    });
  }

  totalAmount: number = 0;


  calculatetotalAmountCost() {

    const adultPrice = this.selectedSchedule?.sellingPrice;
    const childrenPrice = this.selectedSchedule?.sellingPrice * 0.75;

    const adulttotalAmount = this.numberAdults * adultPrice;
    const childrentotalAmount = this.numberChildren * childrenPrice;

    const extra = this.numberSingleRoom * this.selectedSchedule?.extraHotelCost!;

    this.totalAmount = adulttotalAmount + childrentotalAmount + extra;

    this.createBookingForm.patchValue({
      totalAmount: this.totalAmount
    });
  }

  deleteCustomer(index: number): void {
    this.customersFormArray.removeAt(index);
  }


  getTourDetail(tourId: number, scheduleId:number): void {
    this.tourService.getTourDetail(tourId, scheduleId).subscribe({
      next: (response) => {
        this.tourDetial = response.data;
        console.log('Tour Detail', this.tourDetial);
        this.selectedSchedule = this.tourDetial.tourSchedule;
        this.calculatetotalAmountCost()
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onSubmit(): void {

    console.log('Form Value:', this.createBookingForm.value);
    console.log('Form Value Valid hay ko: ', this.createBookingForm.valid);
    if(this.createBookingForm.valid) {
      console.log('Form Value Valid', this.createBookingForm.value);
      
      this.bookingService.createBooking(this.createBookingForm.value).subscribe({
        next: (response) => {
          console.log('Create Booking Response', response);
          //this.router.navigate(['/admin/salesman/bookings']);
        },
        error: (error) => {
          console.error(error);
        }
      });

    } else {
      this.checkFormErrors(this.createBookingForm);
    }
    
  }

  markControlTouched(controlName: string) {
    const control = this.createBookingForm.get(controlName);
    if (control && !control.touched) {
      control.markAsTouched();
    }
  }
  
  markTouched(index: number, controlName: string) {
    const control = this.customersFormArray.at(index).get(controlName);
    if (control && !control.touched) {
      control.markAsTouched();
    }
  }


  checkFormErrors(formGroup: FormGroup | FormArray, path: string = '') {
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);
  
      const currentPath = path ? `${path}.${controlName}` : controlName;
  
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.checkFormErrors(control, currentPath);
      } else if (control && control.invalid) {
        this.markControlTouched(currentPath);
      }
    });
  }


}
