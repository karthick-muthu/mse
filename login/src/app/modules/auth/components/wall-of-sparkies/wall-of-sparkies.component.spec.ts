/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WallOfSparkiesComponent } from './wall-of-sparkies.component';
import { TranslateModule, TranslateService, TranslateLoader } from 'ng2-translate';

describe('WallOfSparkiesComponent', () => {
  let component: WallOfSparkiesComponent;
  let fixture: ComponentFixture<WallOfSparkiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WallOfSparkiesComponent],
      imports: [TranslateModule.forRoot()],
      providers: [TranslateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallOfSparkiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
