/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ForgotPasswordWaitingComponent } from './forgotPasswordWaiting.component';
import { AuthHeaderComponent } from '../../../../../shared/components/header/auth-header/auth-header.component';
import { AuthFooterComponent } from '../../../../../shared/components/footer/auth-footer/auth-footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../services/auth/auth.service';
import { TranslateService, TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Http } from '@angular/http';
import { ErrorsComponent } from '../../../../../shared/components/errors/errors.component';

describe('ForgotPasswordWaitingComponent', () => {
  let component: ForgotPasswordWaitingComponent;
  let fixture: ComponentFixture<ForgotPasswordWaitingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordWaitingComponent, AuthHeaderComponent, AuthFooterComponent, ErrorsComponent],
      imports: [RouterTestingModule.withRoutes([
        { path: 'en/error/reload', component: ErrorsComponent }
      ]), TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateStaticLoader(http, './assets/i18n', '.json'),
        deps: [Http]
      }), NgbModule.forRoot()],
      providers: [AuthService, TranslateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordWaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
