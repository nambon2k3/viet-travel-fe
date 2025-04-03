import { AfterViewInit, Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TableActionComponent } from './table-action/table-action.component';
import { TableHeaderComponent } from './table-header/table-header.component';
import { TableRowComponent } from './table-row/table-row.component';
import { SpinnerComponent } from '../../../../../shared/components/spinner/spinner.component';
import { TableFooterComponent } from '../../../../../shared/components/table/table-footer/table-footer.component';
import { TourService } from '../../services/tour.service';
import { FormsModule } from '@angular/forms';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BlogContentComponent } from '../../../marketer/components/blog-detail/blog-content/blog-content.component';
import { UserStorageService } from '../../../../../core/services/user-storage/user-storage.service';
import { Modal } from 'flowbite';
import { AddTransportationComponent } from "../../../head-of-business/components/tour-discount/add-transportation/add-transportation.component";
@Component({
  selector: 'app-list-tour-private',
  imports: [TableActionComponent,
    TableFooterComponent,
    TableHeaderComponent,
    TableRowComponent,
    SpinnerComponent,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgMultiSelectDropDownModule,
    BlogContentComponent,
    SpinnerComponent],
  templateUrl: './list-tour-private.component.html',
  styleUrl: './list-tour-private.component.css'
})
export class ListTourPrivateComponent implements AfterViewInit {
  totalItems = 0;
  page = 0;
  size = 20;
  totalPages = signal(0)
  isLoading: boolean = false;

  tourDatas: any;

  dropdownList: any = [];
  dropdownSettings: IDropdownSettings = {};
  selectedItems: any = [];

  createTourModal: Modal | null = null;

  ngAfterViewInit(): void {
    this.createTourModal = new Modal(document.getElementById('create-tour-modal'));
  }

  closeModal() {
    this.createTourModal?.hide();
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }
  }

  // Store filters to persist data across pages
  keyword = '';
  isDeleted?: boolean;
  sortField = 'createdAt';
  sortDirection = 'desc';

  constructor(
    private router: Router,
    private tourService: TourService,
    private fb: FormBuilder,
    private bookingService: BookingService,
    private userStorageService: UserStorageService
  ) {

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      enableCheckAll: false, // disables "Select All"
      itemsShowLimit: 5,
      searchPlaceholderText: 'Search Tags Name',
      allowSearchFilter: true
    };


    this.tourForm = this.fb.group({
      name: ['', Validators.required],
      numberDays: [2, Validators.required],
      numberNights: [1, Validators.required],
      departLocation: ['', Validators.required],
      locations: ['', Validators.required],
      highlights: ['', Validators.required],
      note: [''],
      createdBy: [this.userStorageService.getUserId(), Validators.required],
      pax: [1, Validators.required],
    });

    this.tourForm.get('numberDays')?.valueChanges.subscribe((value: number) => {
      const numberNights = value > 2 ? value - 1 : 2;
      this.tourForm.patchValue({
        numberNights: numberNights
      }, { emitEvent: false }); // Prevent recursive loop
    });

  }

  onItemSelect(item: any) {
    console.log('Selected: ' + item.item_id);
  }

  onDeSelect(item: any) {
    console.log('Unselected: ' + item);
  }

  ngOnInit(): void {
    this.loadTours();
    this.loadLocations();
  }



  loadTours() {
    this.isLoading = true;
    this.tourService.getTourByPage(this.page, this.size, this.keyword, undefined, undefined, this.keyword, "PRIVATE").subscribe({
      next: (response) => {
        this.tourDatas = response.data.items;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  }

  locationDatas: any;

  loadLocations() {
    this.bookingService.getLocations().subscribe({
      next: (response) => {
        this.locationDatas = response.data;

        this.dropdownList = this.locationDatas.map((location: { id: string, name: string }) => {
          return {
            item_id: location.id,
            item_text: location.name
          };
        });

      },
      error: (error) => {
        console.log(error);
      }
    });
  }


  onPageChange(newPage: number): void {
    if (newPage >= 0 && newPage < this.totalPages()) {
      this.page = newPage;
      this.loadTours();
    }
  }

  // Change page size and reload data
  onPageSizeChange(newSize: number): void {
    this.size = newSize;
    this.page = 0; // Reset to first page
    this.loadTours();
  }

  onSearch(filters: any): void {
    this.keyword = filters.keyword || '';
    this.isDeleted = filters.status === '2' ? true : filters.status === '1' ? false : undefined;
    this.sortDirection = filters.order === '1' ? 'desc' : 'asc';
    this.page = 0; // Reset to first page on new search
    this.loadTours();
  }



  tourForm: FormGroup;

  errorMessages: string = '';

  showSuccess: boolean = false;


  onSubmit() {
    if (this.tourForm.valid) {
      console.log('Valid form: ', this.tourForm.value);

      this.tourForm.get('locations')?.setValue(this.selectedItems.map((location: any) => ({ id: location.item_id, name: location.item_text })));

      this.bookingService.createPrivateTour(this.tourForm.value).subscribe({
        next: (response) => {
          console.log('Create tour successfully: ', response);
          this.loadTours();
          this.tourForm.reset();
          console.log('Create tour successfully: ', response);
          this.triggerSuccess();
          this.errorMessages = '';

        },
        error: (error) => {
          this.errorMessages = error;
          console.log('Create tour failed: ', this.errorMessages);
        }
      });
    } else {
      this.tourForm.markAllAsTouched();
      console.log('Invalid form: ', this.tourForm.value);
    }
    this.resetItems();

    if(this.showSuccess) {
      this.closeModal();
    } 
  }

  resetItems(): void {
    this.selectedItems = this.selectedItems.map((location: any) => ({
      item_id: location.id,
      item_text: location.name
    }));
  }


  triggerSuccess() {
    this.showSuccess = true;

    
    // Hide warning after 3 seconds
    setTimeout(() => {
      this.showSuccess = false;
    }, 4000);
  }

}
