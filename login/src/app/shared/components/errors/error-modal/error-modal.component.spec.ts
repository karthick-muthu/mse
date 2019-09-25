/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ErrorModalComponent } from './error-modal.component';
import { LoginService } from '../../../../modules/auth/services/login/login.service';
import { Http } from '@angular/http';
import { HttpModule } from '@angular/http';
import { AuthService } from '../../../../modules/auth/services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService, TranslateModule } from 'ng2-translate';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

describe('ErrorModalComponent', () => {
  let component: ErrorModalComponent;
  let fixture: ComponentFixture<ErrorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ErrorModalComponent],
      imports: [HttpClientModule, HttpModule, RouterTestingModule, NgbModule.forRoot(), TranslateModule.forRoot()],
      providers: [LoginService, AuthService, TranslateService, NgbActiveModal]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
