/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ParentsLoginComponent } from './parents-login.component';
import { TranslateModule, TranslateLoader, TranslateService } from 'ng2-translate';


describe('ParentLoginComponent', () => {
  let component: ParentsLoginComponent;
  let fixture: ComponentFixture<ParentsLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParentsLoginComponent],
      imports: [TranslateModule.forRoot()],
      providers: [TranslateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentsLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
