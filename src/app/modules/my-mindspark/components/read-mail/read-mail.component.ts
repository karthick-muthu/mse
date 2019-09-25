import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { AppSettings } from '../../../../settings/app.settings';
import { CommentModalService } from '../../../../shared/components/comments/comment-modal/comment-modal.service';
import { ContentService } from '../../../../shared/services/content/content.service';
import { QuestionDisplayReformService } from '../../../../shared/services/question/questionDisplayReform.service';
import { SharedService } from '../../../../shared/shared.service';
import { MailboxService } from '../mailbox/mailbox.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'ms-read-mail',
	templateUrl: './read-mail.component.html',
	styleUrls: ['./read-mail.component.scss']
})
export class ReadMailComponent implements OnInit, OnDestroy {
	readMailDataSubscription: Subscription;
	buttonTextForAlert: string;
	messageType: any;
	messageID: any;
	@ViewChild('uploadFile') attachFile;
	template: string;
	templateClass: string;
	commentId: any;
	readmail: any;
	rating: any;
	explain: string;
	files: any[] = [];
	replyMessage: FormGroup;
	closeResult: string;
	images: any;
	textlimit: number;
	messageDetails: any;
	displayContent: any;
	uploadFileError: string;
	errorInfo: any;
	showAnswer: boolean;

	constructor(
		private config: NgbRatingConfig,
		private route: ActivatedRoute,
		private commentModalService: CommentModalService,
		private mailBoxService: MailboxService,
		private sharedService: SharedService,
		private contentService: ContentService,
		private questionDisplayReformService: QuestionDisplayReformService,
		private router: Router
	) {
		this.sharedService.setSiteTitle('ReadMail');
		this.explain = 'show question';
		this.config.max = AppSettings.RATING_CONFIG;
		this.textlimit = AppSettings.TEXT_LIMIT;
		this.sharedService.setTrailFrom('messageTrail');
		this.contentService.getTemplate().subscribe(result => {
			this.template = this.contentService.getTemplateId(result);
			this.templateClass = this.sharedService.getClassName();
		}, responseError => (this.errorInfo = responseError));
		this.readMailDataSubscription = this.contentService.getReadMailData().subscribe(result => {
			this.messageID = result.messageID;
			this.messageType = result.type;
			this.getMessageTrailData();
		});
	}

	ngOnInit() {
		this.commentId = this.getCommentId();
		this.resetReplyMessage();
		this.questionDisplayReformService.loadJS().then(result => this.setDisplayContent());
	}

	ngOnDestroy() {
		this.contentService.setMathJaxClear(true);
		this.readMailDataSubscription.unsubscribe();
	}

	imagePicker(category) {
		return this.sharedService.notificationImagePicker(category);
	}

	resetReplyMessage() {
		this.files = [];
		this.removeFile();
		this.replyMessage = new FormGroup({
			replyBody: new FormControl('', Validators.required)
		});
	}

	setDisplayContent() {
		if (typeof this.messageDetails !== 'undefined' && typeof window['ContentService'] !== 'undefined') {
			this.questionDisplayReformService.initContentService([this.messageDetails]);
			this.displayContent = this.questionDisplayReformService.getQuestionsContent();
		} else {
			setTimeout(() => {
				this.setDisplayContent();
			}, 100);
		}
	}

	getMessageTrailData() {
		/* check if messaege id not empty, else show error in an alert and return to mailbox */
		const data = {
			messageID: this.messageID,
			type: this.messageType
		};

		this.sharedService.showLoader();
		this.mailBoxService.getMessageTrailData(data).subscribe(result => {
			const status = this.contentService.validateResponse(result, data);
			this.sharedService.handleUnexpectedResponse(status);
			if (status === 'success') {
				this.readmail = result;

				this.contentService.setTemplate(result);
				this.contentService.setBasicData(result);
				//this.showAnswer = false;
				this.showAnswer = _.get(this.readmail, 'messageDetails.settings.showAnswer', null);

				this.messageDetails = _.get(this.readmail, 'messageDetails', null);
				this.rating = _.get(this.readmail, 'messageDetails.rate.rating', 0);
				this.buttonTextForAlert = this.getButtonText();
			}
			this.sharedService.hideLoader();
		}, responseError => (this.errorInfo = this.sharedService.handleResponseError(responseError)));
	}

	getCommentId() {
		return this.route.snapshot.url[1].path;
	}

	showQuestion() {
		this.explain = this.explain === 'show question' ? 'hide question' : 'show question';
	}

