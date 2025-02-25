import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyVndPipe } from "../../../../shared/pipes/currency-vnd.pipe";

interface Tour {
  id: number;
  name: string;
  reviews: number;
  description: string;
  price: number;
  tourClass: number; // 1, 2, 3, 4, 5 stars
  rating: number; // 1 to 5
}

@Component({
  selector: 'app-tour',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyVndPipe],
  templateUrl: './tour.component.html',
  styleUrl: './tour.component.css'
})
export class TourComponent implements OnInit {
  tours: Tour[] = [];
  filteredTours: Tour[] = [];

  // Pagination
  totalTours = 0;
  toursPerPage = 5;
  currentPage = 1;
  totalPages: number = 0;
  pages: number[] = [];

  // Filters
  minPrice = 0;
  maxPrice = 1000000000;
  tourClassFilter: number | null = null;
  sortBy = '';
  ratingFilter = 0;
  minPercent = 0;
  maxPercent = 100;

  ngOnInit(): void {
    this.generateMockTours(); // Temporary mock data
    this.calculatePagination();
    this.applyFilters();
  }

  clearFilters(): void {
    this.minPrice = 0;
    this.maxPrice = 1000;
    this.tourClassFilter = null;
    this.sortBy = '';
    this.ratingFilter = 0;
    this.currentPage = 1;
    this.applyFilters();
    this.updateSlider();
  }

  generateMockTours(): void {
    this.tours = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `Tour ${i + 1}`,
      reviews: Math.floor(Math.random() * 500),
      description: `Description for Tour ${i + 1}`,
      price: Math.floor(Math.random() * 500) + 50, // Price between 50 and 550
      tourClass: Math.floor(Math.random() * 5) + 1, // 1 to 5 stars
      rating: Math.floor(Math.random() * 5) + 1 // 1 to 5 rating
    }));

    this.totalTours = this.tours.length;
    this.calculatePagination();
  }

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalTours / this.toursPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changeRatingFilter(minRating: number): void {
    this.ratingFilter = minRating;
    this.applyFilters();
  }

  changeTourClassFilter(selectedClass: number): void {
    this.tourClassFilter = selectedClass;
    this.applyFilters();
  }

  applyFilters(): void {
    let tours = [...this.tours];

    // Apply price, tour class, and rating filters
    tours = tours.filter(tour =>
      tour.price >= this.minPrice &&
      tour.price <= this.maxPrice &&
      (this.tourClassFilter === null || tour.tourClass === this.tourClassFilter) &&
      tour.rating >= this.ratingFilter
    );

    // Apply sorting
    if (this.sortBy) {
      switch (this.sortBy) {
        case 'priceAsc': tours.sort((a, b) => a.price - b.price); break;
        case 'priceDesc': tours.sort((a, b) => b.price - a.price); break;
        case 'classAsc': tours.sort((a, b) => a.tourClass - b.tourClass); break;
        case 'classDesc': tours.sort((a, b) => b.tourClass - a.tourClass); break;
      }
    }

    // Apply pagination
    this.totalTours = tours.length;
    this.calculatePagination();
    const start = (this.currentPage - 1) * this.toursPerPage;
    const end = start + this.toursPerPage;
    this.filteredTours = tours.slice(start, end);
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