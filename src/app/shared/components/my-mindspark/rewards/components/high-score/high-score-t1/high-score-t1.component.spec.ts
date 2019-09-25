/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HighScoreT1Component } from './high-score-t1.component';

describe('HighScoreT1Component', () => {
  let component: HighScoreT1Component;
  let fixture: ComponentFixture<HighScoreT1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighScoreT1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighScoreT1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
