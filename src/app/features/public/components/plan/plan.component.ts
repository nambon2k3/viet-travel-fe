import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PlanService } from '../../services/plan.service/plan.service';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-plan',
  imports: [CommonModule, CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.css'
})
export class PlanComponent {

  suggesLocations: any;

  isLoading: boolean = false;

  generatePlanForm: FormGroup;

  locations: any;
  selectedLocation: any;


  constructor(
    private planService: PlanService,
    private router: RouterModule,
    private fb: FormBuilder
  ) {

    this.generatePlanForm = this.fb.group({
      locationId: ['', [Validators.required]],
      locationName: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      preferences: ['Đồ ăn ngon, Nghệ thuật và văn hóa', [Validators.required]],
      planType: ['', [Validators.required]],
      travelingWithChildren: [false],
    });


    this.generatePlanForm.get('locationName')?.valueChanges
      .pipe(
        debounceTime(800),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value && value.length >= 2) {
          this.isLoading = true;
          this.planService.getAllLocationData(value).subscribe(res => {
            this.locations = res.data;
            console.log('Locations:', this.locations);
            this.isLoading = false;
          }, () => this.isLoading = false);
        } else {
          this.locations = [];
        }
      });

  }

  get locationName() {
    return this.generatePlanForm.get('locationName');
  }

  maxEndDate: string = '';

  calculateEndDate() {
    const startDate = this.generatePlanForm.get('startDate')?.value;

    if (startDate) {
      const start = new Date(startDate);
      start.setDate(start.getDate() + 7); // Calculate End Date
      const endDateFormatted = start.toISOString().split('T')[0];

      this.maxEndDate = endDateFormatted;




    } // Set maxEndDate to 7 days after start date}
  }


  selectLocation(location: any) {
    console.log('Selected location:', location);
    this.selectedLocation = location;
    this.locations = []; // Clear the suggestions after selection
    this.generatePlanForm.patchValue({ locationId: location.id });
    this.nextStep();
  }

  ngOnInit(): void {
    // Initialization logic can go here
    this.getLocations();
    this.setMinStartDate();
  }

  getLocations() {
    this.planService.getLocationData().subscribe({
      next: (response) => {
        this.suggesLocations = response.data;
      },
      error: (error) => {
        console.error('Error fetching locations:', error);
      }
    });
  }

  onPlanChange(plan: string): void {
    console.log('Selected plan:', plan);
    // Handle the plan change logic here
  }


  onSubmit() {
    if (this.generatePlanForm.valid) {
      const formData = this.generatePlanForm.value;
      formData.isTravelingWithChildren = this.isTravelingWithChildren; // Set the traveling with children flag

      console.log('Form submitted:', this.generatePlanForm.value);
      // Handle form submission logic here
      this.planService.generatePlan(formData).subscribe(
        (response) => {
          const cleanJsonString = response.data
            .replace(/^```json\n/, '')  // Remove the opening triple backticks
            .replace(/\n```$/, '');
          let parsedData: any;
          try {
            parsedData = JSON.parse(cleanJsonString);
            console.log('Parsed JSON:', parsedData);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        },
        (error) => {
          console.error('Error generating plan:', error);
          // Handle error case
        }
      );
    } else {
      console.log('Form is invalid:', this.generatePlanForm.value);
    }
  }

  selectTrip(trip: any) {
    this.selectedTrip = trip;
    this.generatePlanForm.patchValue({ planType: trip.label });
    console.log('Selected trip:', trip);
  }


  tripTypes = [
    { label: 'Du lịch Cá Nhân', icon: '👤' },
    { label: 'Tuần Trang Mật', icon: '💑' },
    { label: 'Du lịch bạn bè', icon: '👥' },
    { label: 'Du lịch gia đình', icon: '👨‍👩‍👧‍👦' },
  ];

  selectedTrip = this.tripTypes[0];
  isTravelingWithChildren = false;

  steps = [
    { label: 'Step 1' },
    { label: 'Step 2' },
    { label: 'Step 3' },
    { label: 'Step 4' }
  ];

  currentStep = 0;
  widthProgress = 25;

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  showError: boolean = false;
  errorMessage: string = 'Hãy chọn địa điểm!';

  showErrorMessage() {
    this.showError = true;
    setTimeout(() => {
      this.showError = false;
    }, 3000); // Hide after 3 seconds
  }

  nextStep() {

    if (this.currentStep == 0) {
      if (this.selectedLocation) {
        this.currentStep++;
      } else {
        console.log('Please select a location!');
        this.showErrorMessage();
      }
    } else if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  goToStep(index: number) {
    this.currentStep = index;
  }

  minStartDate: string = '';

  setMinStartDate() {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Set to tomorrow
    this.minStartDate = today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }

}
