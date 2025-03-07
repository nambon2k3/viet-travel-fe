import { Route } from "@angular/router";
import { PublicLayoutComponent } from "./layout/public-layout/public-layout.component";
import { HomepageComponent } from "./components/homepage/homepage.component";
import { BlogDetailComponent } from "./components/blog/blog-detail/blog-detail.component";
import { BlogComponent } from "./components/blog/blog.component";
import { HotelComponent } from "./components/hotel/hotel.component";
import { TourComponent } from "./components/tour/tour.component";
import { TourDetailComponent } from "./components/tour/tour-detail/tour-detail.component";
import { TourBookingComponent } from "./components/tour-booking/tour-booking.component";
import { TourBookingConfirmComponent } from "./components/tour-booking/tour-booking-confirm/tour-booking-confirm.component";

export const PUBLIC_ROUTES: Route[] = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: 'homepage',
        component: HomepageComponent,
      },
      // {
      //   path: 'blog-details/:id',
      //   component: BlogDetailComponent,
      // },
      {
        path: 'blogs',
        component: BlogComponent,
      },
      {
        path: 'hotels',
        component: HotelComponent,
      },
      {
        path: 'tours',
        component: TourComponent,
      },
      {
        path: 'tour-details/:id',
        component: TourDetailComponent,
      },
      {
        path: 'tour-booking',
        component: TourBookingComponent,
      }
      ,{
        path: 'tour-booking-confirm/:code',
        component: TourBookingConfirmComponent,
      }
    ]
  },
];