/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HeaderT1Component } from './header-t1.component';

describe('HeaderT2Component', () => {
  let component: HeaderT1Component;
  let fixture: ComponentFixture<HeaderT1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderT1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderT1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
