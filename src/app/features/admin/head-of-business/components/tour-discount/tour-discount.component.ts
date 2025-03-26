import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyVndPipe } from "../../../../../shared/pipes/currency-vnd.pipe";
import { CommonModule } from '@angular/common';
import { AddHotelComponent } from "./add-hotel/add-hotel.component";
import { AddTransportationComponent } from './add-transportation/add-transportation.component';
import { AddRestaurantComponent } from "./add-restaurant/add-restaurant.component";
import { AddTourGuideComponent } from "./add-tour-guide/add-tour-guide.component";
import { AddActivityComponent } from "./add-activity/add-activity.component";
import { ConfigTourPaxComponent } from "./config-tour-pax/config-tour-pax.component";
import { TourDiscountService } from '../../services/discount.service';

interface PriceRange {
  [key: string]: number;
}

interface PaxOption {
  id: number;
  minPax: number;
  maxPax: number;
  paxRange: string;
}

interface Hotel {
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

interface Transport {
  id: number;
  name: string;
  type: string;
  netPrice: number;
  sellingPrice: number;
  quantity: number;
  roomPrices: PriceRange;
  day: number;
  status: string;
  serviceProviderName: string;
  serviceProviderId: number;
}

interface Restaurant {
  id: number;
  name: string;
  location: string;
  type: string;
  netPrice: number;
  sellingPrice: number;
  quantity: number;
  roomPrices: PriceRange;
  day: number;
  status: string;
  serviceProviderName: string;
  serviceProviderId: number;
}

interface TourGuide {
  id: number;
  name: string;
  provider: string;
  netPrice: number;
  sellingPrice: number;
  quantity: number;
  roomPrices: PriceRange;
  day: number;
  status: string;
  serviceProviderName: string;
  serviceProviderId: number;
}

interface Activity {
  id: number;
  name: string;
  provider: string;
  type: string;
  netPrice: number;
  sellingPrice: number;
  quantity: number;
  roomPrices: PriceRange;
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
    AddTourGuideComponent,
    AddActivityComponent,
    ConfigTourPaxComponent,
  ],
  templateUrl: './tour-discount.component.html',
  styleUrls: ['./tour-discount.component.css']
})
export class TourDiscountComponent implements OnInit, AfterViewInit {
  @ViewChild('addHotelModal') addHotelModal!: AddHotelComponent;
  @ViewChild('addTransportationModal') addTransportationModal!: AddTransportationComponent;
  @ViewChild('addRestaurantModal') addRestaurantModal!: AddRestaurantComponent;
  @ViewChild('addTourGuideModal') addTourGuideModal!: AddTourGuideComponent;
  @ViewChild('addActivityModal') addActivityModal!: AddActivityComponent;
  @ViewChild('tourConfigPaxModal') tourConfigPaxModal!: ConfigTourPaxComponent;

  tourId: number = 10;
  tourName: string = '';

  hotels: Hotel[] = [];
  transports: Transport[] = [];
  restaurants: Restaurant[] = [];
  tourGuides: TourGuide[] = [];
  activities: Activity[] = [];

