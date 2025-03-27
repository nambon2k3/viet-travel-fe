import { Component, Input, Output, EventEmitter, AfterViewInit, signal, SimpleChanges } from '@angular/core';
import { Modal } from 'flowbite';
import { SsrService } from '../../../../../../core/services/ssr.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  @Input() days: number[] = [];
  @Input() tourId: number = 0;
  @Input() serviceId: number | null = null;
  @Input() prices: PaxOption[] = [];

  @Output() hotelAdded = new EventEmitter<any>();

  modal: Modal | null = null;
  addHotelForm!: FormGroup;
  locations = signal<any[]>([]);
  providers = signal<any[]>([]);
  hotels = signal<any[]>([]);

  constructor(
    private ssrService: SsrService,
    private fb: FormBuilder,
    private tourDiscountService: TourDiscountService
  ) { }

  ngOnInit() {
    console.log("serviceId: " + this.serviceId); // Debug để kiểm tra serviceId
    console.log("tourId: " + this.tourId);
    this.initializeForm();
    this.fetchLocations();
    if (this.serviceId) {
      this.fetchHotelDetails();
    }
  }

  initializeForm() {
    this.addHotelForm = this.fb.group({
      selectedDay: [this.days.length > 0 ? this.days[0] : 1],
      selectedLocation: [null],
      selectedProvider: [null],
      selectedHotel: [''],
      description: [''],
      netPrice: [0],
      roomDetail: this.fb.group({
        capacity: [0],
        availableQuantity: [0],
        facilities: ['']
      }),
      paxPrices: this.fb.array([]) // ✅ Sử dụng FormArray
    });

    // Initialize dynamic pax price controls
  this.initPaxPrices(); 
  }


  initPaxPrices() {
    const paxPricesArray = this.addHotelForm.get('paxPrices') as FormArray;
    this.prices.forEach((pax) => {
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
    return this.addHotelForm.get('paxPrices') as FormArray;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prices'] && changes['prices'].currentValue) {
      this.initPaxPrices();
    }
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
    const locationId = this.addHotelForm.get('selectedLocation')?.value;
    if (locationId) {
      this.tourDiscountService.getServiceProviders(this.tourId, locationId, 'Hotel').subscribe({
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

  fetchHotels() {
    const locationId = this.addHotelForm.get('selectedLocation')?.value;
    const providerId = this.addHotelForm.get('selectedProvider')?.value;
    if (locationId && providerId) {
      this.tourDiscountService.getServices(this.tourId, locationId, providerId).subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            const providerData = response.data;
            if (providerData) {
              const mappedHotels = providerData.availableServices.map((service: any) => ({
                id: service.id,
                name: service.name,
                netPrice: service.nettPrice,
                description: service.description || '',
                roomDetail: service.roomDetail || { capacity: 0, availableQuantity: 0, facilities: '' }
              }));
              this.hotels.set(mappedHotels);
            }
          }
        },
        error: (error: any) => {
          console.error('Error fetching hotels:', error);
        }
      });
    }
  }

  fetchHotelDetails() {
    if (this.serviceId && this.tourId) {
      this.tourDiscountService.getServiceDetails(this.tourId, this.serviceId).subscribe({
        next: (response: ServiceDetailResponse) => {
          if (response.code === 200) {
            const hotel = response.data;
  
            // Cập nhật FormArray paxPrices
            const paxPricesArray = this.addHotelForm.get('paxPrices') as FormArray;
            paxPricesArray.clear(); // Xóa các control cũ
            this.prices.forEach((pax, index) => {
              const paxPrice = Object.values(hotel.paxPrices).find(p => p.paxId === pax.id);
              paxPricesArray.push(
                this.fb.group({
                  paxId: [pax.id],
                  paxRange: [pax.paxRange],
                  price: [paxPrice?.price || 0]
                })
              );
            });
  
            // Cập nhật các trường khác
            this.addHotelForm.patchValue({
              selectedDay: hotel.dayNumber,
              selectedLocation: hotel.locationId,
              selectedProvider: hotel.serviceProviderId,
              selectedHotel: hotel.id,
              description: hotel.description,
              netPrice: hotel.nettPrice,
              roomDetail: {
                capacity: hotel.roomDetail?.capacity || 0,
                availableQuantity: hotel.roomDetail?.availableQuantity || 0,
                facilities: hotel.roomDetail?.facilities || ''
              }
            });
  
            this.fetchServiceProviders();
            this.fetchHotels();
          }
        },
        error: (error: any) => {
          console.error('Error fetching hotel details:', error);
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
    const selectedHotelId = this.addHotelForm.get('selectedHotel')?.value;
    const selectedHotel = this.hotels().find(h => h.id === selectedHotelId);
    if (selectedHotel) {
      this.addHotelForm.patchValue({
        description: selectedHotel.description,
        netPrice: selectedHotel.netPrice,
        roomDetail: {
          capacity: selectedHotel.roomDetail.capacity,
          availableQuantity: selectedHotel.roomDetail.availableQuantity,
          facilities: selectedHotel.roomDetail.facilities
        }
      });
    }
  }

  createHotel() {
    if (this.addHotelForm.valid) {
      const formValue = this.addHotelForm.value;

      const paxPrices = (formValue.paxPrices as any[]).reduce((acc: { [key: string]: number }, pax) => {
        acc[pax.paxId] = pax.price;
        return acc;
      }, {});

      const formData = {
        serviceId: formValue.selectedHotel,
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
              category: 'Hotel',
              name: formValue.selectedHotel,
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
            this.hotelAdded.emit({ service: newService, isUpdate: false });
            this.modal?.hide();
          }
        },
        error: (error: any) => {
          console.error('Error creating hotel:', error);
        }
      });
    }
  }

  updateHotel() {
    if (this.addHotelForm.valid && this.serviceId) {
      const formValue = this.addHotelForm.value;
      const paxPrices = this.prices.reduce((acc: { [key: string]: number }, pax: PaxOption) => {
        acc[pax.id.toString()] = formValue.paxPrices[`price_${pax.id}`] || 0; // Access nested paxPrices
        return acc;
      }, {});

      const formData = {
        serviceId: this.serviceId,
        dayNumber: formValue.selectedDay,
        quantity: 1,
        sellingPrice: formValue.netPrice,
        nettPrice: formValue.netPrice,
        paxPrices: paxPrices,
        roomDetail: formValue.roomDetail,
        mealDetail: null,
        transportDetail: null
      };

      this.tourDiscountService.updateService(this.tourId, this.serviceId, formData).subscribe({
        next: (response: any) => {
          if (response.code === 0) {
            const updatedService: Service = {
              id: this.serviceId!,
              category: 'Hotel',
              name: formValue.selectedHotel,
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
            this.hotelAdded.emit({ service: updatedService, isUpdate: true });
            this.modal?.hide();
          }
        },
        error: (error: any) => {
          console.error('Error updating hotel:', error);
        }
      });
    }
  }

  onSubmit() {
    if (this.serviceId) {
      this.updateHotel();
    } else {
      this.createHotel();
    }
  }

  onCancel(){
    this.modal?.hide();
  }
}