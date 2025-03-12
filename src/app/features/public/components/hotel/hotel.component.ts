import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HotelService } from '../../services/hotel.service';
import { Hotel } from '../../../../core/models/hotel.model';
import { CurrencyVndPipe } from "../../../../shared/pipes/currency-vnd.pipe";
import { SsrService } from '../../../../core/services/ssr.service';
import { Router } from '@angular/router';
import { Locations } from '../../../../core/models/location.model';

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyVndPipe],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.css'
})
export class HotelComponent implements OnInit {
  hotels = signal<Hotel[]>([]);

  // Pagination
  totalItems = 0;
  size = 10;
  keyword = '';
  currentPage: number = 0;
  totalPages: number = 0;
  private map!: L.Map;

  // Filters
  minPrice = 0;
  maxPrice = 200000000;
  sortBy = '';
  ratingFilter = 0;
  minPercent = 0;
  maxPercent = 100;
  hotelClassFilter = 0;

  constructor(
    private hotelService: HotelService,
    private ssrService: SsrService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getHotels();
  }

  goToDetail(id: number): void {
    this.router.navigate(['/hotel-details', id]);
  }

  getHotels(): void {
    this.hotelService.getHotels(
      this.currentPage,
      this.size,
      this.keyword,
      this.hotelClassFilter,
      this.maxPrice,
      this.minPrice,
      //sortBy ?: string
    ).subscribe({
      next: (response) => {
        this.hotels.set(response.data.items);
        this.totalItems = response.data.total;
        this.currentPage = response.data.page;
        this.size = response.data.size;
        this.totalPages = (Math.ceil(this.totalItems / this.size));
      },
      error: (err) => {
        console.error('Failed to load hotels:', err);
      }
    });
  }

  filteredHotels = computed(() => {
    return this.hotels();
  });

  clearFilters(): void {
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.hotelClassFilter = 0;
    // this.sortBy = '';
    this.ratingFilter = 0;
    this.currentPage = 1;
    this.applyFilters();
    this.updateSlider();
  }

  onLocationInput(): void {
    this.applyFilters();
  }


  changeHotelClassFilter(selectedClass: number): void {
    this.hotelClassFilter = selectedClass;
    this.applyFilters();
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.getHotels();
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getHotels();
    }
  }

  onSort(): void {
    this.applyFilters();
  }

  updateSlider(): void {
    // Ensure min and max have a gap of at least $10
    const minGap = 10;
    if (this.maxPrice - this.minPrice < minGap) {
      if (this.minPrice + minGap <= 100000) {
        this.minPrice = this.maxPrice - minGap;
      } else {
        this.maxPrice = this.minPrice + minGap;
      }
    }

    // Update percentage positions for track styling
    this.minPercent = (this.minPrice / 200000000) * 100;
    this.maxPercent = (this.maxPrice / 200000000) * 100;

    this.applyFilters();
  }

  ngAfterViewInit(): void {
    if (this.ssrService.isBrowser) {
      this.initMap();
    }
  }

  getStars(count: number): number[] {
    return Array.from({ length: count }, (_, i) => i);
  }

  private async initMap(): Promise<void> {
    const L = await import('leaflet');

    this.map = L.map('map').setView([21.0285, 105.8542], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([21.0285, 105.8542]).addTo(this.map)
  }

  openMap(): void {
    this.map.invalidateSize();
  }
}