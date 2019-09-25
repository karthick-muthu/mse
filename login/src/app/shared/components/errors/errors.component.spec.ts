/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ErrorsComponent } from './errors.component';
import { AuthHeaderComponent } from '../header/auth-header/auth-header.component';
import { AuthFooterComponent } from '../footer/auth-footer/auth-footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../modules/auth/services/auth/auth.service';
import { TranslateService, TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { LoginService } from '../../../modules/auth/services/login/login.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '../../../app.component';
import { Ng2DeviceService } from 'ng2-device-detector';
import { Http } from '@angular/http';

describe('ErrorsComponent', () => {
  let component: ErrorsComponent;
  let fixture: ComponentFixture<ErrorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorsComponent, AuthHeaderComponent, AuthFooterComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateStaticLoader(http, './assets/i18n', '.json'),
        deps: [Http]
      }), HttpClientModule, NgbModule.forRoot()],
      providers: [AuthService, TranslateService, LoginService, AppComponent, Ng2DeviceService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
