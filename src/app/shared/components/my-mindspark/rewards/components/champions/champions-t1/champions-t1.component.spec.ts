/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChampionsT1Component } from './champions-t1.component';

describe('ChampionsT1Component', () => {
  let component: ChampionsT1Component;
  let fixture: ComponentFixture<ChampionsT1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChampionsT1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionsT1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
