import { Route } from "@angular/router";
import { PublicLayoutComponent } from "./layout/public-layout/public-layout.component";
import { HomepageComponent } from "./components/homepage/homepage.component";

export const PUBLIC_ROUTES: Route[] = [
  {
    path: '',
    component: PublicLayoutComponent, 
    children: [
      {
        path: 'homepage',
        component: HomepageComponent,
      }]
  },
];