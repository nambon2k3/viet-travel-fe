import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BlogContentComponent } from '../../../marketer/components/blog-detail/blog-content/blog-content.component';
import { NgMultiSelectDropDownModule, IDropdownSettings } from 'ng-multiselect-dropdown';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LocationService } from '../../services/location/location.service';
import { TourService } from '../../services/tour.service';
import { TourDetailHOB } from '../../../../../core/models/tour.model';

@Component({
  selector: 'app-tour-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,
    BlogContentComponent,
  ],
  templateUrl: './tour-details.component.html',
  styleUrls: ['./tour-details.component.css'],
})
export class TourDetailsComponent implements OnInit {
  highlight: string | null = null;
  editTourForm!: FormGroup;
  tourId: string | null = null;
  locations: Location[] = [];
  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings: IDropdownSettings = {};
  searchText$ = new Subject<string>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tourService: TourService,
    private locationService: LocationService 
  ) {}

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'name',
      allowSearchFilter: true,
      enableCheckAll: false,
      itemsShowLimit: 1,
      searchPlaceholderText: 'Tìm kiếm địa điểm...',
    };

    this.editTourForm = this.fb.group({
      id: [null],
      tourName: [null, Validators.required],
      authorName: [null],
      destination: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      duration: [null, Validators.required],
      nights: [null, Validators.required],
      highlights: [null, Validators.required],
      note: [null, Validators.required],
    });

    this.tourId = this.route.snapshot.queryParamMap.get('id');
    const authorName = this.route.snapshot.queryParamMap.get('authorName');

    if (this.tourId) {
      this.loadTourDetails(this.tourId);
    }

    if (authorName) {
      this.editTourForm.patchValue({ authorName });
    }

    this.loadLocations();

    this.searchText$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(), 
        switchMap((keyword) => this.locationService.getLocationByPage(0, 100, keyword))
      )
      .subscribe({
        next: (response) => {
          this.locations = response.data.items;
          this.dropdownList = this.locations;
        },
        error: (err) => {
          console.error('Failed to search locations:', err);
        },
      });
  }

  loadTourDetails(id: string): void {
    this.tourService.getTourById(id).subscribe({
      next: (response : any) => {
        const tourData: TourDetailHOB = response.data;
        this.mapTourDataToForm(tourData);
      },
      error: (err : any) => {
        console.error('Failed to load tour details:', err);
      },
    });
  }

  loadLocations(keyword: string = ''): void {
    this.locationService.getLocationByPage(0, 100, keyword).subscribe({
      next: (response : any) => {
        this.locations = response.data.items;
        this.dropdownList = this.locations;
      },
      error: (err : any) => {
        console.error('Failed to load locations:', err);
      },
    });
  }

  mapTourDataToForm(tour: TourDetailHOB): void {
    const firstSchedule = tour.tourSchedules && tour.tourSchedules.length > 0 ? tour.tourSchedules[0] : null;

    const startDate = firstSchedule ? new Date(firstSchedule.startDate).toISOString().split('T')[0] : '';
    const endDate = firstSchedule ? new Date(firstSchedule.endDate).toISOString().split('T')[0] : '';

    this.editTourForm.patchValue({
      id: tour.id,
      tourName: tour.name,
      destination: tour.departLocation?.name || '',
      startDate: startDate,
      endDate: endDate,
      duration: tour.numberDays,
      nights: tour.numberNight,
      highlights: tour.highlights,
      note: tour.note,
    });

    if (tour.departLocation) {
      this.selectedItems = [{ id: tour.departLocation.id, name: tour.departLocation.name }];
    }

    this.highlight = tour.highlights;
  }

  onCancel(): void {
    this.router.navigate(['/head-business/list-tour']);
  }

  onSubmit(): void {
    if (this.editTourForm.valid) {
      const formData = this.editTourForm.value;
      formData.departLocation = {
        id: this.selectedItems.length > 0 ? this.selectedItems[0].id : null,
        name: formData.destination,
      };
      this.tourService.updateTour(formData).subscribe({
        next: (response : any) => {
          console.log('Tour updated successfully:', response);
          this.router.navigate(['/head-business/list-tour']);
        },
        error: (err : any) => {
          console.error('Failed to update tour:', err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  onSearch(event: any): void {
    const keyword = event.target?.value || '';
    this.searchText$.next(keyword);
  }

  onItemSelect(item: any): void {
    this.editTourForm.patchValue({ destination: item.name });
  }

  onItemDeSelect(item: any): void {
    this.editTourForm.patchValue({ destination: null });
  }
}