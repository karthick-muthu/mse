/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HighScoreT2Component } from './high-score-t2.component';

describe('HighScoreT2Component', () => {
  let component: HighScoreT2Component;
  let fixture: ComponentFixture<HighScoreT2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighScoreT2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighScoreT2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
