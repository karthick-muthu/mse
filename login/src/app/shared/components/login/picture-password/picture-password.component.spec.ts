/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PicturePasswordComponent } from './picture-password.component';
import { TranslateModule, TranslateService, TranslateLoader } from 'ng2-translate';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('PicturePasswordComponent', () => {
  let component: PicturePasswordComponent;
  let fixture: ComponentFixture<PicturePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PicturePasswordComponent],
      imports: [TranslateModule.forRoot(), NgbModule.forRoot()],
      providers: [TranslateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicturePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
