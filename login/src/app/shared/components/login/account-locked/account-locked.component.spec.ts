/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AccountLockedComponent } from './account-locked.component';
import { AuthHeaderComponent } from '../../header/auth-header/auth-header.component';
import { AuthFooterComponent } from '../../footer/auth-footer/auth-footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../../modules/auth/services/auth/auth.service';
import { TranslateService, TranslateModule, TranslateLoader } from 'ng2-translate';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('AccountLockedComponent', () => {
  let component: AccountLockedComponent;
  let fixture: ComponentFixture<AccountLockedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AccountLockedComponent, AuthHeaderComponent, AuthFooterComponent],
      imports: [RouterTestingModule, TranslateModule.forRoot(), NgbModule.forRoot()],
      providers: [AuthService, TranslateService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLockedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
