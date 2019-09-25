import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpQuestionsFooterComponent } from './cp-questions-footer.component';

describe('CpQuestionsFooterComponent', () => {
  let component: CpQuestionsFooterComponent;
  let fixture: ComponentFixture<CpQuestionsFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CpQuestionsFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpQuestionsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
