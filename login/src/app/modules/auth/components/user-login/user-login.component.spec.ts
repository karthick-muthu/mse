/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserLoginComponent } from './user-login.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslateModule, TranslateService, TranslateLoader } from 'ng2-translate';
import { ParentsLoginComponent } from '../parents-login/parents-login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from '../../services/login/login.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('UserLoginComponent', () => {
  let component: UserLoginComponent;
  let fixture: ComponentFixture<UserLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserLoginComponent, ParentsLoginComponent],
      imports: [FormsModule, ReactiveFormsModule, TranslateModule.forRoot(), RouterTestingModule, HttpClientModule, NgbModule.forRoot()],
      providers: [TranslateService, LoginService, AuthService, FormBuilder]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create a form with 2 controls', () => {
    expect(component.userLoginForm.contains('username')).toBeTruthy();
    expect(component.userLoginForm.contains('userpassword')).toBeTruthy();
  });

  it('UserName field should have username', () => {
    const name = component.userLoginForm.get('username');
    name.setValue('abc');
    expect(name.valid).toBeTruthy();
  });

  it('Password field should have password', () => {
    const pass = component.userLoginForm.get('userpassword');
    pass.setValue('1234');
    expect(pass.valid).toBeTruthy();
  });

  it('submitting a form emits a user', () => {
    expect(component.userLoginForm.valid).toBeFalsy();
    component.userLoginForm.get('username').setValue('abc@gmail.com');
    component.userLoginForm.get('userpassword').setValue('123456789');
    expect(component.userLoginForm.valid).toBeTruthy();
  });
});
