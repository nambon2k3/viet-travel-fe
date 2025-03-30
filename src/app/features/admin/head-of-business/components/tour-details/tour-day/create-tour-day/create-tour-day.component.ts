import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BlogContentComponent } from '../../../../../marketer/components/blog-detail/blog-content/blog-content.component';
import { TourService } from '../../../../services/tour.service';
import { LocationService } from '../../../../services/location/location.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-create-tour-day',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BlogContentComponent,
    ReactiveFormsModule,
    NgSelectComponent
  ],
  templateUrl: './create-tour-day.component.html',
  styleUrls: ['./create-tour-day.component.css'],
})
export class CreateTourDayComponent {
  @Input() tourId: string | null = null;
  editTourForm!: FormGroup;
  description: string | null = null;
  dropdownList: Location[] = [];
  locations: Location[] = [];
  searchText$ = new Subject<string>();

  serviceOptions = [
    { id: 'Restaurant', name: 'Nhà Hàng' },
    { id: 'Transport', name: 'Vận Chuyển' },
    { id: 'Hotel', name: 'Khách Sạn' },
    { id: 'Activity', name: 'Hoạt Động' },
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private tourService: TourService,
    private locationService: LocationService,
  ) { }

  ngOnInit(): void {
    this.editTourForm = this.fb.group({
      title: ['', Validators.required], // Maps to "title" in API
      content: ['', Validators.required], // Maps to "content" in API
      mealPlan: ['', Validators.required], // Maps to "mealPlan" in API
      locationId: [null, [Validators.required, Validators.min(0)]], // Maps to "locationId" in API
      serviceCategories: [[], Validators.required], // Maps to "serviceCategories" in API
    });
    this.loadLocations();
  }

  onServiceChange(event: any, service: string) {
    const serviceCategories = this.editTourForm.get('serviceCategories')?.value || [];
    if (event.target.checked) {
      this.editTourForm.get('serviceCategories')?.setValue([...serviceCategories, service]);
    } else {
      this.editTourForm.get('serviceCategories')?.setValue(serviceCategories.filter((s: string) => s !== service));
    }
  }

  loadLocations(keyword: string = ''): void {
    this.locationService.getLocationByPage(0, 100, keyword).subscribe({
      next: (response: any) => {
        this.locations = response.data.items;
        this.dropdownList = this.locations;
      },
      error: (err: any) => {
        console.error('Failed to load locations:', err);
      },
    });
  }

  onSearch(event: any): void {
    const keyword = event || '';
    this.searchText$.next(keyword);
  }

  onSubmit() {
    const formValue = this.editTourForm.value;
    const payload = {
      title: formValue.title,
      content: formValue.content,
      mealPlan: formValue.mealPlan,
      locationId: formValue.locationId,
      serviceCategories: formValue.serviceCategories,
    };
    this.tourService.createTourDay(this.tourId!, payload).subscribe({
      next: (response) => {
        console.log('Tour day created successfully', response);
        this.router.navigate(['/head-business/tour-day']);
      },
      error: (error) => {
        console.error('Error creating tour day', error);
      },
    });
  }
}