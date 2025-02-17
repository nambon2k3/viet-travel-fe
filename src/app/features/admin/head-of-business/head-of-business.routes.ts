import { Route } from "@angular/router";
import { LayoutComponent } from "../layout/layout.component";
import { ListLocationComponent } from "./components/list-location/list-location.component";
import { PostLocationDetailComponent } from "./components/post-location-detail/post-location-detail.component";

export const HEAD_OF_BUSINESS_ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'locations',
        component: ListLocationComponent,
      },
      {
        path: 'location-details',
        component: PostLocationDetailComponent,
      },
    ]
  },
];