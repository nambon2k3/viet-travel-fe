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
  selectedCategory: string = 'Tìm kiếm tất cả';
  searchPlaceholder: string = 'Tim kiếm...';
  searchTitle: string = 'Địa điểm nào đáng để khám phá?';
  userProfile: any;

  categories = [
    { name: 'Tìm kiếm tất cả', title: "Địa điểm nào đáng để khám phá?", placeholder: 'Địa điểm, hoạt động, khách sạn...' },
    { name: 'Khách sạn', title: "Nghỉ ngơi ở nơi tuyệt vời", placeholder: 'Tên khách sạn hoặc điểm đến' },
    { name: 'Nhà hàng', title: "Tìm địa điểm ăn uống", placeholder: 'Nhà hàng hoặc điểm đến' },
    { name: 'Chuyến bay', title: "Tìm chuyến bay tốt nhất", placeholder: 'Tìm kiếm chuyến bay...' },
    { name: 'Hoạt động', title: "Trải nghiệm điều mới mẻ", placeholder: 'Điểm tham quan, hoạt động hoặc điểm đến' },
    { name: 'Tour', title: "Khám phá những tour du lịch tuyệt vời", placeholder: 'Tour hoặc điểm đến' }
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
      this.fetchHomepageData();
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
