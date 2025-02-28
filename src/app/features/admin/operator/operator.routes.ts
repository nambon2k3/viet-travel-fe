import { Route } from "@angular/router";
import { DashBoardComponent } from "./components/dash-board/dash-board.component";
import { ViewListRequestComponent } from "./components/view-list-request/view-list-request.component";
import { ViewRequestDetailComponent } from "./components/view-request-detail/view-request-detail.component";
import { ViewListTourComponent } from "./components/view-list-tour/view-list-tour.component";
import { LayoutComponent } from "../layout/layout.component";

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
      {
        path: 'tour-operation',
        loadChildren: () => import('./components/tour-operation/tour-operation.routes').then(m => m.TOUROPERATION_ROUTES),
      }
    ]
  },
];