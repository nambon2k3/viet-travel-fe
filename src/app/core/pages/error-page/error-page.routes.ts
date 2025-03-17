import { Route } from "@angular/router";
import { NotFoundComponent } from "./not-found/not-found.component";

export const ERROR_ROUTES: Route[] = [
  {
    path: '404-not-found',
    component: NotFoundComponent
  },
];