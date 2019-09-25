/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VernacularBtnComponent } from './vernacular-btn.component';

describe('VernacularBtnComponent', () => {
  let component: VernacularBtnComponent;
  let fixture: ComponentFixture<VernacularBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VernacularBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VernacularBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
