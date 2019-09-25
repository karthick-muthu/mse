/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChampionsT2Component } from './champions-t2.component';

describe('ChampionsT2Component', () => {
  let component: ChampionsT2Component;
  let fixture: ComponentFixture<ChampionsT2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChampionsT2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChampionsT2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
