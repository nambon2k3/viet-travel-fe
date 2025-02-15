import { Route } from "@angular/router";
import { LayoutComponent } from "../layout/layout.component";
import { ListStaffComponent } from "./components/list-staff/list-staff.component";
import { PostStaffDetailComponent } from "./components/post-staff-detail/post-staff-detail.component";

export const SYSTEM_ADMIN_ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'user',
        component: ListStaffComponent,
      },
      {
        path: 'user-details',
        component: PostStaffDetailComponent,
      },
    ]
  },
];