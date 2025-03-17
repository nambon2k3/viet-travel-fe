import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyVndPipe } from "../../../../../shared/pipes/currency-vnd.pipe";
import { CommonModule } from '@angular/common';
import { AddHotelComponent } from "./add-hotel/add-hotel.component";
import { AddTransportationComponent } from './add-transportation/add-transportation.component';
import { AddRestaurantComponent } from "./add-restaurant/add-restaurant.component";
import { AddTourGuideComponent } from "./add-tour-guide/add-tour-guide.component";
import { AddActivityComponent } from "./add-activity/add-activity.component";

interface Hotel {
  name: string;
  location: string;
  netPrice: number;
  quantity: number;
  prices: PriceRange;
  day: number; // New field for tour day
}

interface Transport {
  name: string;
  type: string;
  netPrice: number;
  quantity: number;
  roomPrices: PriceRange;
  day: number; // New field for tour day
}

interface Restaurant {
  name: string;
  location: string;
  type: string;
  netPrice: number;
  quantity: number;
  roomPrices: PriceRange;
  day: number; // New field for tour day
}

interface TourGuide {
  name: string;
  provider: string;
  netPrice: number;
  quantity: number;
  roomPrices: PriceRange;
  day: number; // New field for tour day
}

interface Activity {
  name: string;
  provider: string;
  type: string;
  netPrice: number;
  quantity: number;
  roomPrices: PriceRange;
  day: number; // New field for tour day
}

interface PriceRange {
  [key: string]: number;
}

@Component({
  selector: 'app-tour-discount',
  imports: [CurrencyVndPipe,
     CommonModule, 
     AddHotelComponent, 
     AddTransportationComponent, 
     AddRestaurantComponent, 
     AddTourGuideComponent,
     AddActivityComponent
    ],
  templateUrl: './tour-discount.component.html',
  styleUrl: './tour-discount.component.css'
})
export class TourDiscountComponent {
  @ViewChild('addHotelModal') addHotelModal!: AddHotelComponent;
  @ViewChild('addTransportationModal') addTransportationModal!: AddTransportationComponent;
  @ViewChild('addRestaurantnModal') addRestaurantModal!: AddRestaurantComponent;
  @ViewChild('addTourGuidenModal') addTourGuideModal!: AddTourGuideComponent;
  @ViewChild('addActivityModal') addActivityModal!: AddActivityComponent;

  constructor(
    private router: Router
  ) { }

  hotels: Hotel[] = [
    {
      name: 'Melia Vinpearl Da...',
      location: 'Đà Nẵng',
      netPrice: 1200000,
      quantity: 1,
      prices: {
        '01-04': 1500000,
        '05-10': 1400000,
        '11-20': 1300000
      },
      day: 1 // Day 1
    },
    {
      name: 'Daue Hotel Da...',
      location: 'Đà Nẵng',
      netPrice: 1300000,
      quantity: 1,
      prices: {
        '01-04': 1600000,
        '05-10': 1500000,
        '11-20': 1400000
      },
      day: 2 // Day 2
    }
  ];

  transports: Transport[] = [
    {
      name: 'Hưng Sơn Limou...',
      type: 'Xe ô tô',
      netPrice: 250000,
      quantity: 1,
      roomPrices: {
        '01-04': 290000,
        '05-10': 280000,
        '11-20': 270000
      },
      day: 1 // Day 1
    },
    {
      name: 'Hikari',
      type: 'Xe ô tô',
      netPrice: 400000,
      quantity: 1,
      roomPrices: {
        '01-04': 700000,
        '05-10': 600000,
        '11-20': 500000
      },
      day: 2 // Day 2
    }
  ];

