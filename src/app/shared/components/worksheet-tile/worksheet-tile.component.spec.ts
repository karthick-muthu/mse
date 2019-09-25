import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorksheetTileComponent } from './worksheet-tile.component';

describe('WorksheetTileComponent', () => {
  let component: WorksheetTileComponent;
  let fixture: ComponentFixture<WorksheetTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorksheetTileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorksheetTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
