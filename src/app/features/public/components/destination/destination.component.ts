import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../../../shared/components/footer/footer.component";
import { ActivatedRoute, Router } from '@angular/router';
import { Locations } from '../../../../core/models/location.model';
import { DestinationService } from '../../services/destination.service';
import { Blog } from '../../../../core/models/blog.model';
import { Activity, Tour } from '../../../../core/models/homepage.model';

@Component({
  selector: 'app-destination',
  imports: [CommonModule, FooterComponent],
  standalone: true,
  templateUrl: './destination.component.html',
  styleUrls: ['./destination.component.css']
})
export class DestinationComponent implements OnInit {
  location: Locations | null = null;
  blogs: Blog[] | null = null;
  activities: Activity[] | null = null;
  tours: Tour[] | null = null;
  hotels: any[] | null = null;

  recommendedLocations: Locations[] = [];
  currentIndex: number = 0;

  constructor(
    private destinationService: DestinationService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadLocation(id);
    }
  }

  loadLocation(id: string) {
    this.destinationService.getDestinationById(id).subscribe({
      next: (res) => {
        this.location = res.data;
        this.blogs = res.data.blogs;
        this.activities = res.data.activities;
        this.tours = res.data.tours;
        this.hotels = res.data.hotels;
        this.recommendedLocations = res.data.locations;
      },
      error: (err) => {
        console.error('Fetching location data failed:', err);
      }
    });
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.recommendedLocations.length - 3;
    }
  }
  
  nextSlide() {
    if (this.currentIndex < this.recommendedLocations.length - 3) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; 
    }
  }  

  getPrice(price: number) {
    if (price > 0 && price != null) {
      return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) + '/ vé';
    } else {
      return 'Miễn phí';
    }
  }

  getPriceTour(price: number) {
    if (price > 0 && price != null) {
      return 'Giá từ: ' + price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) + '/ người';
    } else {
      return 'Miễn phí';
    }
  }

  openBlogDetail(blogid: number | undefined) {
    if (blogid) {
      this.router.navigate(['/blog-details', blogid]);
    } else {
      console.error('Invalid blog id');
    }
  }
}