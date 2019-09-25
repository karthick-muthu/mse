/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StarredQuestionsT2Component } from './starred-questions-t2.component';

describe('StarredQuestionsT2Component', () => {
  let component: StarredQuestionsT2Component;
  let fixture: ComponentFixture<StarredQuestionsT2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarredQuestionsT2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarredQuestionsT2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
