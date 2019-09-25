/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoginComponent } from './login.component';
import { AuthHeaderComponent } from '../../../../shared/components/header/auth-header/auth-header.component';
import { AdsComponent } from '../ads/ads.component';
import { WallOfSparkiesComponent } from '../wall-of-sparkies/wall-of-sparkies.component';
import { UserLoginComponent } from '../user-login/user-login.component';
import { AuthFooterComponent } from '../../../../shared/components/footer/auth-footer/auth-footer.component';
import { TranslateModule, TranslateService, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParentsLoginComponent } from '../parents-login/parents-login.component';
import { AuthService } from '../../services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from '../../services/login/login.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Http } from '@angular/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent, AuthHeaderComponent, AdsComponent, WallOfSparkiesComponent,
        UserLoginComponent, AuthFooterComponent, ParentsLoginComponent],
      imports: [TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateStaticLoader(http, './assets/i18n', '.json'),
        deps: [Http]
      }), FormsModule, ReactiveFormsModule, RouterTestingModule,
      NgbModule.forRoot(), HttpClientModule],
      providers: [TranslateService, AuthService, LoginService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
