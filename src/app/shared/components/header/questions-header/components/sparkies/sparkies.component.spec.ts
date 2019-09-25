/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SparkiesComponent } from './sparkies.component';

describe('SparkiesComponent', () => {
  let component: SparkiesComponent;
  let fixture: ComponentFixture<SparkiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SparkiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SparkiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
