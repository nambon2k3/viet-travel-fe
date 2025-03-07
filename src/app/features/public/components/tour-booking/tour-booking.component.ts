import { Component, OnInit } from '@angular/core';
import { BookingInfoService } from '../../services/booking-infor.service';
import { TourBookingData, TourDetail, TourSchedule } from '../../../../core/models/tour-detail.model';
import { CommonModule, DatePipe } from '@angular/common';
import { UserStorageService } from '../../../../core/services/user-storage/user-storage.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tour-booking',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tour-booking.component.html',
  styleUrl: './tour-booking.component.css',
  providers: [DatePipe]
})
export class TourBookingComponent implements OnInit{


  tourDetails?: TourDetail;
  tourSchedule?:TourSchedule;
  userInformation: any;
  bookingForm: FormGroup;

  numberAdults: number = 1;
  numberChildren: number = 0;

  childrenPrice: number = 0;

  numberSingleRooms: number = 1;

  isLoading: boolean = true;




  constructor(
    private bookingInforService: BookingInfoService,
    private fb: FormBuilder,
    private userStorageService: UserStorageService,
    private router: Router
  ) {

    this.bookingForm = this.fb.group({
      userId: ['', Validators.required],
      tourId: ['', Validators.required],
      scheduleId: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [null, [Validators.required, Validators.pattern('^[0-9]*$')]],
      address: ['', Validators.required],
      note: [''],
      paymentMethod: ['CASH', Validators.required],
      adults: this.fb.array([]),
      children: this.fb.array([]),
      total: [0],
      sellingPrice: [0, Validators.required],
      extraHotelCost: [0, Validators.required]
    });

    // Dynamically add adult form groups based on numberAdults
    this.addAdults(this.numberAdults);


    this.adultsFormArray.valueChanges.subscribe(() => {
      this.updateNumberOfSingleRooms();
      this.calculateTotal();
    });
  }


  total: number = 0;

  warningMessage: string = '';

  calculateTotal() {
    const adultsArray = this.adultsFormArray;
    const childrenArray = this.childrenFormArray;

    const adultPrice = this.tourSchedule?.sellingPrice;
    const childrenPrice = this.childrenPrice;

    const adultTotal = adultsArray.controls.length * adultPrice!;
    const childrenTotal = childrenArray.controls.length * childrenPrice;

    const extra = this.numberSingleRooms * this.tourSchedule?.extraHotelCost!;

    this.total = adultTotal + childrenTotal + extra;


    this.bookingForm.patchValue({ total: this.total }, { emitEvent: false });
  }


  updateNumberOfSingleRooms(): void {
    const adultsArray = this.adultsFormArray;
    this.numberSingleRooms = adultsArray.controls.filter(
      (adultGroup) => adultGroup.get('singleRoom')?.value === true
    ).length;
  }

  addAdults(count: number): void {
    const adultsArray = this.adultsFormArray;
    for (let i = 0; i < count; i++) {
      adultsArray.push(this.createAdultGroup());
    }
  }

  // Helper method to create a single adult FormGroup
  createAdultGroup(): FormGroup {
    return this.fb.group({
      fullName: ['', Validators.required],
      gender: ['MALE', Validators.required],
      dateOfBirth: ['', Validators.required],
      singleRoom: this.numberAdults == 1 ? [true] : [false], // Checkbox value (default: false)
    });
  }

  createChildrenGroup(): FormGroup {
    return this.fb.group({
      fullName: ['', Validators.required],
      gender: ['MALE', Validators.required],
      dateOfBirth: ['', Validators.required],
      singleRoom: [false]
    });
  }

  addChildren(): void {
    const childrenArray = this.childrenFormArray;
    childrenArray.push(this.createChildrenGroup());
  }

  updateSingleRoomValues(): void {
    const adultsArray = this.adultsFormArray;
    const isSingleAdult = adultsArray.length === 1;
  
    adultsArray.controls.forEach((adultGroup) => {
      const singleRoomControl = adultGroup.get('singleRoom');
      if (singleRoomControl) {
        singleRoomControl.setValue(isSingleAdult); // Set to true if only one adult, otherwise false
        
      }
    });
  }



