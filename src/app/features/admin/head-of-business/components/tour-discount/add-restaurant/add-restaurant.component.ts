import { Component, Input, Output, EventEmitter, AfterViewInit, signal, SimpleChanges } from '@angular/core';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../core/services/ssr.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TourDiscountService } from '../../../services/discount.service';

interface PaxPrice {
  paxId: number;
  minPax: number;
  maxPax: number;
  paxRange: string;
  price: number;
  serviceNettPrice: number;
  sellingPrice: number;
  fixedCost: number;
  extraHotelCost: number;
}

interface Service {
  id: number;
  name: string;
  dayNumber: number;
  status: string;
  nettPrice: number;
  sellingPrice: number;
  locationName: string;
  locationId: number;
  serviceProviderName: string;
  serviceProviderId: number;
  paxPrices: { [key: string]: PaxPrice };
}

interface PaxOption {
  id: number;
  minPax: number;
  maxPax: number;
  paxRange: string;
  fixedCost: number;
  sellingPrice: number;
  validFrom: string;
  validTo: string;
}

interface ServiceDetailResponse {
  code: number;
  message: string;
  data: {
    id: number;
    name: string;
    dayNumber: number;
    status: string;
    nettPrice: number;
    sellingPrice: number;
    locationId: number;
    locationName: string;
    serviceProviderId: number;
    serviceProviderName: string;
    paxPrices: { [key: string]: PaxPrice };
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
export class AddRestaurantComponent implements AfterViewInit {
  @Input() days: number[] = [];
  @Input() day: number | null = null;
  @Input() tourId: number = 0;
  @Input() serviceId: number | null = null;
  @Input() prices: PaxOption[] = [];
  @Input() locations = signal<any[]>([]);
  @Output() restaurantAdded = new EventEmitter<{ restaurant: Service, isUpdate: boolean }>();

  modal: Modal | null = null;
  addRestaurantForm!: FormGroup;
  providers = signal<any[]>([]);
  restaurants = signal<any[]>([]);

  constructor(
    private ssrService: SsrService,
    private fb: FormBuilder,
    private tourDiscountService: TourDiscountService
  ) {
    this.initializeForm();
  }

  ngAfterViewInit() {
    const doc = this.ssrService.getDocument();
    if (!doc) return;
    const modalElement = document.getElementById('addRestaurantModal');
    if (modalElement) {
      this.modal = new Modal(modalElement);
    }
  }

  initializeForm() {
    this.addRestaurantForm = this.fb.group({
      selectedDay: [this.days.length > 0 ? this.days[0] : 1],
      selectedLocation: [null],
      selectedProvider: [null],
      selectedRestaurant: [null],
      netPrice: [{ value: 0, disabled: true }],
      paxPrices: this.fb.array([])
    });
  }

  get paxPrices(): FormArray {
    return this.addRestaurantForm.get('paxPrices') as FormArray;
  }

  initPaxPrices() {
    const paxPricesArray = this.paxPrices;
    paxPricesArray.clear();
    this.prices.forEach(pax => {
      paxPricesArray.push(
        this.fb.group({
          paxId: [pax.id],
          paxRange: [pax.paxRange],
          sellingPrice: [pax.sellingPrice || 0]
        })
      );
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prices'] && changes['prices'].currentValue) {
      this.initPaxPrices();
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
      this.tourDiscountService.getServices(this.tourId, locationId, providerId, 'Restaurant').subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            const mappedRestaurants = response.data.availableServices.map((service: any) => ({
              id: service.id,
              name: service.name,
              nettPrice: service.nettPrice
            }));
            this.restaurants.set(mappedRestaurants);
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
      this.tourDiscountService.getServiceDetails(this.tourId, this.serviceId, this.day).subscribe({
        next: (response: ServiceDetailResponse) => {
          if (response.code === 200) {
            const restaurant = response.data;

            this.addRestaurantForm.patchValue({
              selectedDay: restaurant.dayNumber,
              selectedLocation: restaurant.locationId,
              selectedProvider: restaurant.serviceProviderId,
              selectedRestaurant: restaurant.id,
              netPrice: restaurant.nettPrice
            });

            const paxPricesArray = this.paxPrices;
            paxPricesArray.clear();
            Object.values(restaurant.paxPrices).forEach(pax => {
              paxPricesArray.push(
                this.fb.group({
                  paxId: [pax.paxId],
                  paxRange: [pax.paxRange],
                  sellingPrice: [pax.sellingPrice || 0]
                })
              );
            });

            this.fetchServiceProviders();
            this.fetchRestaurants();
          }
        },
        error: (error: any) => {
          console.error('Error fetching restaurant details:', error);
        }
      });
    } else {
      this.initPaxPrices();
    }
  }

  onLocationChange() {
    this.addRestaurantForm.patchValue({ selectedProvider: null, selectedRestaurant: null });
    this.providers.set([]);
    this.restaurants.set([]);
    this.fetchServiceProviders();
  }

  onProviderChange() {
    this.addRestaurantForm.patchValue({ selectedRestaurant: null });
    this.restaurants.set([]);
    this.fetchRestaurants();
  }

  onRestaurantChange() {
    const selectedRestaurantId = this.addRestaurantForm.get('selectedRestaurant')?.value;
    const selectedRestaurant = this.restaurants().find(h => h.id === selectedRestaurantId);
    if (selectedRestaurant) {
      this.addRestaurantForm.patchValue({
        netPrice: selectedRestaurant.nettPrice
      });
    }
  }

  onSubmit() {
    if (this.addRestaurantForm.valid) {
      const formValue = this.addRestaurantForm.getRawValue(); // Use getRawValue to include disabled fields
      const paxPrices = formValue.paxPrices.reduce((acc: { [key: string]: PaxPrice }, pax: any) => {
        acc[pax.paxRange] = {
          paxId: pax.paxId,
          minPax: this.prices.find(p => p.paxRange === pax.paxRange)?.minPax || 0,
          maxPax: this.prices.find(p => p.paxRange === pax.paxRange)?.maxPax || 0,
          paxRange: pax.paxRange,
          price: 0, // Assuming price is not used here
          serviceNettPrice: formValue.netPrice,
          sellingPrice: pax.sellingPrice,
          fixedCost: 0, // Adjust if needed from data
          extraHotelCost: 0 // Adjust if needed from data
        };
        return acc;
      }, {});

      const restaurantData: Service = {
        id: this.serviceId || formValue.selectedRestaurant,
        name: this.restaurants().find(h => h.id === formValue.selectedRestaurant)?.name || '',
        dayNumber: formValue.selectedDay,
        status: 'ACTIVE',
        nettPrice: formValue.netPrice,
        sellingPrice: 0, // Will be calculated based on paxPrices
        locationName: this.locations().find(l => l.id === formValue.selectedLocation)?.name || '',
        locationId: formValue.selectedLocation,
        serviceProviderName: this.providers().find(p => p.id === formValue.selectedProvider)?.name || '',
        serviceProviderId: formValue.selectedProvider,
        paxPrices: paxPrices
      };

      if (this.serviceId) {
        this.updateRestaurant(restaurantData);
      } else {
        this.createRestaurant(restaurantData);
      }
    }
  }

  createRestaurant(restaurantData: Service) {
    const payload = {
      serviceId: restaurantData.id,
      locationId: restaurantData.locationId,
      serviceProviderId: restaurantData.serviceProviderId,
      dayNumber: Number(restaurantData.dayNumber),
      paxPrices: Object.values(restaurantData.paxPrices).reduce((acc: any, pax) => {
        acc[pax.paxId] = pax.sellingPrice;
        return acc;
      }, {})
    };
  
    this.tourDiscountService.addService(this.tourId, payload).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.restaurantAdded.emit({ restaurant: restaurantData, isUpdate: false });
          this.modal?.hide();
        }
      },
      error: (error: any) => {
        console.error('Error creating restaurant:', error);
      }
    });
  }  

  updateRestaurant(restaurantData: Service) {
    const payload = {
      serviceId: restaurantData.id,
      locationId: restaurantData.locationId,
      serviceProviderId: restaurantData.serviceProviderId,
      dayNumber: Number(restaurantData.dayNumber),
      paxPrices: Object.values(restaurantData.paxPrices).reduce((acc: any, pax) => {
        acc[pax.paxId] = pax.sellingPrice;
        return acc;
      }, {})
    };

    this.tourDiscountService.updateService(this.tourId, this.serviceId!, payload).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.restaurantAdded.emit({ restaurant: restaurantData, isUpdate: true });
          this.modal?.hide();
        }
      },
      error: (error: any) => {
        console.error('Error updating restaurant:', error);
      }
    });
  }

  showModal() {
    this.fetchRestaurantDetails();
    this.modal?.show();
  }

  onCancel() {
    this.modal?.hide();
    this.addRestaurantForm.reset();
    this.initPaxPrices();
  }
}