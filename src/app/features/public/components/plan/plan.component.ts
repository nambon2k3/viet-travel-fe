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
  selectedLocation: any = null;


  constructor(
    private planService: PlanService,
    private router: RouterModule,
    private fb: FormBuilder
  ) {

    this.generatePlanForm = this.fb.group({
      locationName: ['', [Validators.required]],
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

  

  selectLocation(location: any) {
    console.log('Selected location:', location);
    this.selectedLocation = location;
    this.locations = []; // Clear the suggestions after selection
    this.generatePlanForm.patchValue({ locationName: location.name });
  }

  ngOnInit(): void {
    // Initialization logic can go here
    this.getLocations();
  }

  getLocations() {
    this.planService.getLocationData().subscribe({
      next: (response) => {
        console.log('Locations:', response);
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

  }


  steps = [
    { label: 'Step 1' },
    { label: 'Step 2' },
    { label: 'Step 3' }
  ];

  currentStep = 0;

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
    }
  }

  goToStep(index: number) {
    this.currentStep = index;
  }

}
