import { Component, ViewChild, OnInit, signal } from '@angular/core';
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

interface PriceRange {
  [key: string]: number;
}

interface PaxOption {
  id: number;
  minPax: number;
  maxPax: number;
  paxRange: string;
  fixedCost: number;
  sellingPrice: number;
}

interface Service {
  id: number;
  name: string;
  location: string;
  netPrice: number;
  sellingPrice: number;
  quantity: number;
  prices: PriceRange;
  day: number;
  status: string;
  serviceProviderName: string;
  serviceProviderId: number;
}

interface ApiResponse {
  code: number;
  message: string;
  data: {
    tourId: number;
    tourName: string;
    serviceCategories: {
      categoryName: string;
      services: any[];
    }[];
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
    FormsModule
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

  tourName: string = '';
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

  constructor(
    private router: Router,
    private tourDiscountService: TourDiscountService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.tourId = params['id'];
      if (this.tourId !== 0) {
        this.fetchTourData(this.tourId);
        this.fetchLocations();
      }
    });
  }

  fetchTourData(id: number) {
    this.tourDiscountService.getTourDiscount(id).subscribe({
      next: (response: ApiResponse) => {
        if (response.code === 200) {
          const data = response.data;
          this.tourName = data.tourName;
          this.priceRanges = data.paxOptions.map(pax => pax.paxRange);
          this.prices = data.paxOptions.map(p => ({
            ...p,
            sellingPrice: p.sellingPrice || 0
          }));

          data.serviceCategories.forEach(category => {
            if (category.categoryName === 'Hotel') {
              this.hotels = category.services.map(service => this.mapService(service, 'Hotel'));
            } else if (category.categoryName === 'Transport') {
              this.transports = category.services.map(service => this.mapService(service, 'Transport'));
            } else if (category.categoryName === 'Restaurant') {
              this.restaurants = category.services.map(service => this.mapService(service, 'Restaurant'));
            } else if (category.categoryName === 'Activity') {
              this.activities = category.services.map(service => this.mapService(service, 'Activity'));
            }
          });

          this.calculateTourDays();
          this.calculateTotalNetPrice();
          this.calculateTotalPrices();
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

  mapService(service: any, category: string): Service {
    return {
      id: service.id,
      name: service.name,
      location: service.locationName || '',
      netPrice: service.nettPrice,
      sellingPrice: service.sellingPrice,
      quantity: 1,
      prices: Object.keys(service.paxPrices).reduce((acc: PriceRange, paxId: string) => {
        const pax = service.paxPrices[paxId];
        acc[pax.paxRange] = pax.price;
        return acc;
      }, {}),
      day: service.dayNumber,
      status: service.status,
      serviceProviderName: service.serviceProviderName,
      serviceProviderId: service.serviceProviderId
    };
  }

  calculateTourDays() {
    const allServices = [
      ...this.hotels,
      ...this.transports,
      ...this.restaurants,
      ...this.activities
    ];
    const maxDay = allServices.length > 0 ? Math.max(...allServices.map(service => service.day)) : 1;
    this.tourDays = Array.from({ length: maxDay }, (_, i) => i + 1);
  }

  calculateTotalNetPrice() {
    this.priceRanges.forEach(range => {
      const minPax = this.getMinPax(range);
      let total = 0;
      this.hotels.forEach(h => total += h.netPrice * h.quantity * minPax);
      this.transports.forEach(t => total += t.netPrice * t.quantity * minPax);
      this.restaurants.forEach(r => total += r.netPrice * r.quantity * minPax);
      this.activities.forEach(a => total += a.netPrice * a.quantity * minPax);
      this.mintotalNetPrices[range] = total;
    });
  }

  calculateTotalPrices() {
    this.priceRanges.forEach(range => {
      const minPax = this.getMinPax(range);
      let total = 0;
      this.hotels.forEach(h => total += (h.prices[range] || 0) * h.quantity * minPax);
      this.transports.forEach(t => total += (t.prices[range] || 0) * t.quantity * minPax);
      this.restaurants.forEach(r => total += (r.prices[range] || 0) * r.quantity * minPax);
      this.activities.forEach(a => total += (a.prices[range] || 0) * a.quantity * minPax);
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
  }

  backToList() {
    this.router.navigate(['head-business/list-tour']);
  }

  openAddHotelModal(serviceId?: number) {
    if (this.addHotelModal) {
      this.addHotelModal.serviceId = serviceId || null; 
      this.addHotelModal.fetchHotelDetails(); 
      this.addHotelModal.showModal();
    }
  }

  openAddTransportationModal(serviceId?: number) {
    if (this.addTransportationModal) {
      this.addTransportationModal.serviceId = serviceId || null;
      this.addTransportationModal.fetchTransportationDetails(); 
      this.addTransportationModal.showModal();
    }
  }

  openAddRestaurantModal(serviceId?: number) {
    if (this.addRestaurantModal) {
      this.addRestaurantModal.serviceId = serviceId || null;
      this.addRestaurantModal.fetchRestaurantDetails(); 
      this.addRestaurantModal.showModal();
    }
  }

  openAddActivityModal(serviceId?: number) {
    if (this.addActivityModal) {
      this.addActivityModal.serviceId = serviceId || null;
      this.addActivityModal.fetchActivityDetails(); 
      this.addActivityModal.showModal();
    }
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
    this.fetchTourData(this.tourId);
  }

  deleteHotel(index: number) {
    this.hotels.splice(index, 1);
    this.calculateTourDays();
    this.calculateTotalNetPrice();
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
    this.fetchTourData(this.tourId);
  }

  deleteTransportation(index: number) {
    this.transports.splice(index, 1);
    this.calculateTourDays();
    this.calculateTotalNetPrice();
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
    this.fetchTourData(this.tourId); // Consistent with Hotel
  }

  deleteRestaurant(index: number) {
    this.restaurants.splice(index, 1);
    this.calculateTourDays();
    this.calculateTotalNetPrice();
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
    this.fetchTourData(this.tourId); // Consistent with Hotel
  }

  deleteActivity(index: number) {
    this.activities.splice(index, 1);
    this.calculateTourDays();
    this.calculateTotalNetPrice();
  }

  calculateTotalBaseSellingPrice(): void {
    const guestRanges: { [key: string]: { min: number; max: number } } = {};
    this.priceRanges.forEach(range => {
      const [min, max] = range.split('-').map(num => parseInt(num));
      guestRanges[range] = { min, max };
    });
  
    this.priceRanges.forEach(range => {
      let total = 0;
      this.hotels.forEach(hotel => {
        total += (hotel.prices[range] || 0) * guestRanges[range].min * hotel.quantity;
      });
      this.transports.forEach(transport => {
        total += (transport.prices[range] || 0) * guestRanges[range].min * transport.quantity;
      });
      this.restaurants.forEach(restaurant => {
        total += (restaurant.prices[range] || 0) * guestRanges[range].min * restaurant.quantity;
      });
      this.activities.forEach(activity => {
        total += (activity.prices[range] || 0) * guestRanges[range].min * activity.quantity;
      });
      this.minsalePrices[range] = total;
    });
  }
}