import { Route } from "@angular/router";
import { LayoutComponent } from "../admin/layout/layout.component";

export const MARKETER_ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
      }]
  },
];