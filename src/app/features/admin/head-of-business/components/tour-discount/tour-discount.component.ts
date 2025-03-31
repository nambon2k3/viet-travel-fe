import { Component, ViewChild, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyVndPipe } from "../../../../../shared/pipes/currency-vnd.pipe";
import { CommonModule } from '@angular/common';
import { AddHotelComponent } from "./add-hotel/add-hotel.component";
import { AddTransportationComponent } from './add-transportation/add-transportation.component';
import { AddRestaurantComponent } from "./add-restaurant/add-restaurant.component";
import { AddActivityComponent } from "./add-activity/add-activity.component";
import { ConfigTourPaxComponent } from "./config-tour-pax/config-tour-pax.component";
import { TourDiscountService } from '../../services/discount.service';
import { ConfigPriceComponent } from './config-price/config-price.component';
import { FormsModule } from '@angular/forms';
import { ConfigMarkupComponent } from "./config-markup/config-markup.component";

interface PriceRange {
  [key: string]: number;
}

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

interface ServiceCategory {
  categoryName: string;
  services: Service[];
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

interface ApiResponse {
  code: number;
  message: string;
  data: {
    tourId: number;
    tourName: string;
    tourType: string;
    serviceCategories: ServiceCategory[];
    paxOptions: PaxOption[];
  };
}

@Component({
  selector: 'app-tour-discount',
  standalone: true,
  imports: [
    CurrencyVndPipe,
    CommonModule,
    AddHotelComponent,
    AddTransportationComponent,
    AddRestaurantComponent,
    AddActivityComponent,
    ConfigTourPaxComponent,
    ConfigPriceComponent,
    FormsModule,
    ConfigMarkupComponent
  ],
  templateUrl: './tour-discount.component.html',
  styleUrls: ['./tour-discount.component.css']
})
export class TourDiscountComponent implements OnInit {
  @ViewChild('addHotelModal') addHotelModal!: AddHotelComponent;
  @ViewChild('addTransportationModal') addTransportationModal!: AddTransportationComponent;
  @ViewChild('addRestaurantModal') addRestaurantModal!: AddRestaurantComponent;
  @ViewChild('addActivityModal') addActivityModal!: AddActivityComponent;
  @ViewChild('tourConfigPaxModal') tourConfigPaxModal!: ConfigTourPaxComponent;
  @ViewChild('addPriceModal') addPriceModal!: ConfigPriceComponent;
  @ViewChild('configMarkupModal') configMarkupModal!: ConfigMarkupComponent;

  tourName: string = '';
  tourType: string = '';
  tourDays: number[] = [];
  tourId: number = 0;
  hotels: Service[] = [];
  transports: Service[] = [];
  restaurants: Service[] = [];
  activities: Service[] = [];
  priceRanges: string[] = [];
  prices: PaxOption[] = [];
  locations = signal<any[]>([]);

  mintotalNetPrices: PriceRange = {};
  minsalePrices: PriceRange = {};
  markupPercentage: number = 0;
  finalTourPrices: PriceRange = {};


