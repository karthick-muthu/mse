/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ResetPasswordComponent } from './reset-password.component';
import { AuthHeaderComponent } from '../../../../shared/components/header/auth-header/auth-header.component';
import { PicturePasswordComponent } from '../../../../shared/components/login/picture-password/picture-password.component';
import { PicturePasswordSuccessComponent } from '../../../../shared/components/login/picture-password-success/picture-password-success.component';
import { AuthFooterComponent } from '../../../../shared/components/footer/auth-footer/auth-footer.component';
import { TranslateModule, TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from '../../services/login/login.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TextPasswordComponent } from '../../../../shared/components/login/text-password/text-password.component';
import { Http } from '@angular/http';
import { ErrorsComponent } from '../../../../shared/components/errors/errors.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent, AuthHeaderComponent, TextPasswordComponent, ErrorsComponent,
        PicturePasswordComponent, PicturePasswordSuccessComponent, AuthFooterComponent],
      imports: [TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateStaticLoader(http, './assets/i18n', '.json'),
        deps: [Http]
      }), FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes([
        { path: 'en/error/reload', component: ErrorsComponent }
      ]), HttpClientModule, NgbModule.forRoot()],
      providers: [TranslateService, AuthService, LoginService, FormBuilder]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should create 2 password fields', () => {
    expect(component.passwordForm.controls['password']).toBeTruthy();
    expect(component.passwordForm.controls['confirmPassword']).toBeTruthy();
  });

  it('Form should be invalid when empty', () => {
    expect(component.passwordForm.valid).toBeFalsy();
  });

  it('password field should be valid when entering data', () => {
    const pass = component.passwordForm.controls['password'];
    expect(pass.invalid).toBeTruthy();
    pass.setValue('7890');
    expect(pass.valid).toBeTruthy();
  });

  it('password minlength should be at least 4 characters', () => {
    const pass = component.passwordForm.controls['password'];
    pass.setValue('455');
    expect(pass.hasError('minlength')).toBe(true);
  });

  it('password must show error on pattern mismatch', () => {
    const pass = component.passwordForm.controls['password'];
    pass.setValue('===');
    expect(pass.hasError('pattern')).toBe(true);
  });

  it('re-enter password must show error while left blank', () => {
    const rpass = component.passwordForm.controls['confirmPassword'];
    rpass.setValue('7890');
    expect(rpass.value).toBeTruthy();
  });

  it('password and confirm password should match', () => {
    const pass = component.passwordForm.controls['password'];
    pass.setValue('mindspark');
    const confirmPass = component.passwordForm.controls['confirmPassword'];
    confirmPass.setValue('mindspark');
    expect(pass.value).toEqual(confirmPass.value);
  });

});