	actionsForAlerts() {
		const actions: any = _.get(this.readmail, 'messageTrail[0].action.buttons', {});
		const topicId: any = _.get(this.readmail, 'messageTrail[0].data.topicID', '');
		const redirectTo: any = _.get(this.readmail, 'messageTrail[0].redirectTo', '').toLowerCase();

		let url = '';
		switch (redirectTo) {
			case 'myworksheet':
				url = 'worksheets';
				break;
			case 'mydetails':
				url = 'my-mindspark/my-details';
				break;
			case 'topicdetails':
				url = 'topics/detail';
				this.contentService.setTopicId(topicId);
				break;
			case 'mytopics':
				url = 'topics';
				break;
			case 'activitylist':
				url = 'games';
				break;
			case 'myprogress':
				url = 'my-progress';
				break;
			case 'myrewards':
				url = 'my-mindspark/rewards';
				break;
			case 'topictrail':
				url = 'topics/trails';
				const data = {
					startFrom: 1,
					limit: 20,
					topicId: topicId,
					index: 1
				};
				this.sharedService.setTopicTrailData(data);
				break;
		}
		const data = {
			nID: _.get(this.messageDetails, 'nID', '')
		};
		this.mailBoxService.markNotificationAsRead(data).subscribe(result => {
			const response = this.contentService.validateResponse(result, '');
			if (response === 'success') {
				this.router.navigate([url]);
			}
		});
	}

	getButtonText() {
		const actions: any = _.get(this.readmail, 'messageTrail[0].action.buttons', {});

		let buttonText = '';
		if (!_.isEmpty(actions) && actions[0].type === 'button') {
			switch (actions[0].key.toLowerCase()) {
				case 'gotoworksheet':
					buttonText = 'go to worksheet page';
					break;
				case 'gotomydetails':
					buttonText = 'go to my details';
					break;
				case 'gototopicdetails':
					buttonText = 'go to topic details';
					break;
			}
		}
		return buttonText;
	}

	updateSelectedFiles() {
		const files = [];
		if (this.attachFile) {
			const file = this.attachFile.nativeElement;
			if (file.files && file.files[0]) {
				const uploadFile = file.files;
				for (let i = 0; i < uploadFile.length; i++) {
					const thisFile = uploadFile[i];
					files.push({ filename: thisFile.name });
				}
			}
		}
		this.files = files;
	}

	removeFile() {
		if (this.attachFile) {
			this.attachFile.nativeElement.value = '';
		}
		this.files = [];
	}

	saveCommentRating(rating) {
		this.sharedService.showLoader();
		const data = {
			rating: rating,
			commentID: this.commentId
		};
		this.mailBoxService.saveRating(data).subscribe(result => {
			const status = this.contentService.validateResponse(result, data);
			this.sharedService.handleUnexpectedResponse(status);
			if (status === 'success') {
				console.log('Rating updated.');
			}
			this.sharedService.hideLoader();
		}, responseError => (this.errorInfo = this.sharedService.handleResponseError(responseError)));
	}

	replyToMessage() {
		this.sharedService.showLoader();
		let uploadFileError = '';
		let uploadFileState = '';
		const maxFileUpload = AppSettings.MAX_IMAGE_SIZE;
		const formData = new FormData();
		if (this.attachFile) {
			const file = this.attachFile.nativeElement;
			if (file.files && file.files[0]) {
				const uploadFile = file.files;
				for (let i = 0; i < uploadFile.length; i++) {
					const thisFile = uploadFile[i];
					if (thisFile.type.indexOf('image') !== 0) {
						uploadFileState = 'invalidType';
					} else {
						const fileSize = thisFile.size / 1024;
						if (fileSize > maxFileUpload * 1024) {
							uploadFileState = 'fileSize';
						}
					}
				}
				if (uploadFileState === '') {
					for (let i = 0; i < uploadFile.length; i++) {
						formData.append('attachments[]', uploadFile[i]);
					}
				} else if (uploadFileState === 'invalidType') {
					const acceptedTypes = AppSettings.IMAGE_FORMAT.join(' or ');
					uploadFileError = 'Upload only files of type ' + acceptedTypes + '.';
				} else if (uploadFileState === 'fileSize') {
					uploadFileError = 'File size should not be greater than ' + maxFileUpload + 'MB.';
				}
			} else {
				console.log('No file selected.');
			}
		}
		if (uploadFileState === '') {
			formData.append('replyBody', this.replyMessage.value.replyBody);
			formData.append('messageID', this.commentId);

			this.commentModalService.replyToMessage(formData).subscribe(result => {
				const status = this.contentService.validateResponse(result, {});
				this.sharedService.handleUnexpectedResponse(status);
				if (status === 'success') {
					this.getMessageTrailData();
				}
				this.sharedService.hideLoader();
			}, responseError => (this.errorInfo = this.sharedService.handleResponseError(responseError)));
			this.resetReplyMessage();
		} else {
			this.sharedService.hideLoader();
			this.uploadFileError = uploadFileError;
			if (this.uploadFileError !== '') {
				setTimeout(() => (this.uploadFileError = ''), 3000);
			}
		}
	}

	open(imageBoxModal, fileName) {
		this.sharedService.open(imageBoxModal);
		this.images = fileName;
	}

	disableSend() {
		return this.replyMessage.invalid;
	}

	generateOptionString(index) {
		return this.questionDisplayReformService.generateOptionString(index);
	}
}
