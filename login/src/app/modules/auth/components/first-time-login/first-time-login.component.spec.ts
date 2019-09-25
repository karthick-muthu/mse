/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FirstTimeLoginComponent } from './first-time-login.component';
import { AuthHeaderComponent } from '../../../../shared/components/header/auth-header/auth-header.component';
import { PicturePasswordComponent } from '../../../../shared/components/login/picture-password/picture-password.component';
import { TextPasswordComponent } from '../../../../shared/components/login/text-password/text-password.component';
import { SecretQuestionDobComponent } from '../../../../shared/components/login/secret-question-dob/secret-question-dob.component';
import { AuthFooterComponent } from '../../../../shared/components/footer/auth-footer/auth-footer.component';
import { TranslateModule, TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { PicturePasswordSuccessComponent } from '../../../../shared/components/login/picture-password-success/picture-password-success.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../services/login/login.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Http } from '@angular/http';
import { ErrorsComponent } from '../../../../shared/components/errors/errors.component';

describe('FirstTimeLoginComponent', () => {
  let component: FirstTimeLoginComponent;
  let fixture: ComponentFixture<FirstTimeLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FirstTimeLoginComponent, AuthHeaderComponent, PicturePasswordComponent, ErrorsComponent,
        TextPasswordComponent, SecretQuestionDobComponent, AuthFooterComponent, PicturePasswordSuccessComponent],
      imports: [TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateStaticLoader(http, './assets/i18n', '.json'),
        deps: [Http]
      }), FormsModule, ReactiveFormsModule, HttpClientModule, RouterTestingModule.withRoutes([
        { path: 'en/error/reload', component: ErrorsComponent }
      ]), NgbModule.forRoot()],
      providers: [TranslateService, LoginService, AuthService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstTimeLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
