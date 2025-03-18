import { Route } from "@angular/router";
import { LayoutComponent } from "../layout/layout.component";
import { ListBookingComponent } from "./components/list-booking/list-booking.component";
import { AddBookingComponent } from "./components/add-booking/add-booking.component";
import { BookingDetailComponent } from "./components/booking-detail/booking-detail.component";
import { TourListBookingComponent } from "./components/tour-list-booking/tour-list-booking.component";
import { ListTourPrivateComponent } from "./components/list-tour-private/list-tour-private.component";
import { ListTourPublicComponent } from "./components/list-tour-public/list-tour-public.component";
import { CreatePublicBookingComponent } from "./components/create-public-booking/create-public-booking.component";

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
      },
      {
        path: 'list-tour-private',
        component: ListTourPrivateComponent
      },
      {
        path: 'list-tour-public',
        component: ListTourPublicComponent
      }, 
      {
        path: 'tour-list-booking/:tourId',
        component: TourListBookingComponent
      },
      {
        path: 'tour-list-booking/:tourId/:scheduleId',
        component: TourListBookingComponent
      }
    ]
  },
  {
    path: 'booking-detail/:id',
    component: BookingDetailComponent
  },
  {
    path: 'create-public-booking',
    component: CreatePublicBookingComponent
  },
];