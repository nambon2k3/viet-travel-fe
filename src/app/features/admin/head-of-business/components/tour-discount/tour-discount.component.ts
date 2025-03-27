import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyVndPipe } from "../../../../../shared/pipes/currency-vnd.pipe";
import { CommonModule } from '@angular/common';
import { AddHotelComponent } from "./add-hotel/add-hotel.component";
import { AddTransportationComponent } from './add-transportation/add-transportation.component';
import { AddRestaurantComponent } from "./add-restaurant/add-restaurant.component";
import { AddActivityComponent } from "./add-activity/add-activity.component";
import { ConfigTourPaxComponent } from "./config-tour-pax/config-tour-pax.component";
import { TourDiscountService } from '../../services/discount.service';
import { SsrService } from '../../../../../core/services/ssr.service';

interface PriceRange {
  [key: string]: number;
}

interface PaxOption {
  id: number;
  minPax: number;
  maxPax: number;
  paxRange: string;
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

  tourId: number = 10;
  tourName: string = '';
  tourDays: number[] = [];
  serviceId: number | null = null;

  hotels: Service[] = [];
  transports: Service[] = [];
  restaurants: Service[] = [];
  activities: Service[] = [];

  priceRanges: string[] = [];
  prices: PaxOption[] = [];
  totalNetPrice: number = 0;
  mintotalNetPrices: PriceRange = {};
  maxtotalNetPrices: PriceRange = {};
  totalSalePrice: number = 0;
  minsalePrices: PriceRange = {};
  maxsalePrices: PriceRange = {};
  perGuestPrice: number = 0;
  perGuestPrices: PriceRange = {};
  perGuestNetPrice: number = 0;
  perGuestNetPrices: PriceRange = {};

  constructor(
    private router: Router,
    private tourDiscountService: TourDiscountService,
    private ssrService: SsrService
  ) { }

  ngOnInit() {
    this.fetchTourData();
  }

