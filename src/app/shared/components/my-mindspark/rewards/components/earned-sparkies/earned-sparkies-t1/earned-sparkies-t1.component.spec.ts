/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EarnedSparkiesT1Component } from './earned-sparkies-t1.component';

describe('EarnedSparkiesT1Component', () => {
  let component: EarnedSparkiesT1Component;
  let fixture: ComponentFixture<EarnedSparkiesT1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarnedSparkiesT1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarnedSparkiesT1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
