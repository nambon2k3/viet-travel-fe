import { AfterViewInit, Component } from '@angular/core';
import { TourService } from '../../services/tour.service';
import { CommonModule } from '@angular/common';
import {  AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Modal } from 'flowbite';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-tour-service',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './tour-service.component.html',
  styleUrl: './tour-service.component.css',
})
export class TourServiceComponent implements AfterViewInit{
  serviceCategoriesWithTourDays: any[] = [];

  tourDayServiceForm: FormGroup;

  serviceModal: Modal | null = null;

  locations: any[] = [];

  ngAfterViewInit(): void {
    // Initialize the modal after the view has been initialized
    this.serviceModal = new Modal(document.getElementById('hotel-modal'));
    
  }

  dayServiceForm: FormGroup;

  openModal(day: any, categoryName: string): void {

    this.dayServiceForm.patchValue({
      id: day.id,
      dayNumber: day.dayNumber,
      title: day.title,
    });

      this.serviceModal?.show();
    
  }

  closeModal(): void {
    this.serviceModal?.hide();
  }
  
  constructor(
    private tourService: TourService,
    private fb: FormBuilder
  ) {

    this.tourDayServiceForm = fb.group({
      tourDays: new FormArray([]),
    });

    this.dayServiceForm = fb.group({
      id: [{ value: 1, disabled: true }, Validators.required],
      dayNumber: [null, Validators.required],
      title: [null, Validators.required],
      services: this.fb.array([]), // Initialize as an empty FormArray
    });
  }

  ngOnInit(): void {
    // Initialization code here
    this.getServiceCategoriesWithTourDays(59); // Example tourId, replace with actual value
    this.getLocations(59); // Example tourId, replace with actual value
  }


  get tourDays(): FormArray {
    return this.tourDayServiceForm.get('tourDays') as FormArray;
  }
  

  getServiceCategoriesWithTourDays(tourId: number) {
    this.tourService.getServiceCategoriesWithTourDays(tourId).subscribe(
      (response: any) => {
        this.serviceCategoriesWithTourDays = response.data;

        this.serviceCategoriesWithTourDays = this.serviceCategoriesWithTourDays.map(category => ({
          ...category,
          tourDays: category.tourDays.sort((a: any, b: any) => a.dayNumber - b.dayNumber) // Sort by dayNumber
        }));


        this.patchTourDays(this.serviceCategoriesWithTourDays); // Patch the tour days into the form

        console.log('Form value:', this.tourDayServiceForm.value); // Log the form value for debugging

        
      },
      (error: any) => {
        console.error(
          'Error fetching service categories with tour days:',
          error
        );
      }
    );
  }

  getLocations(tourId: number) {
    this.tourService.getTourLocations(tourId).subscribe(
      (response: any) => {
        this.locations = response.data;
        console.log('Locations:', this.locations); // Log the locations for debugging
      },
      (error: any) => {
        console.error('Error fetching tour locations:', error);
      }
    );
  }


  patchTourDays(categories: any[]): void {
    const tourDaysArray = this.tourDays;
  
    categories.forEach(category => {
      category.tourDays.forEach((tourDay: any) => {
        // Check if the dayNumber already exists
        const exists = tourDaysArray.controls.some(
          (control: AbstractControl) => control.get('dayNumber')?.value === tourDay.dayNumber
        );
  
        if (!exists) { // Only add if not exists
          const tourDayGroup = this.fb.group({
            id: [tourDay.id, Validators.required],
            dayNumber: [tourDay.dayNumber, Validators.required],
            title: [tourDay.title, Validators.required],
            services: this.fb.array([]) // Empty FormArray, will populate below
          });
          tourDaysArray.push(tourDayGroup);
        }
      });
    });
  }
  

  onSubmit() {

  }

}
