import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './core/auth/register/register.component';
import { ConfirmEmailComponent } from './core/pages/confirm-email/confirm-email.component';

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
        component: RegisterComponent
    },
    {
        path: 'confirm-email',
        component: ConfirmEmailComponent
    },
    {
        path: 'c',
        loadChildren: () => import('./features/customer/customer.routes').then(m => m.CUSTOMER_ROUTES),
        canActivate: [AuthGuard]
    }
];
