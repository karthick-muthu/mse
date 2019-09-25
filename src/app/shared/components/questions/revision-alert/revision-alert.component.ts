import { WorksheetComponent } from './../../header/questions-header/components/question-navigation/worksheet/worksheet.component';
import { Component, OnDestroy, Input } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContentService } from '../../../services/content/content.service';
import { Subscription } from 'rxjs/Subscription';
import { SharedService } from '../../../shared.service';
import { WorksheetsService } from '../../../../modules/worksheets/services/worksheets.service';
import * as _ from 'lodash';

@Component({
	selector: 'ms-revision-alert',
	templateUrl: './revision-alert.component.html',
	styleUrls: ['./revision-alert.component.scss']
})
export class RevisionAlertComponent implements OnDestroy {
	worksheet: any;
	topicList = [];
	topicName = [];

	ngOnInit() {
		this.worksheet = this.worksheetsService.getWorksheet();
		this.startWorksheets(this.worksheet);
	}
	constructor(
		private worksheetsService: WorksheetsService,
		private modalService: NgbModal,
		private sharedService: SharedService,
		public activeModal: NgbActiveModal,
		private contentService: ContentService
	) {}

	ngOnDestroy() {}

	closeSparkieAlertModal() {
		const closeSparkieAlert = document.getElementById('closeWorksheetModal');
		if (closeSparkieAlert) {
			closeSparkieAlert.click();
		}
		this.activeModal.dismiss();
		this.sharedService.dismissOpenModal();
	}

	startWorksheets(worksheet) {
		this.sharedService.showLoader();
		const data: any = {
			worksheetID: worksheet.contentID,
			mode: worksheet.buttonState,
			worksheetName: worksheet.contentName,
			worksheetType: worksheet.worksheetType
		};

		this.worksheetsService.startWorksheet(data).subscribe(result => {
			result.topicList.forEach(topic => {
				this.topicName.push(topic.topicName);
			});
		});
	}
	ngAfterViewInit() {
		setTimeout(() => {
			this.sharedService.hideLoader();
		}, 2000);
		//this.sharedService.hideLoader();
	}
}