  // Getter for the adults FormArray
  get adultsFormArray(): FormArray {
    return this.bookingForm.get('adults') as FormArray;
  }

  // Getter for the children FormArray
  get childrenFormArray(): FormArray {
    return this.bookingForm.get('children') as FormArray;
  }

  ngOnInit(): void {

    this.tourDetails = this.bookingInforService.getTourDetails();
    this.tourSchedule = this.bookingInforService.getTourSchedule();

    this.childrenPrice = this.tourSchedule?.sellingPrice! * 0.75;

    this.calculateTotal();

    this.bookingForm.patchValue({
      tourId: this.tourDetails?.id,
      scheduleId: this.tourSchedule?.scheduleId,
      sellingPrice: this.tourSchedule?.sellingPrice,
      extraHotelCost: this.tourSchedule?.extraHotelCost
    });

    this.getUserData();


    console.log(this.tourSchedule?.extraHotelCost)


  }

  getUserData() {
    const cookie = this.userStorageService.getUser();
    
    this.bookingInforService.getUserInformation(cookie.userId).subscribe({
      next: (response) => {
        this.isLoading = false
        this.userInformation = response.data;
        this.bookingForm.patchValue({
          userId: cookie.userId,
          fullName: this.userInformation.fullName,
          email: this.userInformation.email,
          phone: this.userInformation.phone,
          address: this.userInformation.address,
        });
      }
    });
  }


  


  onSubmit() {
    if (this.bookingForm.valid) {

      const formData = this.bookingForm.value;

      this.bookingInforService.submitBooking(formData).subscribe({
        next: (response) => {
          this.router.navigate(['/tour-booking-confirm', response.data]);
        },
        error: (error) => {
          console.error('Booking Failed:', error);
          this.warningMessage = 'Failed to create booking. Please try again.';
          this.triggerWarning();
        }
      });

    } else {
      console.log('Form Submitted:', this.bookingForm.value);
      this.warningMessage = 'Please fill in all required fields';
      this.triggerWarning();
    }
  }



  incrementAldults() {
    if (this.numberAdults + this.numberChildren < this.tourSchedule?.availableSeats!){
      this.numberAdults++;
      this.addAdults(1);
      this.updateSingleRoomValues();
    } 
    else {
      this.warningMessage = 'Sorry, the current tour has only ' + this.tourSchedule?.availableSeats + ' seats left.';
      this.triggerWarning();
    }
  }

  decrementAldults() {
    if (this.numberAdults > 1) {
      this.numberAdults--;
      this.adultsFormArray.removeAt(this.numberAdults); // Remove the last adult form group
      this.updateSingleRoomValues();
    } // Prevent negative values
  }

  incrementChildren() {
    if (this.numberAdults + this.numberChildren < this.tourSchedule?.availableSeats!) {
      this.numberChildren++
      this.addChildren();
      this.calculateTotal();
    }
    else {
      this.warningMessage = 'Sorry, the current tour has only ' + this.tourSchedule?.availableSeats + ' seats left.';
      this.triggerWarning();
    }
  }

  decrementChildren() {
    if (this.numberChildren > 0) {
      this.numberChildren--;
      this.childrenFormArray.removeAt(this.numberChildren); // Remove the last children form group
      this.calculateTotal();
    } // Prevent negative values
  }

  showWarning: boolean = false;

  triggerWarning() {
    this.showWarning = true;
    
    // Hide warning after 3 seconds
    setTimeout(() => {
      this.showWarning = false;
    }, 4000);
  }


  range(end: number): number[] {
    return Array.from({ length: end - 0 }, (_, i) => 0 + i);
  }

  agreeTerms: boolean = false;

  confirmAgreeTerms() {
    this.agreeTerms = !this.agreeTerms;
  }

}
