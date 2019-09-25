/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MenuT2Component } from './menu-t2.component';

describe('MenuT2Component', () => {
  let component: MenuT2Component;
  let fixture: ComponentFixture<MenuT2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuT2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuT2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
