import { Route } from "@angular/router";
import { LayoutComponent } from "../admin/layout/layout.component";
import { ServiceContactComponent } from "./components/service-contact/service-contact.component";
import { ServiceProvidedComponent } from "./components/service-provided/service-provided.component";
import { AddServiceContactComponent } from "./components/service-contact/add-service-contact/add-service-contact.component";


export const SERVICE_PROVIDER_ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'service-contact',
        component: ServiceContactComponent,
      },
      {
        path: 'service-provided',
        component: ServiceProvidedComponent,
      },
      {
        path: 'add-service-contact',
        component: AddServiceContactComponent,
      }]
  },
];