  restaurants: Restaurant[] = [
    {
      name: 'Long Beach Resta...',
      location: 'Đà Nẵng',
      type: 'Bữa trưa',
      netPrice: 200000,
      quantity: 1,
      roomPrices: {
        '01-04': 200000,
        '05-10': 200000,
        '11-20': 200000
      },
      day: 1 // Day 1
    },
    {
      name: 'Seafood Jump',
      location: 'Đà Nẵng',
      type: 'Bữa tối',
      netPrice: 300000,
      quantity: 1,
      roomPrices: {
        '01-04': 300000,
        '05-10': 300000,
        '11-20': 300000
      },
      day: 2 // Day 2
    },
    {
      name: 'Nét Huế Xưa',
      location: 'Huế',
      type: 'Bữa tối',
      netPrice: 300000,
      quantity: 1,
      roomPrices: {
        '01-04': 300000,
        '05-10': 300000,
        '11-20': 300000
      },
      day: 3 // Day 3
    },
    {
      name: 'King BBQ',
      location: 'Đà Nẵng',
      type: 'Bữa trưa',
      netPrice: 200000,
      quantity: 1,
      roomPrices: {
        '01-04': 200000,
        '05-10': 200000,
        '11-20': 200000
      },
      day: 2 // Day 2
    }
  ];

  tourGuides: TourGuide[] = [
    {
      name: 'Tour Guide',
      provider: 'Viet Travel',
      netPrice: 300000,
      quantity: 1,
      roomPrices: {
        '01-04': 300000,
        '05-10': 150000,
        '11-20': 100000
      },
      day: 1 // Day 1
    }
  ];

  activities: Activity[] = [
    {
      name: 'Canoe',
      provider: 'Viet Travel',
      type: 'Giải trí',
      netPrice: 600000,
      quantity: 1,
      roomPrices: {
        '01-04': 600000,
        '05-10': 600000,
        '11-20': 600000
      },
      day: 2 // Day 2
    },
    {
      name: 'Lặn',
      provider: 'Viet Travel',
      type: 'Giải trí',
      netPrice: 300000,
      quantity: 1,
      roomPrices: {
        '01-04': 300000,
        '05-10': 300000,
        '11-20': 300000
      },
      day: 3 // Day 3
    },
    {
      name: 'Ba Na Hills',
      provider: 'Sun Group',
      type: 'Vé tham quan',
      netPrice: 300000,
      quantity: 2,
      roomPrices: {
        '01-04': 300000,
        '05-10': 300000,
        '11-20': 300000
      },
      day: 2 // Day 2
    },
    {
      name: 'Kinh thành Huế',
      provider: 'Huế City',
      type: 'Vé tham quan',
      netPrice: 200000,
      quantity: 1,
      roomPrices: {
        '01-04': 200000,
        '05-10': 200000,
        '11-20': 200000
      },
      day: 3 // Day 3
    }
  ];

  addNewHotel(event: any) {
    const newHotel: Hotel = {
      name: event.name,
      location: event.location,
      netPrice: event.netPrice,
      quantity: 1, // Default quantity
      prices: event.prices.reduce((acc: PriceRange, price: any) => {
        acc[price.guests] = price.sellingPrice;
        return acc;
      }, {}),
      day: event.day // Use the selected day
    };
    this.hotels.push(newHotel);
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }

  addNewTransportation(event: any) {
    const newTransportation: Transport = {
      name: event.name,
      type: event.type,
      netPrice: event.netPrice,
      quantity: 1, // Default quantity
      roomPrices: event.prices.reduce((acc: PriceRange, price: any) => {
        acc[price.guests] = price.sellingPrice;
        return acc;
      }, {}),
      day: event.day // Use the selected day
    };
    this.transports.push(newTransportation);
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }

  addNewTourGuide(event: any) {
    const newTourGuide: TourGuide = {
      name: event.name,
      provider: event.provider,
      netPrice: event.netPrice,
      quantity: 1, // Default quantity
      roomPrices: event.prices.reduce((acc: PriceRange, price: any) => {
        acc[price.guests] = price.sellingPrice;
        return acc;
      }, {}),
      day: event.day // Use the selected day
    };
    this.tourGuides.push(newTourGuide);
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }

