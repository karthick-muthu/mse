/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EarnedSparkiesT2Component } from './earned-sparkies-t2.component';

describe('EarnedSparkiesT2Component', () => {
  let component: EarnedSparkiesT2Component;
  let fixture: ComponentFixture<EarnedSparkiesT2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarnedSparkiesT2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarnedSparkiesT2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
