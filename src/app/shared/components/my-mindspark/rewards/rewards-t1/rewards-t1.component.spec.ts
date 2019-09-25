/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RewardsT1Component } from './rewards-t1.component';

describe('RewardsT1Component', () => {
  let component: RewardsT1Component;
  let fixture: ComponentFixture<RewardsT1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardsT1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardsT1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
