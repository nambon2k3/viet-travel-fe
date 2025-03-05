import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyVndPipe } from "../../../../../shared/pipes/currency-vnd.pipe";
import { CommonModule } from '@angular/common';

interface Hotel {
  name: string;
  location: string;
  netPrice: number;
  quantity: number;
  prices: { [key: string]: number };
}

interface Transport {
  name: string;
  type: string;
  netPrice: number;
  quantity: number;
  price: number;
  roomPrices: { [key: string]: number };
}

interface Restaurant {
  name: string;
  location: string;
  type: string;
  netPrice: number;
  quantity: number;
  price: number;
  roomPrices: { [key: string]: number };
}

interface TourGuide {
  name: string;
  provider: string;
  netPrice: number;
  quantity: number;
  price: number;
  roomPrices: { [key: string]: number };
}

interface Activity {
  name: string;
  provider: string;
  type: string;
  netPrice: number;
  quantity: number;
  price: number;
  roomPrices: { [key: string]: number };
}

@Component({
  selector: 'app-tour-discount',
  imports: [CurrencyVndPipe, CommonModule],
  templateUrl: './tour-discount.component.html',
  styleUrl: './tour-discount.component.css'
})
export class TourDiscountComponent {

  constructor(
    private router : Router
  ) { }

  backToList() {
    this.router.navigate(['head-business/list-tour']);
  }

  hotels: Hotel[] = [
    {
      name: 'Melia Vinpearl Da...',
      location: 'Đà Nẵng',
      netPrice: 1200000,
      quantity: 1,
      prices: {
        '01-04': 1200000,
        '05-10': 1200000,
        '11-20': 1100000
      }
    },
    {
      name: 'Daue Hotel Da...',
      location: 'Đà Nẵng',
      netPrice: 1300000,
      quantity: 1,
      prices: {
        '01-04': 1300000,
        '05-10': 1300000,
        '11-20': 1200000
      }
    }
  ];

  transports: Transport[] = [
    {
      name: 'Hưng Sơn Limou...',
      type: 'Xe ô tô',
      netPrice: 250000,
      quantity: 1,
      price: 250000,
      roomPrices: {
        '01-04': 250000,
        '05-10': 250000,
        '11-20': 250000
      }
    },
    {
      name: 'Hikari',
      type: 'Xe ô tô',
      netPrice: 400000,
      quantity: 1,
      price: 400000,
      roomPrices: {
        '01-04': 400000,
        '05-10': 500000,
        '11-20': 400000
      }
    }
  ];

  restaurants: Restaurant[] = [
    {
      name: 'Long Beach Resta...',
      location: 'Đà Nẵng',
      type: 'Bữa trưa',
      netPrice: 200000,
      quantity: 1,
      price: 200000,
      roomPrices: {
        '01-04': 200000,
        '05-10': 200000,
        '11-20': 200000
      }
    },
    {
      name: 'Seafood Jump',
      location: 'Đà Nẵng',
      type: 'Bữa tối',
      netPrice: 300000,
      quantity: 1,
      price: 300000,
      roomPrices: {
        '01-04': 300000,
        '05-10': 300000,
        '11-20': 300000
      }
    },
    {
      name: 'Nét Huế Xưa',
      location: 'Huế',
      type: 'Bữa tối',
      netPrice: 300000,
      quantity: 1,
      price: 300000,
      roomPrices: {
        '01-04': 300000,
        '05-10': 300000,
        '11-20': 300000
      }
    },
    {
      name: 'King BBQ',
      location: 'Đà Nẵng',
      type: 'Bữa trưa',
      netPrice: 200000,
      quantity: 1,
      price: 200000,
      roomPrices: {
        '01-04': 200000,
        '05-10': 200000,
        '11-20': 200000
      }
    }
  ];

  tourGuides: TourGuide[] = [
    {
      name: 'Tour Guide',
      provider: 'Viet Travel',
      netPrice: 300000,
      quantity: 1,
      price: 300000,
      roomPrices: {
        '01-04': 300000,
        '05-10': 150000,
        '11-20': 100000
      }
    }
  ];

  activities: Activity[] = [
    {
      name: 'Canoe',
      provider: 'Viet Travel',
      type: 'Giải trí',
      netPrice: 600000,
      quantity: 1,
      price: 600000,
      roomPrices: {
        '01-04': 600000,
        '05-10': 600000,
        '11-20': 600000
      }
    },
    {
      name: 'Lặn',
      provider: 'Viet Travel',
      type: 'Giải trí',
      netPrice: 300000,
      quantity: 1,
      price: 300000,
      roomPrices: {
        '01-04': 300000,
        '05-10': 300000,
        '11-20': 300000
      }
    },
    {
      name: 'Ba Na Hills',
      provider: 'Sun Group',
      type: 'Vé tham quan',
      netPrice: 300000,
      quantity: 1,
      price: 300000,
      roomPrices: {
        '01-04': 300000,
        '05-10': 300000,
        '11-20': 300000
      }
    },
    {
      name: 'Kinh thành Huế',
      provider: 'Huế City',
      type: 'Vé tham quan',
      netPrice: 200000,
      quantity: 1,
      price: 200000000,
      roomPrices: {
        '01-04': 200000900,
        '05-10': 200000900,
        '11-20': 200000900
      }
    }
  ];

  totalNetPrice: number = 7900000;
  totalPrices: { [key: string]: number } = {
    '01-04': 7900000,
    '05-10': 7900000,
    '11-20': 6700000
  };
  totalSalePrice: number = 0;
  salePrices: { [key: string]: number } = {
    '01-04': 0,
    '05-10': 0,
    '11-20': 0
  };
  perGuestPrice: number = 0;
  perGuestPrices: { [key: string]: number } = {
    '01-04': 0,
    '05-10': 0,
    '11-20': 0
  };

  ngOnInit() {
    // You can fetch data from an API or service here
    // this.loadHotels();
  }

  // Optional: Method to load hotels from an API
  loadHotels() {
    // Example: Fetch data from a service or API
    // this.hotels = this.hotelService.getHotels();
  }
}
