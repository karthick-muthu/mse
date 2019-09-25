/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SecretQuestionDobComponent } from './secret-question-dob.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService, TranslateLoader } from 'ng2-translate';
import { AuthService } from '../../../../modules/auth/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('SecretQuestionDobComponent', () => {
  let component: SecretQuestionDobComponent;
  let fixture: ComponentFixture<SecretQuestionDobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SecretQuestionDobComponent],
      imports: [FormsModule, TranslateModule.forRoot(), FormsModule, ReactiveFormsModule, RouterTestingModule, NgbModule.forRoot()],
      providers: [TranslateService, AuthService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretQuestionDobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
