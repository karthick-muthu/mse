/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SecretQuestionDobComponent } from './secret-question-dob.component';

describe('SecretQuestionDobComponent', () => {
  let component: SecretQuestionDobComponent;
  let fixture: ComponentFixture<SecretQuestionDobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecretQuestionDobComponent ]
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
