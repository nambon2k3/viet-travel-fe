import { Component, Input, Output, EventEmitter, AfterViewInit, signal, SimpleChanges } from '@angular/core';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../core/services/ssr.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TourDiscountService } from '../../../services/discount.service';

interface PriceRange {
  [key: string]: number;
}

interface PaxOption {
  id: number;
  minPax: number;
  maxPax: number;
  paxRange: string;
}

interface RoomDetail {
  id: number;
  capacity: number;
  availableQuantity: number;
  facilities: string;
}

interface Service {
  id: number;
  category: string;
  name: string;
  description: string;
  dayNumber: number;
  status: string;
  netPrice: number;
  sellingPrice: number;
  quantity: number;
  prices: PriceRange;
  locationName: string;
  locationId: number;
  serviceProviderName: string;
  serviceProviderId: number;
  startDate: string;
  endDate: string;
  roomDetail?: RoomDetail;
}

interface ServiceDetailResponse {
  code: number;
  message: string;
  data: {
    id: number;
    name: string;
    description: string;
    dayNumber: number;
    status: string;
    nettPrice: number;
    sellingPrice: number;
    locationId: number;
    locationName: string;
    serviceProviderId: number;
    serviceProviderName: string;
    categoryName: string;
    startDate: string;
    endDate: string;
    paxPrices: {
      [key: string]: {
        paxId: number;
        minPax: number;
        maxPax: number;
        paxRange: string;
        price?: number;
      };
    };
    roomDetail?: RoomDetail;
  };
}

@Component({
  selector: 'app-add-activity',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css']
})
export class AddActivityComponent {
  @Input() days: number[] = [];
  @Input() tourId: number = 0;
  @Input() serviceId: number | null = null;
  @Input() prices: PaxOption[] = [];
  @Output() activityAdded = new EventEmitter<any>();

  modal: Modal | null = null;
  addActivityForm!: FormGroup;
  locations = signal<any[]>([]);
  providers = signal<any[]>([]);
  activitys = signal<any[]>([]);

  constructor(
    private ssrService: SsrService,
    private fb: FormBuilder,
    private tourDiscountService: TourDiscountService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.fetchLocations();
  }

  initializeForm() {
    this.addActivityForm = this.fb.group({
      selectedDay: [this.days.length > 0 ? this.days[0] : 1],
      selectedLocation: [null],
      selectedProvider: [null],
      selectedActivity: [''],
      description: [''],
      netPrice: [0],
      roomDetail: this.fb.group({
        capacity: [0],
        availableQuantity: [0],
        facilities: ['']
      }),
      paxPrices: this.fb.array([])
    });
    this.initPaxPrices();
  }


  initPaxPrices() {
    console.log('Initializing Pax Prices:', this.prices);
    const paxPricesArray = this.addActivityForm.get('paxPrices') as FormArray;
    paxPricesArray.clear();
    Object.values(this.prices).forEach((pax: any) => {
      paxPricesArray.push(
        this.fb.group({
          paxId: [pax.paxId],
          paxRange: [pax.paxRange],
          price: [0]
        })
      );
    });
  }

