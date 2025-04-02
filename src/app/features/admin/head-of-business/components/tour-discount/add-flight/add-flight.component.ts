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
  selector: 'app-add-flight',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  templateUrl: './add-flight.component.html',
  styleUrls: ['./add-flight.component.css']
})
export class AddFlightComponent implements AfterViewInit {
  @Input() days: number[] = [];
  @Input() day: number | null = null;
  @Input() tourId: number = 0;
  @Input() serviceId: number | null = null;
  @Input() prices: PaxOption[] = [];
  @Input() locations = signal<any[]>([]);
  @Output() flightAdded = new EventEmitter<{ flight: Service, isUpdate: boolean }>();

  modal: Modal | null = null;
  addFlightForm!: FormGroup;
  providers = signal<any[]>([]);
  flights = signal<any[]>([]);

  constructor(
    private fb: FormBuilder,
    private ssrService: SsrService,
    private tourDiscountService: TourDiscountService
  ) {
    this.initializeForm();
  }

  ngAfterViewInit() {
    const doc = this.ssrService.getDocument();
    if (!doc) return;
    const modalElement = document.getElementById('addFlightModal');
    if (modalElement) {
      this.modal = new Modal(modalElement);
    }
  }

  initializeForm() {
    this.addFlightForm = this.fb.group({
      selectedDay: [this.days.length > 0 ? this.days[0] : 1],
      selectedLocation: [null],
      selectedProvider: [null],
      selectedFlight: [null],
      netPrice: [{ value: 0, disabled: true }],
      paxPrices: this.fb.array([])
    });
  }

  get paxPrices(): FormArray {
    return this.addFlightForm.get('paxPrices') as FormArray;
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
    const locationId = this.addFlightForm.get('selectedLocation')?.value;
    if (locationId) {
      this.tourDiscountService.getServiceProviders(this.tourId, locationId, 'Flight').subscribe({
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

  fetchFlights() {
    const locationId = this.addFlightForm.get('selectedLocation')?.value;
    const providerId = this.addFlightForm.get('selectedProvider')?.value;
    if (locationId && providerId) {
      this.tourDiscountService.getServices(this.tourId, locationId, providerId, 'Flight').subscribe({
        next: (response: any) => {
          if (response.code === 200) {
            const mappedFlights = response.data.availableServices.map((service: any) => ({
              id: service.id,
              name: service.name,
              nettPrice: service.nettPrice
            }));
            this.flights.set(mappedFlights);
          }
        },
        error: (error: any) => {
          console.error('Error fetching flights:', error);
        }
      });
    }
  }

  fetchFlightDetails() {
    if (this.serviceId && this.tourId) {
      this.tourDiscountService.getServiceDetails(this.tourId, this.serviceId, this.day).subscribe({
        next: (response: ServiceDetailResponse) => {
          if (response.code === 200) {
            const flight = response.data;

            this.addFlightForm.patchValue({
              selectedDay: flight.dayNumber,
              selectedLocation: flight.locationId,
              selectedProvider: flight.serviceProviderId,
              selectedFlight: flight.id,
              netPrice: flight.nettPrice
            });

            const paxPricesArray = this.paxPrices;
            paxPricesArray.clear();
            Object.values(flight.paxPrices).forEach(pax => {
              paxPricesArray.push(
                this.fb.group({
                  paxId: [pax.paxId],
                  paxRange: [pax.paxRange],
                  sellingPrice: [pax.sellingPrice || 0]
                })
              );
            });

            this.fetchServiceProviders();
            this.fetchFlights();
          }
        },
        error: (error: any) => {
          console.error('Error fetching flight details:', error);
        }
      });
    } else {
      this.initPaxPrices();
    }
  }

  onLocationChange() {
    this.addFlightForm.patchValue({ selectedProvider: null, selectedFlight: null });
    this.providers.set([]);
    this.flights.set([]);
    this.fetchServiceProviders();
  }

  onProviderChange() {
    this.addFlightForm.patchValue({ selectedFlight: null });
    this.flights.set([]);
    this.fetchFlights();
  }

  onFlightChange() {
    const selectedFlightId = this.addFlightForm.get('selectedFlight')?.value;
    const selectedFlight = this.flights().find(h => h.id === selectedFlightId);
    if (selectedFlight) {
      this.addFlightForm.patchValue({
        netPrice: selectedFlight.nettPrice
      });
    }
  }

  onSubmit() {
    if (this.addFlightForm.valid) {
      const formValue = this.addFlightForm.getRawValue(); // Use getRawValue to include disabled fields
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

      const flightData: Service = {
        id: this.serviceId || formValue.selectedFlight,
        name: this.flights().find(h => h.id === formValue.selectedFlight)?.name || '',
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
        this.updateFlight(flightData);
      } else {
        this.createFlight(flightData);
      }
    }
  }

  createFlight(flightData: Service) {
    const payload = {
      serviceId: flightData.id,
      locationId: flightData.locationId,
      serviceProviderId: flightData.serviceProviderId,
      dayNumber: Number(flightData.dayNumber),
      paxPrices: Object.values(flightData.paxPrices).reduce((acc: any, pax) => {
        acc[pax.paxId] = pax.sellingPrice;
        return acc;
      }, {})
    };
  
    this.tourDiscountService.addService(this.tourId, payload).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.flightAdded.emit({ flight: flightData, isUpdate: false });
          this.modal?.hide();
        }
      },
      error: (error: any) => {
        console.error('Error creating flight:', error);
      }
    });
  }  

  updateFlight(flightData: Service) {
    const payload = {
      serviceId: flightData.id,
      locationId: flightData.locationId,
      serviceProviderId: flightData.serviceProviderId,
      dayNumber: Number(flightData.dayNumber),
      paxPrices: Object.values(flightData.paxPrices).reduce((acc: any, pax) => {
        acc[pax.paxId] = pax.sellingPrice;
        return acc;
      }, {})
    };

    this.tourDiscountService.updateService(this.tourId, this.serviceId!, payload).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.flightAdded.emit({ flight: flightData, isUpdate: true });
          this.modal?.hide();
        }
      },
      error: (error: any) => {
        console.error('Error updating flight:', error);
      }
    });
  }

  showModal() {
    this.modal?.show();
  }

  onCancel() {
    this.modal?.hide();
    this.addFlightForm.reset();
    this.initPaxPrices();
  }
}