/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PicturePasswordSuccessComponent } from './picture-password-success.component';
import { TranslateModule, TranslateService, TranslateLoader } from 'ng2-translate';
import { AuthService } from '../../../../modules/auth/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('PicturePasswordSuccessComponent', () => {
  let component: PicturePasswordSuccessComponent;
  let fixture: ComponentFixture<PicturePasswordSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PicturePasswordSuccessComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule, NgbModule.forRoot()],
      providers: [TranslateService, AuthService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicturePasswordSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
