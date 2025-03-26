import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../core/services/ssr.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TourDiscountService } from '../../../services/discount.service';

interface Location {
  id: number;
  name: string;
}

interface ServiceProvider {
  id: number;
  name: string;
}

@Component({
  selector: 'app-add-hotel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './add-hotel.component.html',
  styleUrls: ['./add-hotel.component.css']
})
export class AddHotelComponent implements AfterViewInit {
  @Input() days: number[] = [1, 2, 3, 4, 5];
  @Input() tourId: number = 0;
  @Input() serviceId: number | null = null; // To determine if we're updating
  @Output() hotelAdded = new EventEmitter<any>();

  modal: Modal | null = null;
  addHotelForm!: FormGroup;
  locations: Location[] = [];
  providers: ServiceProvider[] = [];
  hotels: { name: string, netPrice: number }[] = [];

  prices: { guests: string, sellingPrice: number }[] = [
    { guests: '2-5 khách', sellingPrice: 0 },
    { guests: '6-10 khách', sellingPrice: 0 },
    { guests: '11-20 khách', sellingPrice: 0 }
  ];

  constructor(
    private ssrService: SsrService,
    private fb: FormBuilder,
    private tourDiscountService: TourDiscountService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.fetchLocations();
    if (this.serviceId) {
      this.fetchServiceDetails();
    }
  }

  initializeForm() {
    this.addHotelForm = this.fb.group({
      selectedDay: [1],
      selectedLocation: [null],
      selectedProvider: [null],
      selectedHotel: [''],
      netPrice: [0],
      prices: this.fb.array(this.prices.map(price => this.fb.group({
        guests: [price.guests],
        sellingPrice: [price.sellingPrice]
      })))
    });
  }

  get pricesFormArray() {
    return this.addHotelForm.get('prices') as FormArray;
  }

  ngAfterViewInit() {
    const doc = this.ssrService.getDocument();
    if (doc) {
      const modalElement = document.getElementById('addHotelModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
      }
    }
  }

  fetchLocations() {
    this.tourDiscountService.getLocations().subscribe({
      next: (response: any) => {
        if (response.code === 0) {
          this.locations = response.data.items.map((item: any) => ({
            id: item.id,
            name: item.name
          }));
          if (this.locations.length > 0 && !this.serviceId) {
            this.addHotelForm.patchValue({ selectedLocation: this.locations[0].id });
            this.fetchServiceProviders();
          }
        }
      },
      error: (error: any) => {
        console.error('Error fetching locations:', error);
      }
    });
  }

  fetchServiceProviders() {
    const locationId = this.addHotelForm.get('selectedLocation')?.value;
    if (locationId) {
      this.tourDiscountService.getServiceProviders(this.tourId, locationId, 'Hotel').subscribe({
        next: (response: any) => {
          if (response.code === 0) {
            this.providers = response.data.serviceProviders.map((provider: any) => ({
              id: provider.id,
              name: provider.name
            }));
            if (this.providers.length > 0 && !this.serviceId) {
              this.addHotelForm.patchValue({ selectedProvider: this.providers[0].id });
              this.fetchHotels();
            }
          }
        },
        error: (error: any) => {
          console.error('Error fetching service providers:', error);
        }
      });
    }
  }

  fetchHotels() {
    // This would typically be another API call to fetch hotels based on the provider
    // For now, we'll use the existing static data, but you can replace this with an API call
    const selectedProvider = this.providers.find(p => p.id === this.addHotelForm.get('selectedProvider')?.value);
    if (selectedProvider) {
      // Replace this with an API call to fetch hotels for the selected provider
      this.hotels = [
        { name: 'Hotel A', netPrice: 1500000 },
        { name: 'Hotel B', netPrice: 2000000 }
      ];
      if (this.hotels.length > 0 && !this.serviceId) {
        this.addHotelForm.patchValue({
          selectedHotel: this.hotels[0].name,
          netPrice: this.hotels[0].netPrice
        });
      }
    }
  }

  fetchServiceDetails() {
    if (this.serviceId && this.tourId) {
      this.tourDiscountService.getServiceDetails(this.tourId, this.serviceId).subscribe({
        next: (response: any) => {
          if (response.code === 0) {
            const service = response.data;
            this.addHotelForm.patchValue({
              selectedDay: service.dayNumber,
              selectedLocation: service.locationId,
              selectedProvider: service.serviceProviderId,
              selectedHotel: service.name,
              netPrice: service.nettPrice
            });
            this.pricesFormArray.clear();
            Object.values(service.paxPrices).forEach((pax: any) => {
              this.pricesFormArray.push(this.fb.group({
                guests: [pax.paxRange],
                sellingPrice: [pax.price]
              }));
            });
            this.fetchServiceProviders();
          }
        },
        error: (error: any) => {
          console.error('Error fetching service details:', error);
        }
      });
    }
  }

  onLocationChange() {
    this.fetchServiceProviders();
  }

  onProviderChange() {
    this.fetchHotels();
  }

  onHotelChange() {
    const selectedHotelName = this.addHotelForm.get('selectedHotel')?.value;
    const selectedHotel = this.hotels.find(h => h.name === selectedHotelName);
    if (selectedHotel) {
      this.addHotelForm.patchValue({ netPrice: selectedHotel.netPrice });
    }
  }

  onSubmit() {
    if (this.addHotelForm.valid) {
      const formData = {
        day: this.addHotelForm.get('selectedDay')?.value,
        locationId: this.addHotelForm.get('selectedLocation')?.value,
        serviceProviderId: this.addHotelForm.get('selectedProvider')?.value,
        name: this.addHotelForm.get('selectedHotel')?.value,
        netPrice: this.addHotelForm.get('netPrice')?.value,
        prices: this.pricesFormArray.value,
        status: 'ACTIVE'
      };
      this.hotelAdded.emit({ formData, isUpdate: !!this.serviceId });
      this.modal?.hide();
    }
  }
}