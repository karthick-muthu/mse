/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DoneBtnModalComponent } from './done-btn-modal.component';

describe('DoneBtnModalComponent', () => {
  let component: DoneBtnModalComponent;
  let fixture: ComponentFixture<DoneBtnModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoneBtnModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoneBtnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
