import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CpQuestionsStructureComponent } from './cp-questions-structure.component';

describe('CpQuestionsStructureComponent', () => {
  let component: CpQuestionsStructureComponent;
  let fixture: ComponentFixture<CpQuestionsStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CpQuestionsStructureComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CpQuestionsStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
