/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StarredQuestionsT1Component } from './starred-questions-t1.component';

describe('StarredQuestionsT1Component', () => {
  let component: StarredQuestionsT1Component;
  let fixture: ComponentFixture<StarredQuestionsT1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarredQuestionsT1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarredQuestionsT1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
