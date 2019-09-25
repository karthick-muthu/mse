/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AchievementsT1Component } from './achievements-t1.component';

describe('AchievementsT1Component', () => {
  let component: AchievementsT1Component;
  let fixture: ComponentFixture<AchievementsT1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AchievementsT1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AchievementsT1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
