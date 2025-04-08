import { Route } from "@angular/router";
import { LayoutComponent } from "../admin/layout/layout.component";
import { ServiceRequestComponent } from "./components/service-request/service-request.component";
import { RequestDetailComponent } from "./components/service-request/request-detail/request-detail.component";
import { ServiceComponent } from "./components/service/service.component";
import { UpdateServiceComponent } from "./components/service/update-service/update-service.component";


export const SERVICE_PROVIDER_ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'service',
        component: ServiceComponent,
      },
      {
        path: 'service/:id/edit',
        component: UpdateServiceComponent
      },
      {
        path: 'service/add',
        component: UpdateServiceComponent
      },
      {
        path: 'service-request',
        component: ServiceRequestComponent,
      },
      {
        path: 'request-detail',
        component: RequestDetailComponent,
      }
      ]
  },
];