import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { PlanService } from '../../services/plan.service/plan.service';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Modal } from 'flowbite';
import { UserStorageService } from '../../../../core/services/user-storage/user-storage.service';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-plan',
  imports: [CommonModule, CommonModule, ReactiveFormsModule, RouterModule, FormsModule, SpinnerComponent],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.css'
})
export class PlanComponent implements AfterViewInit{

  suggesLocations: any;

  isLoading: boolean = false;

  generatePlanForm: FormGroup;

  locations: any;
  selectedLocation: any;

  isGenerating: boolean = false;

  constructor(
    private planService: PlanService,
    private router: RouterModule,
    private fb: FormBuilder,
    private userStorageService : UserStorageService,
    private route: Router
  ) {

    this.generatePlanForm = this.fb.group({
      locationId: ['', [Validators.required]],
      locationName: [''],
      userId: ['', [Validators.required]],
      startDate: [''],
      endDate: [''],
      preferences: ['Đồ ăn ngon, Nghệ thuật và văn hóa', [Validators.required]],
      planType: ['', [Validators.required]],
      travelingWithChildren: [false],
    });

    this.addInterestForm = this.fb.group({
      interest: ['']
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

  addInterest() {
    this.otherInterest = this.addInterestForm.value.interest;
    
  }

  interestModal: Modal | null = null;

  ngAfterViewInit(): void {
    
    this.interestModal = new Modal(document.getElementById('interest-modal'));

  }

  openModal() {
    if(this.interestModal) {
      this.interestModal.show();
    } else {
      console.log('Open modal Failed')
    }
  }

  closeModal() {
    if(this.interestModal) {
      this.interestModal.hide();
    } else {
      console.log('Hide modal Failed')
    }
  }

  get locationName() {
    return this.generatePlanForm.get('locationName');
  }

  maxEndDate: string = '';
  minEndDate: string = '';

  calculateEndDate() {
    const startDate = this.generatePlanForm.get('startDate')?.value;

    if (startDate) {
      const start = new Date(startDate);
      this.minEndDate = start.toISOString().split('T')[0];
      start.setDate(start.getDate() + 7); // Calculate End Date
      const endDateFormatted = start.toISOString().split('T')[0];

      this.maxEndDate = endDateFormatted;


      



    } // Set maxEndDate to 7 days after start date} 
     else {
      this.minEndDate = new Date().toISOString().split('T')[0];
     }
  }

  addInterestForm: FormGroup;

  otherInterest: string= '';

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

    this.generatePlanForm.patchValue({
      userId: this.userStorageService.getUserId()
    })
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

      this.selectedInterests.push(this.otherInterest);

      formData.preferences = this.selectedInterests.join(', ');

      console.log('Form submitted:', this.generatePlanForm.value);


      this.isGenerating = true;

      // Handle form submission logic here
      this.planService.generatePlan(formData).subscribe(
        (response) => {
          // const cleanJsonString = response.data
          //   .replace(/^```json\n/, '')  // Remove the opening triple backticks
          //   .replace(/\n```$/, '');
          // let parsedData: any;
          // try {
          //   parsedData = JSON.parse(cleanJsonString);
          //   console.log('Parsed JSON:', parsedData);
          // } catch (error) {
          //   console.error('Error parsing JSON:', error);
          // }

          this.isGenerating = false;
          console.log(response)
          this.route.navigate(['/plan-detail/' + response.data]);
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


  interests: string[] = [
    'Các điểm tham quan nổi bật',
    'Ẩm thực tuyệt vời',
    'Viên ngọc ẩn',
    'Tour & Trải nghiệm',
    'Khám phá Rome về đêm',
    'Hầm mộ bí mật của Rome',
    'Nghệ thuật & nhạc kịch vượt thời gian',
    'Ẩm thực La Mã',
    'Di tích lịch sử',
    'Bảo tàng & phòng trưng bày nghệ thuật',
    'Mua sắm',
    'Quán rượu vang'
  ];

  selectedInterests: string[] = [];

  toggleInterest(interest: string): void {
    const index = this.selectedInterests.indexOf(interest);
    if (index === -1) {
      this.selectedInterests.push(interest);
    } else {
      this.selectedInterests.splice(index, 1);
    }

    console.log('Selected interests: ', this.selectedInterests)
  }

  isSelected(interest: string): boolean {
    return this.selectedInterests.includes(interest);
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
