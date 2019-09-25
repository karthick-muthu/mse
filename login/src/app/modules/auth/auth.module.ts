import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutes } from './auth.routing';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { BrowserModule } from '@angular/platform-browser';
import { AccountLockedComponent } from '../../shared/components/login/account-locked/account-locked.component';
import { ForgotPasswordWaitingComponent } from './components/forgot-password/forgotPasswordWaiting/forgotPasswordWaiting.component';
import { TranslateService, TranslateModule } from 'ng2-translate';
import { FirstTimeLoginComponent } from './components/first-time-login/first-time-login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthService } from './services/auth/auth.service';
import { SharedModule } from '../../shared/shared.module';
import { UserLoginComponent } from './components/user-login/user-login.component';
import { ParentsLoginComponent } from './components/parents-login/parents-login.component';
import { AdsComponent } from './components/ads/ads.component';
import { WallOfSparkiesComponent } from './components/wall-of-sparkies/wall-of-sparkies.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(AuthRoutes),
    BrowserModule,
    TranslateModule
  ],
  exports: [
    RouterModule,
    AuthComponent,
    LoginComponent,
    ForgotPasswordComponent,
    AccountLockedComponent,
    ForgotPasswordWaitingComponent,
    FirstTimeLoginComponent,
    ResetPasswordComponent,
    UserLoginComponent,
    ParentsLoginComponent,
    AdsComponent,
    WallOfSparkiesComponent
  ],
  declarations: [
    AuthComponent,
    LoginComponent,
    ForgotPasswordComponent,
    AccountLockedComponent,
    ForgotPasswordWaitingComponent,
    FirstTimeLoginComponent,
    ResetPasswordComponent,
    UserLoginComponent,
    ParentsLoginComponent,
    AdsComponent,
    WallOfSparkiesComponent
  ],
  providers: [
    TranslateService,
    AuthService
  ]
})
export class AuthModule { }
