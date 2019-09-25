/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StarredNavbarT1Component } from './starred-navbar-t1.component';

describe('StarredNavbarT1Component', () => {
  let component: StarredNavbarT1Component;
  let fixture: ComponentFixture<StarredNavbarT1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarredNavbarT1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarredNavbarT1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
