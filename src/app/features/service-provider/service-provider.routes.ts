import { Route } from "@angular/router";
import { LayoutComponent } from "../admin/layout/layout.component";
import { ServiceContactComponent } from "./components/service-contact/service-contact.component";
import { ServiceProvidedComponent } from "./components/service-provided/service-provided.component";
import { AddServiceContactComponent } from "./components/service-contact/add-service-contact/add-service-contact.component";
import { UpdateServiceContactComponent } from "./components/service-contact/update-service-contact/update-service-contact.component";
import { AddServiceProvidedComponent } from "./components/service-provided/add-service-provided/add-service-provided.component";
import { UpdateServiceProvidedComponent } from "./components/service-provided/update-service-provided/update-service-provided.component";


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
        path: 'services',
        component: ServiceProvidedComponent,
      },
      {
        path: 'add-service-contact',
        component: AddServiceContactComponent,
      },
      {
        path: 'update-service-contact',
        component: UpdateServiceContactComponent,
      },
      {
        path: 'add-services',
        component: AddServiceProvidedComponent,
      },
      {
        path: 'update-services',
        component: UpdateServiceProvidedComponent,
      }
      ]
  },
];