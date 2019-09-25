/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TopicsTileT1Component } from './topics-tile-t1.component';

describe('TopicsTileT1Component', () => {
  let component: TopicsTileT1Component;
  let fixture: ComponentFixture<TopicsTileT1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicsTileT1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicsTileT1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
