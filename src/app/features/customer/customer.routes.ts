import { Route } from "@angular/router";
import { UserProfileManagementComponent } from "./components/user-profile-management/user-profile-management.component";

export const CUSTOMER_ROUTES: Route[] = [
    {
      path: 'user-profile',
      component: UserProfileManagementComponent
    }
  ];