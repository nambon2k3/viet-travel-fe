import { Route } from "@angular/router";
import { LayoutComponent } from "../layout/layout.component";
import { ListLocationComponent } from "./components/list-location/list-location.component";
import { PostLocationDetailComponent } from "./components/post-location-detail/post-location-detail.component";
<<<<<<< Updated upstream
=======
import { ViewListTourComponent } from "./components/view-list-tour/view-list-tour.component";
import { AddTourComponent } from "./components/add-tour/add-tour.component";
import { TourDayComponent } from "./components/tour-details/tour-day/tour-day.component";
import { TourDetailsLayoutComponent } from "./components/tour-details/tour-details-layout/tour-details-layout.component";
import { TourDetailsComponent } from "./components/tour-details/tour-details.component";
import { TourPaxComponent } from "./components/tour-details/tour-pax/tour-pax.component";
import { UpdateTourDayComponent } from "./components/tour-details/update-tour-day/update-tour-day.component";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======
      {
        path: 'list-tour',
        component: ViewListTourComponent,
      },
      {
        path: 'add-tour',
        component: AddTourComponent,
      },
      {
        path: '',
        component: TourDetailsLayoutComponent,
        children: [
          { path: 'tour-details', component: TourDetailsComponent },
          { path: 'tour-day', component: TourDayComponent },
          { path: 'pax', component: TourPaxComponent },
          { path: 'update-tour-day', component: UpdateTourDayComponent },
          { path: '', redirectTo: 'details', pathMatch: 'full' },
        ],
      },
>>>>>>> Stashed changes
    ]
  },
];