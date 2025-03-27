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
  selector: 'app-add-transportation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './add-transportation.component.html',
  styleUrls: ['./add-transportation.component.css']
})
export class AddTransportationComponent {
  @Input() days: number[] = [];
  @Input() tourId: number = 0;
  @Input() serviceId: number | null = null;
  @Input() prices: PaxOption[] = [];
  @Output() transportationAdded = new EventEmitter<any>();

  modal: Modal | null = null;
  addTransportationForm!: FormGroup;
  locations = signal<any[]>([]);
  providers = signal<any[]>([]);
  transportations = signal<any[]>([]);

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
    this.addTransportationForm = this.fb.group({
      selectedDay: [this.days.length > 0 ? this.days[0] : 1],
      selectedLocation: [null],
      selectedProvider: [null],
      selectedTransportation: [''],
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
    const paxPricesArray = this.addTransportationForm.get('paxPrices') as FormArray;
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
    return this.addTransportationForm.get('paxPrices') as FormArray;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prices'] && changes['prices'].currentValue) {
      if (this.addTransportationForm) {
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
    const locationId = this.addTransportationForm.get('selectedLocation')?.value;
    if (locationId) {
      this.tourDiscountService.getServiceProviders(this.tourId, locationId, 'Transportation').subscribe({
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

  fetchTransportations() {
    const locationId = this.addTransportationForm.get('selectedLocation')?.value;
    const providerId = this.addTransportationForm.get('selectedProvider')?.value;
    if (locationId && providerId) {
      this.tourDiscountService.getServices(this.tourId, locationId, providerId, "Transportation").subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            const providerData = response.data;
            if (providerData) {
              const mappedTransportations = providerData.availableServices.map((service: any) => ({
                id: service.id,
                name: service.name,
                netPrice: service.nettPrice,
                description: service.description || '',
                roomDetail: service.roomDetail || { capacity: 0, availableQuantity: 0, facilities: '' }
              }));
              this.transportations.set(mappedTransportations);
            }
          }
        },
        error: (error: any) => {
          console.error('Error fetching transportations:', error);
        }
      });
    }
  }



  fetchTransportationDetails() {
    if (this.serviceId && this.tourId) {
      if (!this.addTransportationForm) return;
      this.addTransportationForm.reset();
      this.tourDiscountService.getServiceDetails(this.tourId, this.serviceId).subscribe({
        next: (response: ServiceDetailResponse) => {
          if (response.code === 200) {
            const transportation = response.data;

            const paxPricesArray = this.addTransportationForm.get('paxPrices') as FormArray;
            paxPricesArray.clear();

            Object.values(transportation.paxPrices).forEach((pax: any) => {
              paxPricesArray.push(
                this.fb.group({
                  paxId: [pax.paxId],
                  paxRange: [pax.paxRange],
                  price: [pax.price || 0]
                })
              );
            });

            // Cập nhật các trường khác
            this.addTransportationForm.patchValue({
              selectedDay: transportation.dayNumber,
              selectedLocation: transportation.locationId,
              selectedProvider: transportation.serviceProviderId,
              selectedTransportation: transportation.id,
              description: transportation.description || '',
              netPrice: transportation.nettPrice,
              roomDetail: {
                capacity: transportation.roomDetail?.capacity || 0,
                availableQuantity: transportation.roomDetail?.availableQuantity || 0,
                facilities: transportation.roomDetail?.facilities || ''
              }
            });

            this.fetchServiceProviders();
            this.fetchTransportations();
          }
        },
        error: (error: any) => {
          console.error('Error fetching transportation details:', error);
        }
      });
    }
  }


  onLocationChange() {
    this.fetchServiceProviders();
  }

  onProviderChange() {
    this.fetchTransportations();
  }

  onTransportationChange() {
    const selectedTransportationId = this.addTransportationForm.get('selectedTransportation')?.value;
    const selectedTransportation = this.transportations().find(h => h.id === selectedTransportationId);
    if (selectedTransportation) {
      this.addTransportationForm.patchValue({
        description: selectedTransportation.description,
        netPrice: selectedTransportation.netPrice,
        roomDetail: {
          capacity: selectedTransportation.roomDetail.capacity,
          availableQuantity: selectedTransportation.roomDetail.availableQuantity,
          facilities: selectedTransportation.roomDetail.facilities
        }
      });
    }
  }

  createTransportation() {
    if (this.addTransportationForm.valid) {
      const formValue = this.addTransportationForm.value;

      const paxPrices = (formValue.paxPrices as any[]).reduce((acc: { [key: string]: number }, pax) => {
        acc[pax.paxId] = pax.price;
        return acc;
      }, {});

      const formData = {
        serviceId: formValue.selectedTransportation,
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
              category: 'Transportation',
              name: formValue.selectedTransportation,
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
            this.transportationAdded.emit({ service: newService, isUpdate: false });
            this.modal?.hide();
          }
        },
        error: (error: any) => {
          console.error('Error creating transportation:', error);
        }
      });
    }
  }

  updateTransportation() {
    if (this.addTransportationForm.valid && this.serviceId) {
      const formValue = this.addTransportationForm.value;
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
              category: 'Transportation',
              name: formValue.selectedTransportation,
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
            this.transportationAdded.emit({ service: updatedService, isUpdate: true });
            this.modal?.hide();
          }
        },
        error: (error: any) => {
          console.error('Error updating transportation:', error);
        }
      });
    }
  }

  onSubmit() {
    if (this.serviceId) {
      this.updateTransportation();
    } else {
      this.createTransportation();
    }
  }

  showModal() {
    const doc = this.ssrService.getDocument();
    if (doc) {
      const modalElement = document.getElementById('addTransportationModal');
      if (modalElement) {
        this.modal = new Modal(modalElement);
        this.modal.show();
        this.addTransportationForm.reset();
      }
    }
  }

  onCancel() {
    this.modal?.hide();
  }
}