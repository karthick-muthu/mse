/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LoginService } from './login.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AuthService } from '../auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService, TranslateLoader } from 'ng2-translate';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('Service: Login', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpModule, RouterTestingModule, TranslateModule.forRoot(), NgbModule.forRoot()],
      providers: [LoginService, AuthService, TranslateService]
    });
  });

  it('should ...', inject([LoginService], (service: LoginService) => {
    expect(service).toBeTruthy();
  }));
});
