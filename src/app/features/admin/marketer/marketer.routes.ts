import { Route } from "@angular/router";
import { LayoutComponent } from "../layout/layout.component";
import { ListBlogComponent } from "./components/list-blog/list-blog.component";

export const MARKETER_ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: ListBlogComponent
      }]
  },
];