/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { WorsheetModalComponent } from './worsheet-modal.component';

describe('WorsheetModalComponent', () => {
	let component: WorsheetModalComponent;
	let fixture: ComponentFixture<WorsheetModalComponent>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [WorsheetModalComponent]
			}).compileComponents();
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(WorsheetModalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
