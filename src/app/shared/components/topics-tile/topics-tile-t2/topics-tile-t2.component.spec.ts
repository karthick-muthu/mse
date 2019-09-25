/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TopicsTileT2Component } from './topics-tile-t2.component';

describe('TopicsTileT2Component', () => {
  let component: TopicsTileT2Component;
  let fixture: ComponentFixture<TopicsTileT2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicsTileT2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsTileT2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
