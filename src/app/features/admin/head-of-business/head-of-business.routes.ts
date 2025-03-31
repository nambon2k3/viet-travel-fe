import { Route } from "@angular/router";
import { LayoutComponent } from "../layout/layout.component";
import { ListLocationComponent } from "./components/list-location/list-location.component";
import { PostLocationDetailComponent } from "./components/post-location-detail/post-location-detail.component";
import { TourDayComponent } from "./components/tour-details/tour-day/tour-day.component";
import { TourDetailsLayoutComponent } from "./components/tour-details/tour-details-layout/tour-details-layout.component";
import { TourDetailsComponent } from "./components/tour-details/tour-details.component";
import { UpdateTourDayComponent } from "./components/tour-details/update-tour-day/update-tour-day.component";
import { ViewListTourComponent } from "./components/view-list-tour/view-list-tour.component";
import { OpenTourForSaleComponent } from "./components/open-tour-for-sale/open-tour-for-sale.component";
import { TourDiscountComponent } from "./components/tour-discount/tour-discount.component";

export const HEAD_OF_BUSINESS_ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'locations',
        pathMatch: 'full',
      },
      {
        path: 'locations',
        component: ListLocationComponent,
      },
      {
        path: 'location-details',
        component: PostLocationDetailComponent,
      },
      {
        path: 'list-tour',
        component: ViewListTourComponent,
      },
      {
        path: 'tour-discount',
        component: TourDiscountComponent,
      },
      {
        path: '',
        component: TourDetailsLayoutComponent,
        children: [
          { path: '', redirectTo: 'tour-details', pathMatch: 'full' },
          { path: 'tour-details', component: TourDetailsComponent },
          { path: 'tour-day', component: TourDayComponent },
          { path: 'update-tour-day', component: UpdateTourDayComponent },
        ],
      },
    ]
  },
  {
    path: 'open-sale-tour',
    component: OpenTourForSaleComponent
  },
];