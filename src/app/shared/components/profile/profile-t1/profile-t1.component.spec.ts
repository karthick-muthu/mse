/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ProfileT1Component } from './profile-t1.component';

describe('ProfileT1Component', () => {
  let component: ProfileT1Component;
  let fixture: ComponentFixture<ProfileT1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileT1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileT1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
