import { CommonModule } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyVndPipe } from "../../../../shared/pipes/currency-vnd.pipe";
import { SsrService } from '../../../../core/services/ssr.service';
import { TourService } from '../../services/tour.service/tour.service';
import { Tour } from '../../../../core/models/public-tour.model';
import { FooterComponent } from "../../../../shared/components/footer/footer.component";
import { shareReplay } from 'rxjs';

@Component({
  selector: 'app-tour',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyVndPipe,
    FooterComponent
  ],
  templateUrl: './tour.component.html',
  styleUrl: './tour.component.css'
})
export class TourComponent implements OnInit {
  tours = signal<Tour[]>([]);

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
  // sortBy = '';
  minPercent = 0;
  maxPercent = 100;

  duration = 0;
  fromDate = new Date('2021-01-01');
  tourData$;

  constructor(
    private tourService: TourService, private ssrService: SsrService,
  ) {
    this.tourData$ = this.tourService.getTours(
      this.currentPage,
      this.size,
      this.keyword,
      this.minPrice,
      this.maxPrice,
      this.duration,
      this.fromDate
    ).pipe(
      shareReplay(1)
    );
  }

  ngOnInit(): void {
    const document = this.ssrService.getDocument();
    if (document) {
      const cachedTimestamp = localStorage.getItem('tourDataTimestamp');
      const cacheExpiration = 24 * 60 * 60 * 1000;

      const cachedData = localStorage.getItem('tourData');
      if (cachedData && cachedTimestamp) {
        const now = new Date().getTime();
        if (now - parseInt(cachedTimestamp) < cacheExpiration) {
          const data = JSON.parse(cachedData);
          this.tours.set(data.items);
          this.totalItems = data.total;
          this.currentPage = 0;
          this.size = data.size;
          return;
        }
      }
      this.getTours();
    }
  }

  getTours(): void {
    this.tourService.getTours(
      this.currentPage,
      this.size,
      this.keyword,
      this.minPrice,
      this.maxPrice,
      this.duration,
      this.fromDate
      //sortBy ?: string
    ).subscribe({
      next: (response) => {
        this.tours.set(response.data.items);
        this.totalItems = response.data.total;
        this.currentPage = response.data.page;
        this.size = response.data.size;
        this.totalPages = (Math.ceil(this.totalItems / this.size));

        // Cache the data
        const local = this.ssrService.getLocalStorage();
        if (local) {
          localStorage.setItem('tourData', JSON.stringify(response.data));
          localStorage.setItem('tourDataTimestamp', new Date().getTime().toString());
        }
      },
      error: (err) => {
        console.error('Failed to load tours:', err);
      }
    });
  }

  filteredTours = computed(() => {
    return this.tours();
  });

  clearFilters(): void {
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.duration = 0;
    // this.sortBy = '';
    this.fromDate = new Date();
    this.currentPage = 1;
    this.applyFilters();
    this.updateSlider();
  }

  changeTourDuration(durationInput: number): void {
    this.duration = durationInput;
    this.applyFilters();
  }

  changeTourDate(date: Date): void {
    this.fromDate = date;
    this.applyFilters();
  }

  onDurationChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.valueAsNumber;
    if (!isNaN(value)) {
      this.changeTourDuration(value);
    }
  }

  onDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.valueAsDate;
    if (value) {
      this.changeTourDate(value);
    }
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.getTours();
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.getTours();
    }
  }

  onSort(): void {
    this.applyFilters();
  }

  updateSlider(): void {
    const minGap = 10;
    if (this.maxPrice - this.minPrice < minGap) {
      if (this.minPrice + minGap <= 100000) {
        this.minPrice = this.maxPrice - minGap;
      } else {
        this.maxPrice = this.minPrice + minGap;
      }
    }

    this.minPercent = (this.minPrice / 200000000) * 100;
    this.maxPercent = (this.maxPrice / 200000000) * 100;

    this.applyFilters();
  }

  ngAfterViewInit(): void {
    if (this.ssrService.isBrowser) {
      this.initMap();
    }
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