import { Route } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { ViewListServiceProviderComponent } from "./view-list-service-provider/view-list-service-provider.component";
import { LayoutComponent } from "../layout/layout.component";

export const CEO_ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { 
        path: '', 
        component: DashboardComponent 
      },
      {
        path: 'service-provider',
        component: ViewListServiceProviderComponent
      },
    ]
  },
];