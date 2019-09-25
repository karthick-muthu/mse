/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RewardsT2Component } from './rewards-t2.component';

describe('RewardsT2Component', () => {
  let component: RewardsT2Component;
  let fixture: ComponentFixture<RewardsT2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardsT2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsT2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
