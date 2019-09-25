/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GameTileComponent } from './game-tile.component';

describe('GameTileComponent', () => {
  let component: GameTileComponent;
  let fixture: ComponentFixture<GameTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
