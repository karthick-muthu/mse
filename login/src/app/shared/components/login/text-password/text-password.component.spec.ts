/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TextPasswordComponent } from './text-password.component';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TranslateModule, TranslateService, TranslateLoader } from 'ng2-translate';
import { AuthService } from '../../../../modules/auth/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from '../../../../modules/auth/services/login/login.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';

describe('TextPasswordComponent', () => {
  let component: TextPasswordComponent;
  let fixture: ComponentFixture<TextPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextPasswordComponent],
      imports: [FormsModule, TranslateModule.forRoot(), ReactiveFormsModule, RouterTestingModule, HttpClientModule, NgbModule.forRoot()],
      providers: [TranslateService, AuthService, LoginService, FormBuilder]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with 2 controls', () => {
    expect(component.passwordForm.controls['password']).toBeTruthy();
    expect(component.passwordForm.controls['confirmPassword']).toBeTruthy();
  });

  it('Form should be invalid when empty', () => {
    expect(component.passwordForm.valid).toBeFalsy();
  });

  it('password field should be valid when data is entered', () => {
    const pass = component.passwordForm.controls['password'];
    expect(pass.invalid).toBeTruthy();
    pass.setValue('7890');
    expect(pass.valid).toBeTruthy();
  });

  it('password should be atleast 4 characters long', () => {
    const pass = component.passwordForm.controls['password'];
    pass.setValue('789');
    expect(pass.hasError('minlength')).toBeTruthy();
  });

  it('password must show error on pattern mismatch', () => {
    const pass = component.passwordForm.controls['password'];
    pass.setValue('===');
    expect(pass.hasError('pattern')).toBeTruthy();
  });

  it('password and re-enter password must match', () => {
    const pass = component.passwordForm.controls['password'];
    pass.setValue('mindspark');
    const rpass = component.passwordForm.controls['confirmPassword'];
    rpass.setValue('mindspark');
    expect(pass.value).toEqual(rpass.value);
  });

  // it('should raise event when submit password clicked', () => {
  //   let pass = null;
  //   spyOn(component.passwordEmitter, 'emit');
  //   component.passwordEmitter.subscribe(pE => pass = pE);
  //   component.submitPassword();
  //   expect(component.passwordEmitter.emit).toHaveBeenCalledWith(pass);
  // });

  // it('should set password that are returned from the server', () => {
  //   spyOn(service, 'getTextPassword').and.callFake(() => {
  //     return Observable.from([{ password: '2020' }])
  //   })
  //   component.ngOnInit();
  //   expect(component.passwordForm.controls.confirmPassword).toBeTruthy();
  // })
});
