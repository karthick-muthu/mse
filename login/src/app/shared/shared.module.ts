import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'angular2-moment';
import { NgPipesModule } from 'ngx-pipes';
import { InternationalPhoneModule } from 'ng4-intl-phone';

import { TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';


import { SharedComponent } from './shared.component';
import { AuthHeaderComponent } from './components/header/auth-header/auth-header.component';
import { AuthFooterComponent } from './components/footer/auth-footer/auth-footer.component';
import { LogoComponent } from './components/logo/logo.component';
import { LoginService } from '../modules/auth/services/login/login.service';
import { MsAuotFocusDirective } from './directives/inputAutoFocus/msAuotFocus.directive';
import { PasswordShowHideDirective } from './directives/password-show-hide/passwordShowHide.directive';
import { PicturePasswordComponent } from './components/login/picture-password/picture-password.component';
import { PicturePasswordSuccessComponent } from './components/login/picture-password-success/picture-password-success.component';
import { TextPasswordComponent } from './components/login/text-password/text-password.component';
import { SecretQuestionDobComponent } from './components/login/secret-question-dob/secret-question-dob.component';
import { ErrorsComponent } from './components/errors/errors.component';
import { ErrorModalComponent } from './components/errors/error-modal/error-modal.component';
import { ProductSelectionComponent } from '../modules/auth/components/product-selection/product-selection.component';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    RouterModule,
    NgbModule.forRoot(),
    MomentModule,
    NgPipesModule,
    InternationalPhoneModule,
  ],
  exports: [
    SharedComponent,
    LogoComponent,
    AuthHeaderComponent,
    AuthFooterComponent,
    MsAuotFocusDirective,
    PasswordShowHideDirective,
    PicturePasswordComponent,
    PicturePasswordSuccessComponent,
    TextPasswordComponent,
    SecretQuestionDobComponent,
    ErrorsComponent,
    ErrorModalComponent,
    ProductSelectionComponent
  ],
  declarations: [
    SharedComponent,
    LogoComponent,
    AuthHeaderComponent,
    AuthFooterComponent,
    MsAuotFocusDirective,
    PasswordShowHideDirective,
    PicturePasswordComponent,
    PicturePasswordSuccessComponent,
    TextPasswordComponent,
    SecretQuestionDobComponent,
    ErrorsComponent,
    ErrorModalComponent,
    ProductSelectionComponent
  ],
  providers: [
    LoginService
  ],
  entryComponents: [ErrorModalComponent]
})
export class SharedModule { }
