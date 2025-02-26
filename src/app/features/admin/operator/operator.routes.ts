import { Route } from "@angular/router";
import { LayoutComponent } from "../layout/layout.component";
import { DashBoardComponent } from "./components/dash-board/dash-board.component";
import { ViewListRequestComponent } from "./components/view-list-request/view-list-request.component";
import { ViewRequestDetailComponent } from "./components/view-request-detail/view-request-detail.component";
import { ViewListTourComponent } from "./components/view-list-tour/view-list-tour.component";

export const OPERATOR_ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { 
        path: '',
        component: DashBoardComponent
      },
      {
        path: 'view-list-request',
        component: ViewListRequestComponent
      },
      {
        path: 'request-details',
        component: ViewRequestDetailComponent
      },
      {
        path: 'view-list-tour',
        component: ViewListTourComponent
      },
    ]
  },
];