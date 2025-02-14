import { Route } from "@angular/router";
import { LayoutComponent } from "../admin/layout/layout.component";
import { ServiceContactComponent } from "./components/service-contact/service-contact.component";
import { ServiceProvidedComponent } from "./components/service-provided/service-provided.component";

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
      }]
  },
];