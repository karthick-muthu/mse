/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FooterT2Component } from './footer-t2.component';

describe('FooterT2Component', () => {
  let component: FooterT2Component;
  let fixture: ComponentFixture<FooterT2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FooterT2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterT2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
