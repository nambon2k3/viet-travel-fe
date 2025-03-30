import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IDropdownSettings, NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BlogContentComponent } from '../../../../marketer/components/blog-detail/blog-content/blog-content.component';
import { Subject } from 'rxjs';
import { LocationService } from '../../../services/location/location.service';
import { TourService } from '../../../services/tour.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../core/services/ssr.service';
import { After } from 'v8';

interface Meal {
  id: string;
  name: string;
}

interface Location {
  id: number;
  name: string;
}

@Component({
  selector: 'app-update-tour-day',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    BlogContentComponent,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    NgSelectModule
  ],
  templateUrl: './update-tour-day.component.html',
  styleUrls: ['./update-tour-day.component.css']
})
export class UpdateTourDayComponent implements AfterViewInit{
  @Input() tourId: string | null = null;
  @Input() day: any | null = null;
  @Output() tourChange: EventEmitter<any> = new EventEmitter<any>();
  editTourForm!: FormGroup;
  description: string | null = null;
  dropdownList: Location[] = [];
  dropdownMealList: Meal[] = [];
  dropdownServiceList: Meal[] = [];
  locations: Location[] = [];
  searchText$ = new Subject<string>();
  dropdownSettings: IDropdownSettings = {};
  modal: Modal | null = null;

  mealOptions: Meal[] = [
    { id: 'breakfast', name: 'Bữa Sáng' },
    { id: 'lunch', name: 'Bữa Trưa' },
    { id: 'dinner', name: 'Bữa Tối' },
  ];

  serviceOptions: Meal[] = [
    { id: 'Restaurant', name: 'Nhà Hàng' },
    { id: 'Transport', name: 'Vận Chuyển' },
    { id: 'Hotel', name: 'Khách Sạn' },
    { id: 'Activity', name: 'Hoạt Động' },
  ];

  constructor(
    private fb: FormBuilder,
    private tourService: TourService,
    private locationService: LocationService,
    private ssrService: SsrService
  ) { }

  ngOnInit(): void {
    this.editTourForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      mealPlan: [[], Validators.required], // Định dạng mảng
      locationId: [null, [Validators.required, Validators.min(0)]],
      serviceCategories: [[], Validators.required], // Định dạng mảng
    });
  
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      enableCheckAll: false,
      itemsShowLimit: 3,
      searchPlaceholderText: 'Tìm kiếm dịch vụ...',
    };
  
    this.mealOptions = this.mealOptions || [];
    this.serviceOptions = this.serviceOptions || [];
    this.dropdownMealList = this.mealOptions;
    this.dropdownServiceList = this.serviceOptions;
  }
  
  parseMealPlan(mealPlan: string): Meal[] {
    const match = mealPlan.match(/^(\d+)\(([^)]+)\)$/);
    if (!match) return [];
  
    const mealIds = match[2].split(',').map(id => id.trim());
    return this.mealOptions.filter(meal => mealIds.includes(meal.id));
  }

  mapDataToForm(day: any) {
    if (this.day) {
      this.editTourForm.patchValue({
        title: this.day.title,
        content: this.day.content,
        mealPlan: this.parseMealPlan(this.day.mealPlan),
        locationId: this.day.location.id,
        serviceCategories: this.day.serviceCategories, // Đã là mảng, không cần parse
      });
    }
  }
  

  ngAfterViewInit() {
    const doc = this.ssrService.getDocument();
    if (!doc) return;
    const modalElement = document.getElementById('editTourDayModal');
    if (modalElement) {
      this.modal = new Modal(modalElement);
    }
    this.loadLocations();
  }

  parseServiceCategories(serviceCategories: string): Meal[] {
    const serviceIds: string[] = serviceCategories.match(/\d+/g) || [];
    return this.serviceOptions.filter(service => serviceIds.includes(service.id));
  }

  onSubmit() {
    const formValue = this.editTourForm.value;
    const mealIds = formValue.mealPlan.map((meal: any) => meal.id);
    const mealPlanFormatted = `${mealIds.length}(${mealIds.join(', ')})`;
    const serviceCategoriesFormatted = formValue.serviceCategories.map((service: any) => service.id);

    const payload = {
      title: formValue.title,
      content: formValue.content,
      mealPlan: mealPlanFormatted, // Định dạng lại chuỗi mealPlan
      locationId: formValue.locationId,
      serviceCategories: serviceCategoriesFormatted
    };

    this.tourService.updateTourDay(this.tourId!, this.day.id, payload).subscribe({
      next: (response) => {
        this.tourChange.emit(response.data);
      },
      error: (error) => {
        console.error('Error updating tour day', error);
      },
    });
  }

  showModal() {
    this.modal?.show();
  }

  closeModal() {
    this.modal?.hide();
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
}