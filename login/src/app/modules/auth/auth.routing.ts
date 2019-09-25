import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AccountLockedComponent } from '../../shared/components/login/account-locked/account-locked.component';
import { ForgotPasswordWaitingComponent } from './components/forgot-password/forgotPasswordWaiting/forgotPasswordWaiting.component';
import { FirstTimeLoginComponent } from './components/first-time-login/first-time-login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ErrorsComponent } from '../../shared/components/errors/errors.component';

export const AuthRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'login/:lang', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent, pathMatch: 'full' },
  { path: 'waiting', component: ForgotPasswordWaitingComponent },
  { path: 'first-time-login', component: FirstTimeLoginComponent },
  { path: 'account-locked', component: AccountLockedComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'unauthorized', component: ErrorsComponent }
];
