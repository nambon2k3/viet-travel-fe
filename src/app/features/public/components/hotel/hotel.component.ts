import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Hotel {
  id: number;
  name: string;
  reviews: number;
  description: string;
  price: number;
  hotelClass: number; // 1, 2, 3, 4, 5 stars
  rating: number; // 1 to 5
}

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.css'
})
export class HotelComponent implements OnInit {
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];

  // Pagination
  totalHotels = 0;
  hotelsPerPage = 5;
  currentPage = 1;
  totalPages: number = 0;
  pages: number[] = [];

  // Filters
  minPrice = 0;
  maxPrice = 1000;
  hotelClassFilter: number | null = null;
  sortBy = '';
  ratingFilter = 0;
  minPercent = 0;
  maxPercent = 100;

  ngOnInit(): void {
    this.generateMockHotels(); // Temporary mock data
    this.calculatePagination();
    this.applyFilters();
  }

  clearFilters(): void {
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.hotelClassFilter = null;
    this.sortBy = '';
    this.ratingFilter = 0;
    this.currentPage = 1;
    this.applyFilters();
    this.updateSlider();
  }

  generateMockHotels(): void {
    this.hotels = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Hotel ${i + 1}`,
      reviews: Math.floor(Math.random() * 500),
      description: `Description for Hotel ${i + 1}`,
      price: Math.floor(Math.random() * 500) + 50, // Price between 50 and 550
      hotelClass: Math.floor(Math.random() * 5) + 1, // 1 to 5 stars
      rating: Math.floor(Math.random() * 5) + 1 // 1 to 5 rating
    }));

    this.totalHotels = this.hotels.length;
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalHotels / this.hotelsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changeRatingFilter(minRating: number): void {
    this.ratingFilter = minRating;
    this.applyFilters();
  }

  changeHotelClassFilter(selectedClass: number): void {
    this.hotelClassFilter = selectedClass;
    this.applyFilters();
  }

  applyFilters(): void {
    let hotels = [...this.hotels];

    // Apply price, hotel class, and rating filters
    hotels = hotels.filter(hotel =>
      hotel.price >= this.minPrice &&
      hotel.price <= this.maxPrice &&
      (this.hotelClassFilter === null || hotel.hotelClass === this.hotelClassFilter) &&
      hotel.rating >= this.ratingFilter
    );

    // Apply sorting
    if (this.sortBy) {
      switch (this.sortBy) {
        case 'priceAsc': hotels.sort((a, b) => a.price - b.price); break;
        case 'priceDesc': hotels.sort((a, b) => b.price - a.price); break;
        case 'classAsc': hotels.sort((a, b) => a.hotelClass - b.hotelClass); break;
        case 'classDesc': hotels.sort((a, b) => b.hotelClass - a.hotelClass); break;
      }
    }

    // Apply pagination
    this.totalHotels = hotels.length;
    this.calculatePagination();
    const start = (this.currentPage - 1) * this.hotelsPerPage;
    const end = start + this.hotelsPerPage;
    this.filteredHotels = hotels.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  onFilter(): void {
    this.currentPage = 1; // Reset to first page after filtering
    this.applyFilters();
  }

  onSort(): void {
    this.applyFilters();
  }

  updateSlider(): void {
    // Ensure min and max have a gap of at least $10
    const minGap = 10;
    if (this.maxPrice - this.minPrice < minGap) {
      if (this.minPrice + minGap <= 1000) {
        this.minPrice = this.maxPrice - minGap;
      } else {
        this.maxPrice = this.minPrice + minGap;
      }
    }

    // Update percentage positions for track styling
    this.minPercent = (this.minPrice / 1000) * 100;
    this.maxPercent = (this.maxPrice / 1000) * 100;

    this.applyFilters();
  }
}