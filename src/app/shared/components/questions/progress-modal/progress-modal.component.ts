import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { ContentService } from '../../../services/content/content.service';
import { QuestionsComponent } from '../questions.component';
import { SparkieAlertsComponent } from '../sparkie-alerts/sparkie-alerts.component';
import { SharedService } from '../../../shared.service';

@Component({
	selector: 'ms-progress-modal',
	templateUrl: './progress-modal.component.html',
	styleUrls: ['./progress-modal.component.scss'],
	providers: [QuestionsComponent]
})
export class ProgressModalComponent implements AfterViewInit, OnDestroy {
	noRewardAlertFlag: boolean;
	contentSubMode: any;
	attemptNumber: number;
	contentDetails: any;
	progress: any;
	progressValue: number;
	animationType: number;
	userProgress: number;
	flag2src: string;
	template: string;
	from: any;
	private pedagogyMessages: any;
	private progressInterval: any;
	private errorInfo: any;
	private getTemplateService: Subscription;
	private getQuestionContentService: Subscription;
	private getMessagesService: Subscription;

	constructor(
		public activeModal: NgbActiveModal,
		private contentService: ContentService,
		private sharedService: SharedService
	) {
		this.flag2src = 'assets/common/images/grey-flag.png';
		this.getTemplateService = this.contentService
			.getTemplate()
			.subscribe(result => (this.template = this.contentService.getTemplateId(result)));
		this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(result => {
			this.from = _.get(result, 'from', '').toLowerCase();
			this.attemptNumber = _.get(result, 'attemptNumber', null);
			this.noRewardAlertFlag = _.get(result, 'noRewardAlertFlag', false);
			this.contentSubMode = _.get(result, 'contentSubMode', '');


			this.getTopicProgress(result);
		});
		this.getMessagesService = this.contentService.getMessages().subscribe(result => {
			this.pedagogyMessages = _.get(result, 'messages', []);
		}, responseError => (this.errorInfo = responseError));
	}

	ngAfterViewInit() {
		this.addProgressModalClass();
		setTimeout(() => {
			this.contentService.setDisplayQuestionField(false);
		}, 10);
	}

	ngOnDestroy() {
		this.getTemplateService.unsubscribe();
		this.getQuestionContentService.unsubscribe();
		this.getMessagesService.unsubscribe();
		if (this.progressInterval) {
			clearInterval(this.progressInterval);
		}
	}

	getContentClassName(type) {
		let className = 'content-with-slide';
		if (type === 'type2') {
			className = this.userProgress === 0 ? 'content-with-slide' : 'content';
		}
		className = this.attemptNumber === 1 ? className : 'content';

		return className;
	}

	addProgressModalClass() {
		const modalDialog = document.querySelector('.modal-dialog');
		const modalContent = document.querySelector('.modal-content');
		if (modalDialog !== undefined && modalDialog !== null && modalDialog !== undefined && modalDialog !== null) {
			if (modalDialog !== undefined && modalDialog !== null) {
				modalDialog.classList.add('progress-dialog-animation');
			}
			if (modalContent !== undefined && modalContent !== null) {
				modalContent.classList.add('progress-content-animation');
			}
		} else {
			setTimeout(() => {
				this.addProgressModalClass();
			}, 10);
		}
	}

	showAnimationType(type) {
		let allowedTypes: number[];
		switch (type) {
			case 'type1':
				allowedTypes = [1];
				break;
			case 'type2':
				allowedTypes = [2, 4];
				break;
			case 'type3':
				allowedTypes = [3];
				break;
		}
		return allowedTypes.indexOf(this.animationType) > -1;
	}

	private getTopicProgress(result) {
		let currentProgress: any, totalProgress: any, timeout: number;
		this.contentDetails = result;
		this.progress = _.get(result, 'header.pedagogyContentRight.progress', {});
		currentProgress = _.get(this.progress, 'currentUnitNum', '').toString();
		totalProgress = _.get(this.progress, 'totalUnits', '').toString();
		if (
			currentProgress !== '' &&
			currentProgress !== null &&
			currentProgress !== undefined &&
			totalProgress !== '' &&
			totalProgress !== null &&
			totalProgress !== undefined
		) {
			currentProgress = parseInt(currentProgress, 10);
			totalProgress = parseInt(totalProgress, 10);
			this.userProgress = totalProgress - currentProgress;
			if (currentProgress === 1) {
				this.animationType = 1;
				timeout = 6000;
			} else if (this.userProgress === 0) {
				this.animationType = 4;
				this.changeFlagState();
				timeout = this.attemptNumber === 1 ? 12000 : 9000;
			} else if (this.userProgress === 1) {
				this.animationType = 3;

				this.changeFlagState();
				timeout = this.attemptNumber === 1 ? 12000 : 9000;
			} else {
				this.animationType = 2;
				this.changeFlagState();
				timeout = 6000;
			}
			this.setProgressValue(currentProgress);
		}
		setTimeout(() => {
			this.closeProgressModal();
		}, timeout);
	}

	changeFlagState() {
		setTimeout(() => {
			this.flag2src = 'assets/common/images/greenflag.png';
		}, 3000);
	}

	setProgressValue(currentValue) {
		this.progressValue = currentValue - 2;
		this.progressInterval = setInterval(() => {
			this.incrementProgressValue(currentValue);
		}, 50);
	}

	private incrementProgressValue(value) {
		this.progressValue += 1 / 50;
		if (this.progressValue >= value - 1) {
			clearInterval(this.progressInterval);
		}
	}

	closeProgressModal() {
		for (let i = 0; i < this.pedagogyMessages.length; i++) {
			const where = _.get(this.pedagogyMessages, i + '.beforeSubmit.where', '').toLowerCase();
			if (where === 'overlay') {
				this.pedagogyMessages[i].beforeSubmit.where = '';
				this.pedagogyMessages[i].beforeSubmit.messages.default = '';
				this.pedagogyMessages[i].beforeSubmit.messages.defaultClose = true;
				this.contentService.setMessages(this.pedagogyMessages);
			}
		}
		this.contentService.setMessageClose(true);
		this.contentService.setDisplayQuestionField(true);
		this.activeModal.close('Close click');
		this.loadSparkieAlertModal();
	}
	private loadSparkieAlertModal() {
		const modal = SparkieAlertsComponent;
		if (this.attemptNumber && this.from) {
			if (this.attemptNumber > 5 && this.from == 'topic' && this.noRewardAlertFlag == true) {
				this.sharedService.dismissOpenModal();
				setTimeout(() => {
					this.sharedService.open(modal, ['backDropStop']);
				});
			}
		} else {
			setTimeout(() => {
				this.loadSparkieAlertModal();
			}, 100);
		}
	}
}
