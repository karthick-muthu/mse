import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './modules/auth/auth.component';

import { AuthRoutes } from './modules/auth/auth.routing';
import { ErrorsComponent } from './shared/components/errors/errors.component';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { ForgotPasswordComponent } from './modules/auth/components/forgot-password/forgot-password.component';
// tslint:disable-next-line:max-line-length
import { ForgotPasswordWaitingComponent } from './modules/auth/components/forgot-password/forgotPasswordWaiting/forgotPasswordWaiting.component';
import { FirstTimeLoginComponent } from './modules/auth/components/first-time-login/first-time-login.component';
import { AccountLockedComponent } from './shared/components/login/account-locked/account-locked.component';
import { ResetPasswordComponent } from './modules/auth/components/reset-password/reset-password.component';
import { ProductSelectionComponent } from './modules/auth/components/product-selection/product-selection.component';

const routes: Routes = [
    { path: '', redirectTo: 'en', pathMatch: 'full' },
    { path: ':lang', component: LoginComponent },
    { path: 'auth/login', redirectTo: 'en', pathMatch: 'full' },

    { path: ':lang/forgot-password', component: ForgotPasswordComponent },
    { path: ':lang/waiting', component: ForgotPasswordWaitingComponent },
    { path: ':lang/first-time-login', component: FirstTimeLoginComponent },
    { path: ':lang/account-locked', component: AccountLockedComponent },
    { path: ':lang/reset-password', component: ResetPasswordComponent },
    { path: ':lang/product-selection', component: ProductSelectionComponent },
    { path: ':lang/error/:type', component: ErrorsComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
