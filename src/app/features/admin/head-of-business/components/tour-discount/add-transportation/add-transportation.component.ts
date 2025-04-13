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
export class AddTransportationComponent implements AfterViewInit {
  @Input() days: number[] = [];
  @Input() day: number | null = null;
  @Input() tourId: number = 0;
  @Input() serviceId: number | null = null;
  @Input() prices: PaxOption[] = [];
  @Input() locations = signal<any[]>([]);
  @Output() transportationAdded = new EventEmitter<{ transport: Service, isUpdate: boolean }>();

  modal: Modal | null = null;
  addTransportationForm!: FormGroup;
  providers = signal<any[]>([]);
  transportations = signal<any[]>([]);

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
    const modalElement = document.getElementById('addTransportationModal');
    if (modalElement) {
      this.modal = new Modal(modalElement);
    }
  }

  initializeForm() {
    this.addTransportationForm = this.fb.group({
      selectedDay: [this.days.length > 0 ? this.days[0] : 1],
      selectedLocation: [null],
      selectedProvider: [null],
      selectedTransportation: [null],
      netPrice: [{ value: 0, disabled: true }],
      paxPrices: this.fb.array([])
    });
  }

  get paxPrices(): FormArray {
    return this.addTransportationForm.get('paxPrices') as FormArray;
  }

  initPaxPrices() {
    const paxPricesArray = this.paxPrices;
    paxPricesArray.clear();
    this.prices.forEach(pax => {
      paxPricesArray.push(
        this.fb.group({
          paxId: [pax.id],
          paxRange: [pax.paxRange],
          sellingPrice: [0]
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
    const locationId = this.addTransportationForm.get('selectedLocation')?.value;
    if (locationId) {
      this.tourDiscountService.getServiceProviders(this.tourId, locationId, 'Transport').subscribe({
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
      this.tourDiscountService.getServices(this.tourId, locationId, providerId, 'Transport').subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            const mappedTransportations = response.data.availableServices.map((service: any) => ({
              id: service.id,
              name: service.name,
              nettPrice: service.nettPrice,
              sellingPrice: service.sellingPrice
            }));
            this.transportations.set(mappedTransportations);
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
      this.tourDiscountService.getServiceDetails(this.tourId, this.serviceId, this.day).subscribe({
        next: (response: ServiceDetailResponse) => {
          if (response.code === 200) {
            const transportation = response.data;

            this.addTransportationForm.patchValue({
              selectedDay: transportation.dayNumber,
              selectedLocation: transportation.locationId,
              selectedProvider: transportation.serviceProviderId,
              selectedTransportation: transportation.id,
              netPrice: transportation.nettPrice,
              sellingPrice: transportation.sellingPrice
            });

            const paxPricesArray = this.paxPrices;
            paxPricesArray.clear();
            Object.values(transportation.paxPrices).forEach(pax => {
              paxPricesArray.push(
                this.fb.group({
                  paxId: [pax.paxId],
                  paxRange: [pax.paxRange],
                  sellingPrice: [pax.sellingPrice]
                })
              );
            });

            this.fetchServiceProviders();
            this.fetchTransportations();
          }
        },
        error: (error: any) => {
          console.error('Error fetching transportation details:', error);
        }
      });
    } else {
      this.initPaxPrices();
    }
  }

  onLocationChange() {
    this.addTransportationForm.patchValue({ selectedProvider: null, selectedTransportation: null, netPrice: 0  });
    this.providers.set([]);
    this.transportations.set([]);
    this.fetchServiceProviders();
  }

  onProviderChange() {
    this.addTransportationForm.patchValue({ selectedTransportation: null, netPrice: 0  });
    this.transportations.set([]);
    this.fetchTransportations();
  }

  onTransportationChange() {
    const selectedTransportationId = this.addTransportationForm.get('selectedTransportation')?.value;
    const selectedTransportation = this.transportations().find(t => t.id === selectedTransportationId);

    if (selectedTransportation) {
      this.addTransportationForm.patchValue({
        netPrice: selectedTransportation.nettPrice
      });

      const paxPricesArray = this.paxPrices;
      paxPricesArray.controls.forEach(control => {
        control.patchValue({
          sellingPrice: selectedTransportation.sellingPrice || 0
        });
      });
    }
  }

  onSubmit() {
    if (this.addTransportationForm.valid) {
      const formValue = this.addTransportationForm.getRawValue(); // Use getRawValue to include disabled fields
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

      const transportationData: Service = {
        id: this.serviceId || formValue.selectedTransportation,
        name: this.transportations().find(h => h.id === formValue.selectedTransportation)?.name || '',
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
        this.updateTransportation(transportationData);
      } else {
        this.createTransportation(transportationData);
      }
    }
  }

  createTransportation(transportationData: Service) {
    const payload = {
      serviceId: transportationData.id,
      locationId: transportationData.locationId,
      serviceProviderId: transportationData.serviceProviderId,
      dayNumber: Number(transportationData.dayNumber),
      paxPrices: Object.values(transportationData.paxPrices).reduce((acc: any, pax) => {
        acc[pax.paxId] = pax.sellingPrice;
        return acc;
      }, {})
    };

    this.tourDiscountService.addService(this.tourId, payload).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.transportationAdded.emit({ transport: transportationData, isUpdate: false });

          // Reset toàn bộ form
          this.addTransportationForm.reset();
          this.initPaxPrices();
          this.providers.set([]);
          this.transportations.set([]);
          this.modal?.hide();
        }
      },
      error: (error: any) => {
        console.error('Error creating transportation:', error);
      }
    });
  }

  updateTransportation(transportationData: Service) {
    const payload = {
      serviceId: transportationData.id,
      locationId: transportationData.locationId,
      serviceProviderId: transportationData.serviceProviderId,
      dayNumber: Number(transportationData.dayNumber),
      paxPrices: Object.values(transportationData.paxPrices).reduce((acc: any, pax) => {
        acc[pax.paxId] = pax.sellingPrice;
        return acc;
      }, {})
    };

    this.tourDiscountService.updateService(this.tourId, this.serviceId!, payload).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.transportationAdded.emit({ transport: transportationData, isUpdate: true });

          // Reset toàn bộ form
          this.addTransportationForm.reset({
            selectedDay: this.days.length > 0 ? this.days[0] : 1,
            selectedLocation: null,
            selectedProvider: null,
            selectedTransportation: null,
            netPrice: 0
          });

          // Reset paxPrices về giá trị mặc định từ this.prices
          this.initPaxPrices();

          // Reset providers và transportations
          this.providers.set([]);
          this.transportations.set([]);

          // Ẩn modal
          this.modal?.hide();
        }
      },
      error: (error: any) => {
        console.error('Error updating transportation:', error);
      }
    });
  }

  showModal() {
    this.fetchTransportationDetails();
    this.modal?.show();
  }

  onCancel() {
    this.modal?.hide();
    this.addTransportationForm.reset();
    this.initPaxPrices();
  }
}