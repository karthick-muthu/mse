/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NotificationModalT2Component } from './notification-modal-t2.component';

describe('NotificationModalT2Component', () => {
  let component: NotificationModalT2Component;
  let fixture: ComponentFixture<NotificationModalT2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationModalT2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationModalT2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
