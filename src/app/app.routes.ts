import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RegisterComponent } from './core/auth/register/register.component';
import { ConfirmEmailComponent } from './core/pages/confirm-email/confirm-email.component';
import { ResetPasswordComponent } from './features/common/components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './features/common/components/forgot-password/forgot-password.component';
import { RegistrationConfirmationComponent } from './core/pages/registration-confirmation/registration-confirmation.component';

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
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent
    },
    {
        path: 'c',
        loadChildren: () => import('./features/customer/customer.routes').then(m => m.CUSTOMER_ROUTES),
        canActivate: [AuthGuard],
    },    
    {
        path: 'regis-confirm',
        component: RegistrationConfirmationComponent
    },
];
