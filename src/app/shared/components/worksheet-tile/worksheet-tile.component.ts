import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../../shared.service';
import { WorksheetsService } from '../../../modules/worksheets/services/worksheets.service';
import { ContentService } from '../../services/content/content.service';
import * as _ from 'lodash';
import { SessionReportModalComponent } from '../questions/session-report/session-report-modal/session-report-modal.component';
import { Router } from '@angular/router';
import { AppSettings } from '../../../settings/app.settings';
import { Subscription } from 'rxjs/Subscription';
import { RevisionAlertComponent } from '../questions/revision-alert/revision-alert.component';

@Component({
	selector: 'ms-worksheet-tile',
	templateUrl: './worksheet-tile.component.html',
	styleUrls: ['./worksheet-tile.component.scss']
})
export class WorksheetTileComponent {
	templateClass: string;
	template: string;
	worksheetState;
	getTemplateService: Subscription;
	errorInfo: any;
	@Input('for') for: string;
	@Input('liveWorksheets') live: any;
	@Input('olderWorksheets') older: any;
	worksheetImageDefault: string = AppSettings.WORKSHEET_DEFAULT_IMAGE;

	constructor(
		private sharedService: SharedService,
		private worksheetsService: WorksheetsService,
		private contentService: ContentService,
		private router: Router
	) {
		this.getTemplateService = this.contentService.getTemplate().subscribe(result => {
			this.template = this.contentService.getTemplateId(result);
			this.templateClass = this.sharedService.getClassName();
			this.sharedService.setBodyClass();
		}, responseError => (this.errorInfo = this.sharedService.handleResponseError(responseError)));
	}

	startWorksheets(worksheet) {
		this.sharedService.showLoader();
		this.worksheetState = worksheet;
		const data: any = {
			worksheetID: worksheet.contentID,
			mode: worksheet.buttonState,
			worksheetName: worksheet.contentName,
			worksheetType: worksheet.worksheetType
		};
		this.worksheetsService.setWorksheet(worksheet);
		this.worksheetsService.startWorksheet(data).subscribe(result => {
			const status = this.contentService.validateResponse(result, data);

			this.sharedService.handleUnexpectedResponse(status);
			if (status === 'no_questions') {
				// setTimeout(() => {
				// 	this.sharedService.showLoader();
				// }, 2000);
				this.sharedService.showLoader();
				this.sharedService.open(RevisionAlertComponent, this.worksheetState['backDropStop']);
			} else if (status === 'redirect') {
				data.from = 'worksheet';
				this.contentService.setQuestionContent(data);
				const redirectionCode = _.get(result, 'redirectionCode', '').toLowerCase();
				if (redirectionCode === 'contentpage') {
					this.contentService.contentPageRedirect(result);
				} else {
					if (redirectionCode === 'closecontent') {
						this.sharedService.open(SessionReportModalComponent, ['backDropStop']);
					} else {
						this.sharedService.hideLoader();
					}
				}
			} else {
				this.sharedService.hideLoader();
			}
			responseError => (this.errorInfo = this.sharedService.handleResponseError(responseError));
		});
	}
	worksheetReport(worksheet) {
		const data = {
			startFrom: 1,
			limit: AppSettings.PAGINATION_LIMIT,
			worksheetID: worksheet['contentID'],
			index: 1
		};
		this.sharedService.setWorksheetReportData(data);
		this.router.navigate(['worksheets/report']);
	}
}
