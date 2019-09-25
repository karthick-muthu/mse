/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthHeaderComponent } from '../../../../shared/components/header/auth-header/auth-header.component';
import { PicturePasswordComponent } from '../../../../shared/components/login/picture-password/picture-password.component';
import { PicturePasswordSuccessComponent } from '../../../../shared/components/login/picture-password-success/picture-password-success.component';
import { AuthFooterComponent } from '../../../../shared/components/footer/auth-footer/auth-footer.component';
import { TranslateModule, TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from '../../services/login/login.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Http } from '@angular/http';
import { ErrorsComponent } from '../../../../shared/components/errors/errors.component';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent, AuthHeaderComponent, PicturePasswordSuccessComponent, ErrorsComponent,
        AuthFooterComponent, PicturePasswordComponent],
      imports: [TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateStaticLoader(http, './assets/i18n', '.json'),
        deps: [Http]
      }), FormsModule, ReactiveFormsModule, NgbModule.forRoot(), RouterTestingModule.withRoutes([
        { path: 'en/error/reload', component: ErrorsComponent }
      ]), HttpClientModule],
      providers: [TranslateService, LoginService, AuthService, FormBuilder]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form with 4 controls', () => {
    expect(component.verifyForm.controls['secretQuestionOptions']).toBeTruthy();
    expect(component.verifyForm.controls['secretAnswer']).toBeTruthy();
    expect(component.verifyForm.controls['dateOfBirth']).toBeTruthy();
    expect(component.verifyForm.controls['monthOfBirth']).toBeTruthy();
  });

  it('All the fields should be empty before entering data', () => {
    const sQ = component.verifyForm.controls['secretQuestionOptions'];
    expect(sQ.valid).toBeFalsy();
    const sA = component.verifyForm.controls['secretAnswer'];
    expect(sA.valid).toBeFalsy();
    const dB = component.verifyForm.controls['dateOfBirth'];
    expect(dB.valid).toBeFalsy();
    const mB = component.verifyForm.controls['monthOfBirth'];
    expect(mB.valid).toBeFalsy();
  });

});
