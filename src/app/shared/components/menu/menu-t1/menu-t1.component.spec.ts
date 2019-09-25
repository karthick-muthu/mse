/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MenuT1Component } from './menu-t1.component';

describe('MenuT1Component', () => {
  let component: MenuT1Component;
  let fixture: ComponentFixture<MenuT1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuT1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuT1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
