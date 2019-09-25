/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProfileT2Component } from './profile-t2.component';

describe('ProfileT2Component', () => {
  let component: ProfileT2Component;
  let fixture: ComponentFixture<ProfileT2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileT2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileT2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
