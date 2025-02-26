import { Route } from "@angular/router";
import { TourOperationLayoutComponent } from "./tour-operation-layout/tour-operation-layout.component";
import { ListCustomerComponent } from "./list-customer/list-customer.component";
import { TourOperationComponent } from "./tour-operation.component";
import { ListBookingComponent } from "./list-booking/list-booking.component";
import { ServiceComponent } from "./service/service.component";
import { LogComponent } from "./log/log.component";
import { SummaryComponent } from "./summary/summary.component";

export const TOUR_OPERATION_ROUTES: Route[] = [
  {
      path: '',
      component: TourOperationLayoutComponent,
      children: [
        { 
          path: '',
          component: TourOperationComponent
        },
        {
          path: 'list-customer',
          component: ListCustomerComponent
        },
        {
          path: 'list-booking',
          component: ListBookingComponent
        },
        {
          path: 'service',
          component: ServiceComponent
        },
        {
          path: 'log',
          component: LogComponent
        },
        {
          path: 'summary',
          component: SummaryComponent
        },
      ]
    },
];
