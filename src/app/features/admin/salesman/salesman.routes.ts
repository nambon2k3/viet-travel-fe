import { Route } from "@angular/router";
import { LayoutComponent } from "../layout/layout.component";
import { ListBookingComponent } from "./components/list-booking/list-booking.component";
import { AddBookingComponent } from "./components/add-booking/add-booking.component";
import { BookingDetailComponent } from "./components/booking-detail/booking-detail.component";
import { TourListBookingComponent } from "./components/tour-list-booking/tour-list-booking.component";

export const SALESMAN_ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'list-booking',
        component: ListBookingComponent
      },
      {
        path: 'add-booking',
        component: AddBookingComponent
      }
    ]
  },
  {
    path: 'booking-detail',
    component: BookingDetailComponent
  }, 
  {
    path: 'tour-list-booking',
    component: TourListBookingComponent
  },
];