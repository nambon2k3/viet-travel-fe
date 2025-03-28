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
  selector: 'app-add-restaurant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './add-restaurant.component.html',
  styleUrls: ['./add-restaurant.component.css']
})
export class AddRestaurantComponent {
  @Input() days: number[] = [];
  @Input() tourId: number = 0;
  @Input() serviceId: number | null = null;
  @Input() prices: PaxOption[] = [];
  @Output() restaurantAdded = new EventEmitter<any>();

  modal: Modal | null = null;
  addRestaurantForm!: FormGroup;
  @Input() locations = signal<any[]>([]);
  providers = signal<any[]>([]);
  restaurants = signal<any[]>([]);

  constructor(
    private ssrService: SsrService,
    private fb: FormBuilder,
    private tourDiscountService: TourDiscountService
  ) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.addRestaurantForm = this.fb.group({
      selectedDay: [this.days.length > 0 ? this.days[0] : 1],
      selectedLocation: [null],
      selectedProvider: [null],
      selectedRestaurant: [''],
      description: [''],
      netPrice: [0],
      roomDetail: this.fb.group({
        capacity: [0],
        availableQuantity: [0],
        facilities: ['']
      }),
      paxPrices: this.fb.array([])
    });
  }


  initPaxPrices() {
    const paxPricesArray = this.addRestaurantForm.get('paxPrices') as FormArray;
    paxPricesArray.clear();
    Object.values(this.prices).forEach((pax: any) => {
      paxPricesArray.push(
        this.fb.group({
          paxId: [pax.id],
          paxRange: [pax.paxRange],
          price: [0]
        })
      );
    });
  }

  get paxPrices(): FormArray {
    return this.addRestaurantForm.get('paxPrices') as FormArray;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prices'] && changes['prices'].currentValue) {
      if (this.addRestaurantForm) {
        this.initPaxPrices();
      }
    }
  }

  fetchServiceProviders() {
    const locationId = this.addRestaurantForm.get('selectedLocation')?.value;
    if (locationId) {
      this.tourDiscountService.getServiceProviders(this.tourId, locationId, 'Restaurant').subscribe({
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

  fetchRestaurants() {
    const locationId = this.addRestaurantForm.get('selectedLocation')?.value;
    const providerId = this.addRestaurantForm.get('selectedProvider')?.value;
    if (locationId && providerId) {
      this.tourDiscountService.getServices(this.tourId, locationId, providerId, "Restaurant").subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            const providerData = response.data;
            if (providerData) {
              const mappedRestaurants = providerData.availableServices.map((service: any) => ({
                id: service.id,
                name: service.name,
                netPrice: service.nettPrice,
                description: service.description || '',
                roomDetail: service.roomDetail || { capacity: 0, availableQuantity: 0, facilities: '' }
              }));
              this.restaurants.set(mappedRestaurants);
            }
          }
        },
        error: (error: any) => {
          console.error('Error fetching restaurants:', error);
        }
      });
    }
  }



  fetchRestaurantDetails() {
    if (this.serviceId && this.tourId) {
      if (!this.addRestaurantForm) return;
      this.addRestaurantForm.reset();
      this.tourDiscountService.getServiceDetails(this.tourId, this.serviceId).subscribe({
        next: (response: ServiceDetailResponse) => {
          if (response.code === 200) {
            const restaurant = response.data;

            const paxPricesArray = this.addRestaurantForm.get('paxPrices') as FormArray;
            paxPricesArray.clear();

            Object.values(restaurant.paxPrices).forEach((pax: any) => {
              paxPricesArray.push(
                this.fb.group({
                  paxId: [pax.paxId],
                  paxRange: [pax.paxRange],
                  price: [pax.price || 0]
                })
              );
            });

            // Cập nhật các trường khác
            this.addRestaurantForm.patchValue({
              selectedDay: restaurant.dayNumber,
              selectedLocation: restaurant.locationId,
              selectedProvider: restaurant.serviceProviderId,
              selectedRestaurant: restaurant.id,
              description: restaurant.description || '',
              netPrice: restaurant.nettPrice,
              roomDetail: {
                capacity: restaurant.roomDetail?.capacity || 0,
                availableQuantity: restaurant.roomDetail?.availableQuantity || 0,
                facilities: restaurant.roomDetail?.facilities || ''
              }
            });

            this.fetchServiceProviders();
            this.fetchRestaurants();
          }
        },
        error: (error: any) => {
          console.error('Error fetching restaurant details:', error);
        }
      });
    }
  }


  onLocationChange() {
    this.fetchServiceProviders();
  }

  onProviderChange() {
    this.fetchRestaurants();
  }

  onRestaurantChange() {
    const selectedRestaurantId = this.addRestaurantForm.get('selectedRestaurant')?.value;
    const selectedRestaurant = this.restaurants().find(h => h.id === selectedRestaurantId);
    if (selectedRestaurant) {
      this.addRestaurantForm.patchValue({
        description: selectedRestaurant.description,
        netPrice: selectedRestaurant.netPrice,
        roomDetail: {
          capacity: selectedRestaurant.roomDetail.capacity,
          availableQuantity: selectedRestaurant.roomDetail.availableQuantity,
          facilities: selectedRestaurant.roomDetail.facilities
        }
      });
    }
  }

  createRestaurant() {
    if (this.addRestaurantForm.valid) {
      const formValue = this.addRestaurantForm.value;
      const paxPrices = (formValue.paxPrices as any[]).reduce((acc: { [key: string]: number }, pax) => {
        acc[pax.paxId] = pax.price;
        return acc;
      }, {});

      const formData = {
        serviceId: formValue.selectedRestaurant,
        dayNumber: formValue.selectedDay,
        quantity: 1,
        sellingPrice: formValue.netPrice,
        nettPrice: formValue.netPrice,
        paxPrices: paxPrices,
        //roomDetail: formValue.roomDetail,
        mealDetail: null,
        transportDetail: null
      };

      this.tourDiscountService.addService(this.tourId, formData).subscribe({
        next: (response: any) => {
          if (response.code === 201) {
            const newService: Service = {
              id: response.data.id || 0,
              category: 'Restaurant',
              name: formValue.selectedRestaurant,
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
              //roomDetail: formData.roomDetail
            };
            this.restaurantAdded.emit({ service: newService, isUpdate: false });
            this.modal?.hide();
          }
        },
        error: (error: any) => {
          console.error('Error creating restaurant:', error);
        }
      });
    }
  }

  updateRestaurant() {
    if (this.addRestaurantForm.valid && this.serviceId) {
      const formValue = this.addRestaurantForm.value;
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
              category: 'Restaurant',
              name: formValue.selectedRestaurant,
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
            this.restaurantAdded.emit({ service: updatedService, isUpdate: true });
            this.modal?.hide();
          }
        },
        error: (error: any) => {
          console.error('Error updating restaurant:', error);
        }
      });
    }
  }

  onSubmit() {
    if (this.serviceId) {
      this.updateRestaurant();
    } else {
      this.createRestaurant();
    }
  }

  showModal() {
    const doc = this.ssrService.getDocument();
    if (doc) {
      const modalElement = document.getElementById('addRestaurantModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
        this.modal.show();
        this.addRestaurantForm.reset();
      }
    }
  }

  onCancel() {
    this.modal?.hide();
  }
}