  get paxPrices(): FormArray {
    return this.addActivityForm.get('paxPrices') as FormArray;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prices'] && changes['prices'].currentValue) {
      if (this.addActivityForm) {
        this.initPaxPrices();
      }
    }
  }

  fetchLocations() {
    this.tourDiscountService.getLocations(this.tourId).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          const mappedLocations = response.data.items.map((item: any) => ({
            id: item.id,
            name: item.name
          }));
          this.locations.set(mappedLocations);
        }
      },
      error: (error: any) => {
        console.error('Error fetching locations:', error);
      }
    });
  }

  fetchServiceProviders() {
    const locationId = this.addActivityForm.get('selectedLocation')?.value;
    if (locationId) {
      this.tourDiscountService.getServiceProviders(this.tourId, locationId, 'Activity').subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            const mappedProviders = response.data.serviceProviders.map((provider: any) => ({
              id: provider.id,
              name: provider.name
            }));
            this.providers.set(mappedProviders);
          }
        },
        error: (error: any) => {
          console.error('Error fetching service providers:', error);
        }
      });
    }
  }

  fetchActivitys() {
    const locationId = this.addActivityForm.get('selectedLocation')?.value;
    const providerId = this.addActivityForm.get('selectedProvider')?.value;
    if (locationId && providerId) {
      this.tourDiscountService.getServices(this.tourId, locationId, providerId, "Activity").subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            const providerData = response.data;
            if (providerData) {
              const mappedActivitys = providerData.availableServices.map((service: any) => ({
                id: service.id,
                name: service.name,
                netPrice: service.nettPrice,
                description: service.description || '',
                roomDetail: service.roomDetail || { capacity: 0, availableQuantity: 0, facilities: '' }
              }));
              this.activitys.set(mappedActivitys);
            }
          }
        },
        error: (error: any) => {
          console.error('Error fetching activitys:', error);
        }
      });
    }
  }



  fetchActivityDetails() {
    if (this.serviceId && this.tourId) {
      if (!this.addActivityForm) return;
      this.addActivityForm.reset();
      this.tourDiscountService.getServiceDetails(this.tourId, this.serviceId).subscribe({
        next: (response: ServiceDetailResponse) => {
          if (response.code === 200) {
            const activity = response.data;

            const paxPricesArray = this.addActivityForm.get('paxPrices') as FormArray;
            paxPricesArray.clear();

            Object.values(activity.paxPrices).forEach((pax: any) => {
              paxPricesArray.push(
                this.fb.group({
                  paxId: [pax.paxId],
                  paxRange: [pax.paxRange],
                  price: [pax.price || 0]
                })
              );
            });

            // Cập nhật các trường khác
            this.addActivityForm.patchValue({
              selectedDay: activity.dayNumber,
              selectedLocation: activity.locationId,
              selectedProvider: activity.serviceProviderId,
              selectedActivity: activity.id,
              description: activity.description || '',
              netPrice: activity.nettPrice,
              roomDetail: {
                capacity: activity.roomDetail?.capacity || 0,
                availableQuantity: activity.roomDetail?.availableQuantity || 0,
                facilities: activity.roomDetail?.facilities || ''
              }
            });

            this.fetchServiceProviders();
            this.fetchActivitys();
          }
        },
        error: (error: any) => {
          console.error('Error fetching activity details:', error);
        }
      });
    }
  }


  onLocationChange() {
    this.fetchServiceProviders();
  }

  onProviderChange() {
    this.fetchActivitys();
  }

  onActivityChange() {
    const selectedActivityId = this.addActivityForm.get('selectedActivity')?.value;
    const selectedActivity = this.activitys().find(h => h.id === selectedActivityId);
    if (selectedActivity) {
      this.addActivityForm.patchValue({
        description: selectedActivity.description,
        netPrice: selectedActivity.netPrice,
        roomDetail: {
          capacity: selectedActivity.roomDetail.capacity,
          availableQuantity: selectedActivity.roomDetail.availableQuantity,
          facilities: selectedActivity.roomDetail.facilities
        }
      });
    }
  }

  createActivity() {
    if (this.addActivityForm.valid) {
      const formValue = this.addActivityForm.value;

      const paxPrices = (formValue.paxPrices as any[]).reduce((acc: { [key: string]: number }, pax) => {
        acc[pax.paxId] = pax.price;
        return acc;
      }, {});

      const formData = {
        serviceId: formValue.selectedActivity,
        dayNumber: formValue.selectedDay,
        quantity: 1,
        sellingPrice: formValue.netPrice,
        nettPrice: formValue.netPrice,
        paxPrices: paxPrices,
        roomDetail: formValue.roomDetail,
        mealDetail: null,
        transportDetail: null
      };

      this.tourDiscountService.addService(this.tourId, formData).subscribe({
        next: (response: any) => {
          if (response.code === 201) {
            const newService: Service = {
              id: response.data.id || 0,
              category: 'Activity',
              name: formValue.selectedActivity,
              description: formValue.description,
              dayNumber: formData.dayNumber,
              status: 'ACTIVE',
              netPrice: formData.nettPrice,
              sellingPrice: formData.sellingPrice,
              quantity: formData.quantity,
              prices: formData.paxPrices,
              locationName: response.data.locationName || '',
              locationId: formValue.selectedLocation,
              serviceProviderName: response.data.serviceProviderName || '',
              serviceProviderId: formValue.selectedProvider,
              startDate: response.data.startDate || '',
              endDate: response.data.endDate || '',
              roomDetail: formData.roomDetail
            };
            this.activityAdded.emit({ service: newService, isUpdate: false });
            this.modal?.hide();
          }
        },
        error: (error: any) => {
          console.error('Error creating activity:', error);
        }
      });
    }
  }

  updateActivity() {
    if (this.addActivityForm.valid && this.serviceId) {
      const formValue = this.addActivityForm.value;
      const paxPrices = (formValue.paxPrices as any[]).reduce((acc: { [key: string]: number }, pax) => {
        acc[pax.paxId] = pax.price;
        return acc;
      }, {});

      const formData = {
        serviceId: this.serviceId,
        dayNumber: formValue.selectedDay,
        quantity: 1,
        sellingPrice: formValue.netPrice,
        nettPrice: formValue.netPrice,
        paxPrices: paxPrices,
        // roomDetail: formValue.roomDetail,
        mealDetail: null,
        transportDetail: null
      };

      this.tourDiscountService.updateService(this.tourId, this.serviceId, formData).subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            const updatedService: Service = {
              id: this.serviceId!,
              category: 'Activity',
              name: formValue.selectedActivity,
              description: formValue.description,
              dayNumber: formData.dayNumber,
              status: 'ACTIVE',
              netPrice: formData.nettPrice,
              sellingPrice: formData.sellingPrice,
              quantity: formData.quantity,
              prices: formData.paxPrices,
              locationName: response.data.locationName || '',
              locationId: formValue.selectedLocation,
              serviceProviderName: response.data.serviceProviderName || '',
              serviceProviderId: formValue.selectedProvider,
              startDate: response.data.startDate || '',
              endDate: response.data.endDate || '',
              // roomDetail: formData.roomDetail
            };
            this.activityAdded.emit({ service: updatedService, isUpdate: true });
            this.modal?.hide();
          }
        },
        error: (error: any) => {
          console.error('Error updating activity:', error);
        }
      });
    }
  }

  onSubmit() {
    if (this.serviceId) {
      this.updateActivity();
    } else {
      this.createActivity();
    }
  }

  showModal() {
    const doc = this.ssrService.getDocument();
    if (doc) {
      const modalElement = document.getElementById('addActivityModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
        this.modal.show();
        this.addActivityForm.reset();
      }
    }
  }

  onCancel() {
    this.modal?.hide();
  }
}