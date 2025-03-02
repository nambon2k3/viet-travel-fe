import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FooterComponent } from "../../../../shared/components/footer/footer.component";
import { HomepageService } from '../../services/homepage.service';
import { Activity, Blog, Tour, Location } from '../../../../core/models/homepage.model';
import { shareReplay } from 'rxjs';
import { Router } from '@angular/router';
import { CurrencyVndPipe } from "../../../../shared/pipes/currency-vnd.pipe";
import { SsrService } from '../../../../core/services/ssr.service';

@Component({
  selector: 'app-homepage',
  imports: [
    AngularSvgIconModule,
    CommonModule,
    FooterComponent,
    CurrencyVndPipe,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  selectedCategory: string = 'Search All';
  searchPlaceholder: string = 'Search...';
  searchTitle: string = 'Where to?';
  userProfile: any;

  categories = [
    { name: 'Search All', title: "Where to?", placeholder: 'Places to go, things to do, hotels...' },
    { name: 'Hotels', title: "Stay somewhere great", placeholder: 'Hotel name or destination' },
    { name: 'Restaurants', title: "Find places to eat", placeholder: 'Restaurant or destination' },
    { name: 'Flights', title: "Find the best flight", placeholder: 'Search for Flights...' },
    { name: 'Activity', title: "Exprience something new", placeholder: 'Attraction, activity or destination' },
    { name: 'Tours', title: "Explore the best tours", placeholder: 'Tour or destination' }
  ];

  selectCategory(category: any) {
    this.selectedCategory = category.name;
    this.searchPlaceholder = category.placeholder;
    this.searchTitle = category.title;
  }

  trendingTours: Tour[] = [];
  locations: Location[] = [];
  blogs: Blog[] = [];
  blog: Blog | undefined;
  activities: Activity[] = [];
  topTourOfYear: Tour | undefined;
  homepageData$;

  constructor(
    private homepageService: HomepageService,
    private router: Router,
    private ssrService: SsrService,
  ) {
    this.homepageData$ = this.homepageService.getHomepageData(6, 4, 3, 7).pipe(
      shareReplay(1)
    );
  }

  ngOnInit() {
    const document = this.ssrService.getDocument();
    if (document) {
      const cachedTimestamp = localStorage.getItem('homepageDataTimestamp');
      const cacheExpiration = 30 * 60 * 1000;

      const cachedData = localStorage.getItem('homepageData');
      if (cachedData && cachedTimestamp) {
        const now = new Date().getTime();
        if (now - parseInt(cachedTimestamp) < cacheExpiration) {
          const data = JSON.parse(cachedData);
          this.trendingTours = data.trendingTours;
          this.topTourOfYear = data.topTourOfYear;
          this.blogs = data.newBlogs.slice(0, 3);
          this.blog = data.newBlogs[data.newBlogs.length - 1];
          this.activities = data.recommendedActivities;
          this.locations = data.recommendedLocations;
          return; // Sử dụng cache, không gọi API
        }
      }
      this.fetchHomepageData();
    }
  }

  fetchHomepageData() {
    this.homepageService.getHomepageData(6, 4, 3, 7).subscribe({
      next: (res) => {
        if (res.code !== 200) {
          console.error('Fetching homepage data:', res.message);
          return;
        }
        this.trendingTours = res.data.trendingTours;
        this.topTourOfYear = res.data.topTourOfYear;
        this.blogs = res.data.newBlogs.slice(0, 3);
        this.blog = res.data.newBlogs[res.data.newBlogs.length - 1];
        this.activities = res.data.recommendedActivities;
        this.locations = res.data.recommendedLocations;

        // Cache the data
        const local = this.ssrService.getLocalStorage();
        if (local) {
          localStorage.setItem('homepageData', JSON.stringify(res.data));
          localStorage.setItem('homepageDataTimestamp', new Date().getTime().toString());
        }
      },
      error: (err) => {
        console.error('Fetching homepage data:', err);
      }
    });
  }

  openBlogDetail(blogid: number | undefined) {
    if (blogid) {
      this.router.navigate(['/blog-details', blogid]);
    } else {
      console.error('Invalid blog id');
    }
  }

}
