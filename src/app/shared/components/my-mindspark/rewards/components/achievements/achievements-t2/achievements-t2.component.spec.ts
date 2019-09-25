/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AchievementsT2Component } from './achievements-t2.component';

describe('AchievementsT2Component', () => {
  let component: AchievementsT2Component;
  let fixture: ComponentFixture<AchievementsT2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AchievementsT2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AchievementsT2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