  fetchTourData() {
    this.tourDiscountService.getTourDiscount(this.tourId).subscribe({
      next: (response: ApiResponse) => {
        if (response.code === 200) {
          const data = response.data;
          this.tourName = data.tourName;
          this.priceRanges = data.paxOptions.map(pax => pax.paxRange);
          this.prices = data.paxOptions;
          this.priceRanges.forEach(range => {
            this.mintotalNetPrices[range] = 0;
            this.maxtotalNetPrices[range] = 0;
            this.minsalePrices[range] = 0;
            this.maxsalePrices[range] = 0;
            this.perGuestPrices[range] = 0;
            this.perGuestNetPrices[range] = 0;
          });

          const mapService = (service: any, category: string): any => ({
            id: service.id,
            name: service.name,
            location: service.locationName || '',
            netPrice: service.nettPrice,
            sellingPrice: service.sellingPrice,
            quantity: 1,
            [category === 'Hotel' ? 'prices' : 'prices']: Object.keys(service.paxPrices).reduce((acc: PriceRange, paxId: string) => {
              const pax = service.paxPrices[paxId];
              acc[pax.paxRange] = pax.price;
              return acc;
            }, {}),
            day: service.dayNumber,
            status: service.status,
            serviceProviderName: service.serviceProviderName,
            serviceProviderId: service.serviceProviderId,
            type: service.type || undefined,
            provider: category === 'TourGuide' || category === 'Activity' ? service.serviceProviderName : undefined
          });

          data.serviceCategories.forEach(category => {
            if (category.categoryName === 'Hotel') {
              this.hotels = category.services.map((service: any) => mapService(service, 'Hotel'));
            } else if (category.categoryName === 'Transportation') {
              this.transports = category.services.map((service: any) => mapService(service, 'Transportation'));
            } else if (category.categoryName === 'Restaurant') {
              this.restaurants = category.services.map((service: any) => mapService(service, 'Restaurant'));
            } else if (category.categoryName === 'Activity') {
              this.activities = category.services.map((service: any) => mapService(service, 'Activity'));
            }
          });

          this.calculateTourDays();
          this.calculateTotalNetPrice();
          this.calculateTotalPrices();
          this.calculatePerGuestPrices();
          this.calculatePerGuestNetPrice();
        } else {
          console.error('Error fetching tour data:', response.message);
        }
      },
      error: (error: any) => {
        console.error('HTTP error fetching tour data:', error);
      }
    });
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

  calculateTotalNetPrice(): void {
    this.totalNetPrice = 0;
    const guestRanges: { [key: string]: { min: number; max: number } } = {};
    this.priceRanges.forEach(range => {
      const [min, max] = range.split('-').map(num => parseInt(num));
      guestRanges[range] = { min, max };
    });

    this.priceRanges.forEach(range => {
      let totalForRange = 0;

      this.hotels.forEach(hotel => {
        totalForRange += hotel.netPrice * hotel.quantity * guestRanges[range].min;
      });
      this.transports.forEach(transport => {
        totalForRange += transport.netPrice * transport.quantity * guestRanges[range].min;
      });
      this.restaurants.forEach(restaurant => {
        totalForRange += restaurant.netPrice * restaurant.quantity * guestRanges[range].min;
      });
      this.activities.forEach(activity => {
        totalForRange += activity.netPrice * activity.quantity * guestRanges[range].min;
      });
      this.mintotalNetPrices[range] = totalForRange;

      totalForRange = 0;
      this.hotels.forEach(hotel => {
        totalForRange += hotel.netPrice * hotel.quantity * guestRanges[range].max;
      });
      this.transports.forEach(transport => {
        totalForRange += transport.netPrice * transport.quantity * guestRanges[range].max;
      });
      this.restaurants.forEach(restaurant => {
        totalForRange += restaurant.netPrice * restaurant.quantity * guestRanges[range].max;
      });
      this.activities.forEach(activity => {
        totalForRange += activity.netPrice * activity.quantity * guestRanges[range].max;
      });
      this.maxtotalNetPrices[range] = totalForRange;
    });
  }

  calculatePerGuestNetPrice(): void {
    const guestRanges: { [key: string]: { min: number; max: number } } = {};
    this.priceRanges.forEach(range => {
      const [min, max] = range.split('-').map(num => parseInt(num));
      guestRanges[range] = { min, max };
    });

    this.priceRanges.forEach(range => {
      this.perGuestNetPrices[range] = Math.ceil(this.mintotalNetPrices[range] / guestRanges[range].min);
    });
  }

  calculateTotalPrices(): void {
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

      total = 0;
      this.hotels.forEach(hotel => {
        total += (hotel.prices[range] || 0) * guestRanges[range].max * hotel.quantity;
      });
      this.transports.forEach(transport => {
        total += (transport.prices[range] || 0) * guestRanges[range].max * transport.quantity;
      });
      this.restaurants.forEach(restaurant => {
        total += (restaurant.prices[range] || 0) * guestRanges[range].max * restaurant.quantity;
      });
      this.activities.forEach(activity => {
        total += (activity.prices[range] || 0) * guestRanges[range].max * activity.quantity;
      });

      this.maxsalePrices[range] = total;
    });
  }

  calculatePerGuestPrices(): void {
    const minGuests: { [key: string]: number } = {};
    const maxGuests: { [key: string]: number } = {};
    this.priceRanges.forEach(range => {
      const [min, max] = range.split('-').map(num => parseInt(num));
      minGuests[range] = min;
      maxGuests[range] = max;
    });
    this.priceRanges.forEach(range => {
      this.perGuestPrices[range] = Math.ceil(this.maxsalePrices[range] / minGuests[range]);
    });
  }

  backToList() {
    this.router.navigate(['head-business/list-tour']);
  }

  openAddHotelModal() {
    const doc = this.ssrService.getDocument();
    if (doc) {
      const modalElement = document.getElementById('addHotelModal');
      if (modalElement) {
        modalElement.classList.remove('hidden');
      }
    }
  }

  openAddTransportationModal(serviceId?: number) {
    this.addTransportationModal.serviceId = serviceId || null;
    const modalElement = document.getElementById('addTransportationModal');
    if (modalElement) {
      modalElement.classList.remove('hidden');
    }
  }

  openAddRestaurantModal(serviceId?: number) {
    this.addRestaurantModal.serviceId = serviceId || null;
    const modalElement = document.getElementById('addRestaurantModal');
    if (modalElement) {
      modalElement.classList.remove('hidden');
    }
  }

  openAddActivityModal(serviceId?: number) {
    this.addActivityModal.serviceId = serviceId || null;
    const modalElement = document.getElementById('addActivityModal');
    if (modalElement) {
      modalElement.classList.remove('hidden');
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

    this.calculateTourDays();
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }

  deleteHotel(index: number) {
    this.hotels.splice(index, 1);
    this.calculateTourDays();
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
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

    this.calculateTourDays();
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }

  deleteTransportation(index: number) {
    this.transports.splice(index, 1);
    this.calculateTourDays();
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
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

    this.calculateTourDays();
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }

  deleteRestaurant(index: number) {
    this.restaurants.splice(index, 1);
    this.calculateTourDays();
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
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

    this.calculateTourDays();
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }

  deleteActivity(index: number) {
    this.activities.splice(index, 1);
    this.calculateTourDays();
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }
}