  constructor(
    private router: Router,
    private tourDiscountService: TourDiscountService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.tourId = +params['id']; // Convert to number
      if (this.tourId) {
        this.fetchTourData(this.tourId);
        this.fetchLocations();
        this.getMarkup();
      }
    });
  }

  getMarkup() {
    this.tourDiscountService.getMarkup(this.tourId).subscribe(response => {
      if (response?.data?.markUpPercent) {
        this.markupPercentage = response.data.markUpPercent;
      } else {
        this.markupPercentage = 0;
      }
    }
    );
  }

  fetchTourData(id: number) {
    this.tourDiscountService.getTourDiscount(id).subscribe({
      next: (response: ApiResponse) => {
        if (response.code === 200) {
          const data = response.data;
          this.tourName = data.tourName;
          this.priceRanges = data.paxOptions.map(pax => pax.paxRange);
          this.prices = data.paxOptions;
          this.tourType = data.tourType;
          
          data.serviceCategories.forEach(category => {
            switch (category.categoryName) {
              case 'Hotel':
                this.hotels = category.services.map(service => this.mapService(service));
                break;
              case 'Transport':
                this.transports = category.services.map(service => this.mapService(service));
                break;
              case 'Restaurant':
                this.restaurants = category.services.map(service => this.mapService(service));
                break;
              case 'Activity':
                this.activities = category.services.map(service => this.mapService(service));
                break;
            }
          });

          this.calculateTourDays();
          this.calculateTotalNetPrice();
          this.calculateTotalPrices();
          this.calculateFinalTourPrices();
        }
      },
      error: (error: any) => {
        console.error('HTTP error fetching tour data:', error);
      }
    });
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

  mapService(service: any): Service {
    return {
      id: service.id,
      name: service.name,
      dayNumber: service.dayNumber,
      status: service.status,
      nettPrice: service.nettPrice,
      sellingPrice: service.sellingPrice,
      locationName: service.locationName || '',
      locationId: service.locationId,
      serviceProviderName: service.serviceProviderName,
      serviceProviderId: service.serviceProviderId,
      paxPrices: Object.keys(service.paxPrices || {}).reduce((acc: { [key: string]: PaxPrice }, key: string) => {
        const pax = service.paxPrices[key];
        acc[pax.paxRange] = {
          paxId: pax.paxId,
          minPax: pax.minPax,
          maxPax: pax.maxPax,
          paxRange: pax.paxRange,
          price: pax.price,
          serviceNettPrice: pax.serviceNettPrice,
          sellingPrice: pax.sellingPrice,
          fixedCost: pax.fixedCost,
          extraHotelCost: pax.extraHotelCost
        };
        return acc;
      }, {})
    };
  }

  calculateTourDays() {
    const allServices = [...this.hotels, ...this.transports, ...this.restaurants, ...this.activities];
    const maxDay = allServices.length > 0 ? Math.max(...allServices.map(service => service.dayNumber)) : 1;
    this.tourDays = Array.from({ length: maxDay }, (_, i) => i + 1);
  }

  calculateTotalNetPrice() {
    this.priceRanges.forEach(range => {
      const minPax = this.getMinPax(range);
      let total = 0;
      this.hotels.forEach(h => total += h.nettPrice * minPax);
      this.transports.forEach(t => total += t.nettPrice * minPax);
      this.restaurants.forEach(r => total += r.nettPrice * minPax);
      this.activities.forEach(a => total += a.nettPrice * minPax);
      this.mintotalNetPrices[range] = total;
    });
  }

  calculateTotalPrices() {
    this.priceRanges.forEach(range => {
      const minPax = this.getMinPax(range);
      let total = 0;
      [this.hotels, this.transports, this.restaurants, this.activities].forEach(services => {
        services.forEach(service => {
          if (service.paxPrices && service.paxPrices[range]) {
            total += (service.paxPrices[range].sellingPrice || 0) * minPax;
          }
        });
      });
      this.minsalePrices[range] = total;
    });
  }

  getMinPax(range: string): number {
    return parseInt(range.split('-')[0], 10);
  }

  getPriceByRange(range: string): PaxOption | undefined {
    return this.prices.find(p => p.paxRange === range);
  }

  handlePriceConfirm(updatedPrices: { paxRange: string, sellingPrice: number }[]) {
    updatedPrices.forEach(price => {
      const existing = this.prices.find(p => p.paxRange === price.paxRange);
      if (existing) {
        existing.sellingPrice = price.sellingPrice;
      }
    });
    this.calculateTotalPrices();
  }

  handleMarkupConfirm(markup: number) {
    this.markupPercentage = markup;
    this.calculateFinalTourPrices();
  }
  

  calculateFinalTourPrices() {
    this.priceRanges.forEach(range => {
      const sellingPrice = this.getPriceByRange(range)?.sellingPrice || 0;
      this.finalTourPrices[range] = sellingPrice * (1 + this.markupPercentage / 100);
    });
  }
  

  backToList() {
    this.router.navigate(['head-business/list-tour']);
  }

  openAddHotelModal(serviceId?: number, dayNumber?: number) {
    if (this.addHotelModal) {
      this.addHotelModal.serviceId = serviceId || null;
      this.addHotelModal.day = dayNumber || null;
      this.addHotelModal.fetchHotelDetails();
      this.addHotelModal.showModal();
    }
  }

  openConfigMarkup() {
    if (this.configMarkupModal) {
      this.configMarkupModal.tourId = this.tourId || null;
      this.configMarkupModal.getMarkup();
      this.configMarkupModal.showModal();
    }
  }

  openAddTransportationModal(serviceId?: number, dayNumber?: number) {
    if (this.addTransportationModal) {
      this.addTransportationModal.serviceId = serviceId || null;
      this.addTransportationModal.day = dayNumber || null;
      this.addTransportationModal.fetchTransportationDetails();
      this.addTransportationModal.showModal();
    }
  }

  openAddRestaurantModal(serviceId?: number, dayNumber?: number) {
    if (this.addRestaurantModal) {
      this.addRestaurantModal.serviceId = serviceId || null;
      this.addRestaurantModal.day = dayNumber || null;
      this.addRestaurantModal.fetchRestaurantDetails();
      this.addRestaurantModal.showModal();
    }
  }

  openAddActivityModal(serviceId?: number, dayNumber?: number) {
    if (this.addActivityModal) {
      this.addActivityModal.serviceId = serviceId || null;
      this.addActivityModal.day = dayNumber || null;
      this.addActivityModal.fetchActivityDetails();
      this.addActivityModal.showModal();
    }
  }

  closeTourPax() {
    this.fetchTourData(this.tourId);

  }

  addNewHotel(event: { hotel: Service, isUpdate: boolean }) {
    const { hotel, isUpdate } = event;
    if (isUpdate && this.addHotelModal.serviceId) {
      const index = this.hotels.findIndex(h => h.id === this.addHotelModal.serviceId);
      if (index !== -1) {
        this.hotels[index] = hotel;
      }
    } else {
      this.hotels.push(hotel);
    }
    window.location.reload();
  }

  deleteHotel(index: number, serviceId: number, dayNumber: number) {
    this.tourDiscountService.deleteService(this.tourId, serviceId, dayNumber).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          console.log('Hotel deleted successfully');
          window.location.reload();
        } else {
          console.error('Error deleting hotel:', response.message);
        }
      }
    });
    this.hotels.splice(index, 1);
    this.calculateTourDays();
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculateFinalTourPrices();
  }

  addNewTransportation(event: { transport: Service, isUpdate: boolean }) {
    const { transport, isUpdate } = event;
    if (isUpdate && this.addTransportationModal.serviceId) {
      const index = this.transports.findIndex(t => t.id === this.addTransportationModal.serviceId);
      if (index !== -1) {
        this.transports[index] = transport;
      }
    } else {
      this.transports.push(transport);
    }
    window.location.reload();
  }

  deleteTransportation(index: number, serviceId: number, dayNumber: number) {
    this.tourDiscountService.deleteService(this.tourId, serviceId, dayNumber).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          console.log('Transportation deleted successfully');
          window.location.reload();
        } else {
          console.error('Error deleting hotel:', response.message);
        }
      }
    });
    this.transports.splice(index, 1);
    this.calculateTourDays();
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculateFinalTourPrices();
  }

  addNewRestaurant(event: { restaurant: Service, isUpdate: boolean }) {
    const { restaurant, isUpdate } = event;
    if (isUpdate && this.addRestaurantModal.serviceId) {
      const index = this.restaurants.findIndex(r => r.id === this.addRestaurantModal.serviceId);
      if (index !== -1) {
        this.restaurants[index] = restaurant;
      }
    } else {
      this.restaurants.push(restaurant);
    }
    window.location.reload();
  }

  deleteRestaurant(index: number, serviceId: number, dayNumber: number) {
    this.tourDiscountService.deleteService(this.tourId, serviceId, dayNumber).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          console.log('Restaurant deleted successfully');
          window.location.reload();
        } else {
          console.error('Error deleting hotel:', response.message);
        }
      }
    });
    this.calculateTourDays();
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculateFinalTourPrices();
  }

  addNewActivity(event: { activity: Service, isUpdate: boolean }) {
    const { activity, isUpdate } = event;
    if (isUpdate && this.addActivityModal.serviceId) {
      const index = this.activities.findIndex(a => a.id === this.addActivityModal.serviceId);
      if (index !== -1) {
        this.activities[index] = activity;
      }
    } else {
      this.activities.push(activity);
    }
    window.location.reload();
  }

  deleteActivity(index: number, serviceId: number, dayNumber: number) {
    this.tourDiscountService.deleteService(this.tourId, serviceId, dayNumber).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.fetchTourData(this.tourId);
          console.log('Activity deleted successfully');
        } else {
          console.error('Error deleting hotel:', response.message);
        }
      }
    });
    this.activities.splice(index, 1);
    this.calculateTourDays();
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculateFinalTourPrices();
  }
}