  addNewRestaurant(event: any) {
    const newRestaurant: Restaurant = {
      name: event.name,
      location: event.location,
      type: event.type,
      netPrice: event.netPrice,
      quantity: 1, // Default quantity
      roomPrices: event.prices.reduce((acc: PriceRange, price: any) => {
        acc[price.guests] = price.sellingPrice;
        return acc;
      }, {}),
      day: event.day // Use the selected day
    };
    this.restaurants.push(newRestaurant);
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }

  addNewActivity(event: any) {
    const newActivity: Activity = {
      name: event.name,
      provider: event.provider,
      type: event.type,
      netPrice: event.netPrice,
      quantity: 1, // Default quantity
      roomPrices: event.prices.reduce((acc: PriceRange, price: any) => {
        acc[price.guests] = price.sellingPrice;
        return acc;
      }, {}),
      day: event.day // Use the selected day
    };
    this.activities.push(newActivity);
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }

  priceRanges: string[] = []; // Will be populated from API
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

  private fetchPriceRanges(): void {
    // This would be your actual API call
    // For now, simulating with sample data
    this.priceRanges = ['01-04', '05-10', '11-20'];

    // Initialize price objects with ranges
    this.priceRanges.forEach(range => {
      this.mintotalNetPrices[range] = 0;
      this.maxtotalNetPrices[range] = 0;
      this.minsalePrices[range] = 0;
      this.maxsalePrices[range] = 0;
      this.perGuestPrices[range] = 0;
      this.perGuestNetPrices[range] = 0;
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

      // Assign to totalPrices
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

      // Assign to totalPrices
      this.maxsalePrices[range] = total;
    });
  }

  calculatePerGuestPrices(): void {
    const minGuests: { [key: string]: number } = {};
    const maxGuests: { [key: string]: number } = {}; // For clarity, though not used here directly
    this.priceRanges.forEach(range => {
      const [min, max] = range.split('-').map(num => parseInt(num));
      minGuests[range] = min;
      maxGuests[range] = max;
    });
    this.priceRanges.forEach(range => {
      if (range === '01-04') {
        // Special case for 1-4 range
        let totalMaxSale = 0;
        // Calculate total max sale price with special tour guide handling
        this.hotels.forEach(hotel => {
          totalMaxSale += (hotel.prices[range] || hotel.netPrice || 0) * hotel.quantity; // Base price, no guest scaling
        });
        this.transports.forEach(transport => {
          totalMaxSale += (transport.roomPrices[range] || transport.netPrice || 0) * transport.quantity;
        });
        this.restaurants.forEach(restaurant => {
          totalMaxSale += (restaurant.roomPrices[range] || restaurant.netPrice || 0) * restaurant.quantity;
        });
        this.tourGuides.forEach(tourGuide => {
          totalMaxSale += (tourGuide.roomPrices[range] || tourGuide.netPrice || 0) * tourGuide.quantity * 4; // Multiply by 4
        });
        this.activities.forEach(activity => {
          totalMaxSale += (activity.roomPrices[range] || activity.netPrice || 0) * activity.quantity;
        });
        // Calculate per-guest price: max sale price / min guests (1)
        this.perGuestPrices[range] = Math.ceil(totalMaxSale / minGuests[range]);
      } else {
        // Default case for other ranges
        this.perGuestPrices[range] = Math.ceil(this.maxsalePrices[range] / minGuests[range]);
      }
    });
  }

  ngOnInit() {
    this.fetchPriceRanges(); // Get ranges from API
    this.calculateTotalNetPrice();
    this.calculateTotalPrices();
    this.calculatePerGuestPrices();
    this.calculatePerGuestNetPrice();
  }

  backToList() {
    this.router.navigate(['head-business/list-tour']);
  }
}
