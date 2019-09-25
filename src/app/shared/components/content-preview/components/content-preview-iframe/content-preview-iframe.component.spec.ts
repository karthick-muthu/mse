import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPreviewIframeComponent } from './content-preview-iframe.component';

describe('ContentPreviewIframeComponent', () => {
  let component: ContentPreviewIframeComponent;
  let fixture: ComponentFixture<ContentPreviewIframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentPreviewIframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPreviewIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