  priceRanges: string[] = [];
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
    private tourDiscountService: TourDiscountService
  ) {}

  ngOnInit() {
    this.fetchTourData();
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      import('flowbite').then(module => {
        module.initFlowbite();
      });
    }
  }

  fetchTourData() {
    this.tourDiscountService.getTourDiscount(this.tourId).subscribe({
      next: (response: ApiResponse) => {
        if (response.code === 200) {
          const data = response.data;
          this.tourName = data.tourName;
          this.priceRanges = data.paxOptions.map(pax => pax.paxRange);
          this.priceRanges.forEach(range => {
            this.mintotalNetPrices[range] = 0;
            this.maxtotalNetPrices[range] = 0;
            this.minsalePrices[range] = 0;
            this.maxsalePrices[range] = 0;
            this.perGuestPrices[range] = 0;
            this.perGuestNetPrices[range] = 0;
          });

          data.serviceCategories.forEach(category => {
            if (category.categoryName === 'Hotel') {
              this.hotels = category.services.map((service: any) => ({
                id: service.id,
                name: service.name,
                location: service.locationName,
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
              }));
            }
          });

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
      this.tourGuides.forEach(tourGuide => {
        totalForRange += tourGuide.netPrice * tourGuide.quantity * guestRanges[range].min;
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
      this.tourGuides.forEach(tourGuide => {
        totalForRange += tourGuide.netPrice * tourGuide.quantity * guestRanges[range].max;
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
        total += (transport.roomPrices[range] || 0) * guestRanges[range].min * transport.quantity;
      });
      this.restaurants.forEach(restaurant => {
        total += (restaurant.roomPrices[range] || 0) * guestRanges[range].min * restaurant.quantity;
      });
      this.tourGuides.forEach(tourGuide => {
        total += (tourGuide.roomPrices[range] || 0) * guestRanges[range].min * tourGuide.quantity;
      });
      this.activities.forEach(activity => {
        total += (activity.roomPrices[range] || 0) * guestRanges[range].min * activity.quantity;
      });

      this.minsalePrices[range] = total;

      total = 0;
      this.hotels.forEach(hotel => {
        total += (hotel.prices[range] || 0) * guestRanges[range].max * hotel.quantity;
      });
      this.transports.forEach(transport => {
        total += (transport.roomPrices[range] || 0) * guestRanges[range].max * transport.quantity;
      });
      this.restaurants.forEach(restaurant => {
        total += (restaurant.roomPrices[range] || 0) * guestRanges[range].max * restaurant.quantity;
      });
      this.tourGuides.forEach(tourGuide => {
        total += (tourGuide.roomPrices[range] || 0) * guestRanges[range].max * tourGuide.quantity;
      });
      this.activities.forEach(activity => {
        total += (activity.roomPrices[range] || 0) * guestRanges[range].max * activity.quantity;
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

  openAddHotelModal(serviceId?: number) {
    this.addHotelModal.serviceId = serviceId || null;
    const modalElement = document.getElementById('addHotelModal');
    if (modalElement) {
      modalElement.classList.remove('hidden');
    }
  }

  addNewHotel(event: { formData: any, isUpdate: boolean }) {
    const { formData, isUpdate } = event;
    const hotelData = {
      dayNumber: formData.day,
      locationId: formData.locationId,
      serviceProviderId: formData.serviceProviderId,
      name: formData.name,
      nettPrice: formData.netPrice,
      status: formData.status,
      paxPrices: formData.prices.reduce((acc: any, price: any) => {
        const [min, max] = price.guests.split(' ')[0].split('-').map((num: string) => parseInt(num));
        acc[price.guests] = {
          paxId: 0, // This should be set by the backend or fetched
          minPax: min,
          maxPax: max,
          paxRange: price.guests,
          price: price.sellingPrice
        };
        return acc;
      }, {})
    };

    if (isUpdate && this.addHotelModal.serviceId) {
      this.tourDiscountService.updateService(this.tourId, this.addHotelModal.serviceId, hotelData).subscribe({
        next: (response: any) => {
          if (response.code === 0) {
            const index = this.hotels.findIndex(h => h.id === this.addHotelModal.serviceId);
            if (index !== -1) {
              this.hotels[index] = {
                id: this.addHotelModal.serviceId!,
                name: formData.name,
                location: this.hotels[index].location, // Update with actual location name if needed
                netPrice: formData.netPrice,
                sellingPrice: formData.netPrice,
                quantity: 1,
                prices: formData.prices.reduce((acc: PriceRange, price: any) => {
                  acc[price.guests] = price.sellingPrice;
                  return acc;
                }, {}),
                day: formData.day,
                status: 'ACTIVE',
                serviceProviderName: this.hotels[index].serviceProviderName,
                serviceProviderId: formData.serviceProviderId
              };
            }
            this.calculateTotalNetPrice();
            this.calculateTotalPrices();
            this.calculatePerGuestPrices();
            this.calculatePerGuestNetPrice();
          }
        },
        error: (error: any) => {
          console.error('Error updating hotel:', error);
        }
      });
    } else {
      this.tourDiscountService.addService(this.tourId, hotelData).subscribe({
        next: (response: any) => {
          if (response.code === 0) {
            const newHotel: Hotel = {
              id: response.data.id || 0,
              name: formData.name,
              location: '', // Update with actual location name if needed
              netPrice: formData.netPrice,
              sellingPrice: formData.netPrice,
              quantity: 1,
              prices: formData.prices.reduce((acc: PriceRange, price: any) => {
                acc[price.guests] = price.sellingPrice;
                return acc;
              }, {}),
              day: formData.day,
              status: 'ACTIVE',
              serviceProviderName: '', // Update with actual provider name if needed
              serviceProviderId: formData.serviceProviderId
            };
            this.hotels.push(newHotel);
            this.calculateTotalNetPrice();
            this.calculateTotalPrices();
            this.calculatePerGuestPrices();
            this.calculatePerGuestNetPrice();
          }
        },
        error: (error: any) => {
          console.error('Error adding hotel:', error);
        }
      });
    }
  }

  deleteHotel(index: number) {
    this.hotels.splice(index, 1);
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }

  addNewTransportation(event: any) {
    const newTransportation: Transport = {
      id: 0,
      name: event.name,
      type: event.type,
      netPrice: event.netPrice,
      sellingPrice: event.netPrice,
      quantity: 1,
      roomPrices: event.prices.reduce((acc: PriceRange, price: any) => {
        acc[price.guests] = price.sellingPrice;
        return acc;
      }, {}),
      day: event.day,
      status: 'ACTIVE',
      serviceProviderName: event.serviceProviderName || '',
      serviceProviderId: event.serviceProviderId || 0
    };
    this.transports.push(newTransportation);
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }

  addNewTourGuide(event: any) {
    const newTourGuide: TourGuide = {
      id: 0,
      name: event.name,
      provider: event.provider,
      netPrice: event.netPrice,
      sellingPrice: event.netPrice,
      quantity: 1,
      roomPrices: event.prices.reduce((acc: PriceRange, price: any) => {
        acc[price.guests] = price.sellingPrice;
        return acc;
      }, {}),
      day: event.day,
      status: 'ACTIVE',
      serviceProviderName: event.serviceProviderName || '',
      serviceProviderId: event.serviceProviderId || 0
    };
    this.tourGuides.push(newTourGuide);
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }

  addNewRestaurant(event: any) {
    const newRestaurant: Restaurant = {
      id: 0,
      name: event.name,
      location: event.location,
      type: event.type,
      netPrice: event.netPrice,
      sellingPrice: event.netPrice,
      quantity: 1,
      roomPrices: event.prices.reduce((acc: PriceRange, price: any) => {
        acc[price.guests] = price.sellingPrice;
        return acc;
      }, {}),
      day: event.day,
      status: 'ACTIVE',
      serviceProviderName: event.serviceProviderName || '',
      serviceProviderId: event.serviceProviderId || 0
    };
    this.restaurants.push(newRestaurant);
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }

  addNewActivity(event: any) {
    const newActivity: Activity = {
      id: 0,
      name: event.name,
      provider: event.provider,
      type: event.type,
      netPrice: event.netPrice,
      sellingPrice: event.netPrice,
      quantity: 1,
      roomPrices: event.prices.reduce((acc: PriceRange, price: any) => {
        acc[price.guests] = price.sellingPrice;
        return acc;
      }, {}),
      day: event.day,
      status: 'ACTIVE',
      serviceProviderName: event.serviceProviderName || '',
      serviceProviderId: event.serviceProviderId || 0
    };
    this.activities.push(newActivity);
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }
}