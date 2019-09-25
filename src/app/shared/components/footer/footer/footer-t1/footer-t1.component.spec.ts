/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FooterT1Component } from './footer-t1.component';

describe('FooterT1Component', () => {
  let component: FooterT1Component;
  let fixture: ComponentFixture<FooterT1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterT1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterT1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
