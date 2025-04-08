import { Route } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ViewListServiceProviderComponent } from "./view-list-service-provider/view-list-service-provider.component";
import { LayoutComponent } from "../layout/layout.component";
import { AddServiceProviderComponent } from "./view-list-service-provider/add-service-provider/add-service-provider.component";
import { UpdateServiceProviderComponent } from "./view-list-service-provider/update-service-provider/update-service-provider.component";
import { TourRequestComponent } from "./tour-request/tour-request.component";

export const CEO_ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { 
        path: 'dashboard', 
        component: DashboardComponent 
      },
      {
        path: 'service-provider',
        component: ViewListServiceProviderComponent
      },
      {
        path: 'service-provider/add',
        component: AddServiceProviderComponent
      },
      {
        path: 'service-provider/:id/edit',
        component: UpdateServiceProviderComponent
      },
      {
        path: 'tour-request',
        component: TourRequestComponent
      },
      // {
      //   path: 'service-provider/:id/services',
      //   component: CEOServiceListComponent
      // },
      
    ]
  },
];