/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StarredNavbarT2Component } from './starred-navbar-t2.component';

describe('StarredNavbarT2Component', () => {
  let component: StarredNavbarT2Component;
  let fixture: ComponentFixture<StarredNavbarT2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarredNavbarT2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarredNavbarT2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
