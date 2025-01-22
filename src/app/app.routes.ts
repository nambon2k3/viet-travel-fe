import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterConponent } from './core/auth/register/register.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterConponent
    },
    {
        path: 'c',
        loadChildren: () => import('./features/customer/customer.routes').then(m => m.CUSTOMER_ROUTES),
        canActivate: [AuthGuard]
    }
];
