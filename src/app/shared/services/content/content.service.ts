import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from '../../../settings/app.settings';

@Injectable()
export class ContentService {
	appSettings: any = AppSettings;
	private baseURL: string;
	errorInfo: any;
	private usernameBehaviorSubject: BehaviorSubject<any>;
	private secretQuestionsBehaviorSubject: BehaviorSubject<any>;
	private templateBS: BehaviorSubject<any>;
	private unexpectedErrorBS: BehaviorSubject<any>;
	private contentBS: BehaviorSubject<any>;
	private messagesBS: BehaviorSubject<any>;
	private messageCloseBS: BehaviorSubject<any>;
	private conditionalAlertBS: BehaviorSubject<any>;
	private passwordTypeBS: BehaviorSubject<any>;
	private newCommentBS: BehaviorSubject<any>;
	private questionSubmitBS: BehaviorSubject<any>;
	private questionContentBS: BehaviorSubject<any>;
	private questionDisplayContentBS: BehaviorSubject<any>;
	private resetQuestionFieldBS: BehaviorSubject<any>;
	private displayQuestionFieldBS: BehaviorSubject<any>;
	private confirmQuitWorksheetBS: BehaviorSubject<any>;
	private expireWorksheetTimeBS: BehaviorSubject<any>;
	private translationContentBS: BehaviorSubject<any>;
	private setWorksheetQuesNavBS: BehaviorSubject<any>;
	private fetchFirstContentBS: BehaviorSubject<any>;
	private interactiveSubmitResponseBS: BehaviorSubject<any>;
	private activateNextBS: BehaviorSubject<any>;
	private voiceOverDisabledBS: BehaviorSubject<any>;
	private logoutSessionBS: BehaviorSubject<any>;
	private compatibleBrowserBS: BehaviorSubject<any>;
	private topicIdBS: BehaviorSubject<any>;
	private favouritesQuestionBS: BehaviorSubject<any>;
	private headerContentBS: BehaviorSubject<any>;
	private questionDataBS: BehaviorSubject<any>;
	private timerValueBS: BehaviorSubject<any>;
	private restartTimerBS: BehaviorSubject<any>;
	private scoreSheetBS: BehaviorSubject<any>;
	private keyboardElementsBS: BehaviorSubject<any>;
	private notificationDataBS: BehaviorSubject<any>;
	private promotionalShowStatusBS: BehaviorSubject<any>;
	private setNotificationTriggerBS: BehaviorSubject<any>;
	private openTransitionBS: BehaviorSubject<any>;
	private readMailDataBS: BehaviorSubject<any>;
	private mathJaxClearBS: BehaviorSubject<any>;
	private tileCalledFromBS: BehaviorSubject<any>;
	private worksheetNextSequenceBS: BehaviorSubject<any>;
	private pauseWorksheetTimerBS: BehaviorSubject<any>;
	private showWorksheetTimeoutModalBS: BehaviorSubject<any>;
	firstTimeUserDetails: any;
	private worksheetSubmitFromBS: BehaviorSubject<any>;
	constructor(private router: Router) {
		this.clearAllContentService();
	}

	setTemplate(result, type?: string, reset?: boolean) {
		let templateId = null;
		reset = !reset ? false : reset;
		if (!reset) {
			type = type ? type : '';
			let selectedTheme = '';
			if (type === 'login') {
				selectedTheme = _.get(result, 'selectedTheme', 'lowergrade').toLowerCase();
			} else {
				selectedTheme = _.get(result, 'userInformation.selectedTheme', 'lowergrade').toLowerCase();
			}
			templateId = _.get(AppSettings, 'GRADES_FOR_THEME.' + selectedTheme, null);
		} else {
			localStorage.removeItem('template');
		}
		if (templateId !== null) {
			localStorage.setItem('template', templateId);
			this.templateBS.next({
				template: templateId
			});
		}
	}
	getTemplate(): Observable<any> {
		return this.templateBS.asObservable();
	}
	getTemplateId(result) {
		return _.get(result, 'template', '1');
	}

	setUnexpectedError(state: string) {
		this.unexpectedErrorBS.next({ error: state });
	}
	getUnexpectedError(): Observable<any> {
		return this.unexpectedErrorBS.asObservable();
	}

	setBasicData(content) {
		this.contentBS.next({
			userInformation: content.userInformation,
			sessionInformation: content.sessionInformation,
			notifications: content.notifications,
			permittedNavs: content.permittedNavs,
			weeklySummary: content.weeklySummary,
			rewardSummary: content.rewardSummary
		});
	}
	getBasicData(): Observable<any> {
		return this.contentBS.asObservable();
	}

	setReadMailData(mail) {
		this.readMailDataBS.next({
			messageID: mail.messageID,
			type: mail.type
		});
	}

	getReadMailData(): Observable<any> {
		return this.readMailDataBS.asObservable();
	}
	validateResponse(response: any, request: any) {
		this.setUnexpectedError('close');
		const resultCode = _.get(response, 'resultCode', '').toLowerCase();

		let status = 'false';
		switch (resultCode) {
			case '':
				break;
			case 'c001':
				status = 'success';
				break;
			case 'c004':
				status = 'redirect';
				this.redirectToLocation(response, request);
				break;
			case 'c007':
				status = 'upload_failure';
				break;
			case 'cl001':
				status = 'password_mismatch';
				break;
			case 'cl002':
				status = 'username_not_found';
				break;
			case 'cl010':
				status = 'session_creation_failed';
				break;
			case 'cl011':
				status = 'no_product_access';
				break;
			case 'cl018':
				status = 'details_mismatch';
				break;
			case 's013':
				status = 'no_questions';
				this.redirectToLocation(response, request);
				break;
			default:
				status = 'unexpected';
				this.setUnexpectedError(status);
		}
		return status;
	}
	private redirectToLocation(response, request) {
		const redirectionCode = _.get(response, 'redirectionCode', '').toLowerCase();
		let url: string = _.get(AppSettings, 'REDIRECT_CODE[' + redirectionCode + ']', '');
		switch (redirectionCode) {
			case 'contentpage':
			case 'closecontent':
			case 'worksheetlist':
				url = '';
				break;
			default:
				break;
		}
		this.redirectToPath(url);
	}
	private redirectToPath(url) {
		if (url !== '') {
			this.router.navigate([url]);
		}
	}

	setMessages(messages: any) {
		this.messagesBS.next({
			messages: messages
		});
	}
	getMessages(): Observable<any> {
		return this.messagesBS.asObservable();
	}

	setMessageClose(value: boolean) {
		this.messageCloseBS.next({
			closed: value
		});
	}
	getMessageClose(): Observable<any> {
		return this.messageCloseBS.asObservable();
	}

	setConditionalAlert(value: string) {
		this.conditionalAlertBS.next({
			message: value
		});
	}
	getConditionalAlert(): Observable<any> {
		return this.conditionalAlertBS.asObservable();
	}

	setNewComment(status: boolean) {
		this.newCommentBS.next({
			added: status
		});
	}
	getNewComment(): Observable<any> {
		return this.newCommentBS.asObservable();
	}
	/**
     * This is a submit service in case of Blanks & Dropdowns.
     * Whereas a skip service for Games.
     *
     * @param value boolean
     */
	setQuestionSubmit(value: boolean) {

		this.questionSubmitBS.next({
			submit: value
		});
	}
	getQuestionSubmit(): Observable<any> {

		return this.questionSubmitBS.asObservable();
	}

	setFromWorksheet(value: any) {
		this.worksheetSubmitFromBS.next({
			from: value
		});
	}
	getFromWorksheet(): Observable<any> {
		return this.worksheetSubmitFromBS.asObservable();
	}

	setNextWorksheetSequence(value: any) {
		this.worksheetNextSequenceBS.next({
			sequence: value
		});
	}
	getNextWorksheetSequence(): Observable<any> {
		return this.worksheetNextSequenceBS.asObservable();
	}

	setQuestionContent(value: any) {
		this.questionContentBS.next({
			from: _.get(value, 'from', ''),
			mode: _.get(value, 'mode', ''),
			action: _.get(value, 'action', ''),
			context: _.get(value, 'context', ''),
			grade: _.get(value, 'grade', ''),
			isDynamic: _.get(value, 'isDynamic', ''),
			attemptNumber: _.get(value, 'attemptNumber', null),
			header: _.get(value, 'header', null),
			topicID: _.get(value, 'topicID', ''),
			conceptID: _.get(value, 'conceptID', ''),
			contentId: _.get(value, 'contentId', ''),
			contentSeqNum: _.get(value, 'contentSeqNum', ''),
			contentType: _.get(value, 'contentType', ''),
			contentMode: _.get(value, 'contentMode', ''),
			contentSubMode: _.get(value, 'contentSubMode', ''),
			revisionNo: _.get(value, 'revisionNo', ''),
			contentAttempted: _.get(value, 'contentAttempted', ''),
			dynamicParameters: _.get(value, 'dynamicParameters', ''),
			displayMessages: _.get(value, 'displayMessages', ''),
			isFavourite: _.get(value, 'isFavourite', false),
			contentName: _.get(value, 'contentName', ''),
			templateContent: _.get(value, 'templateContent', ''),
			hasTranslation: _.get(value, 'hasTranslation', false),
			timedTestData: _.get(value, 'timedTestData', {}),
			noRewardAlertFlag: _.get(value, 'noRewardAlertFlag', ''),
			worksheetName: _.get(value, 'worksheetName', {}),
			worksheetID: _.get(value, 'worksheetID', {}),
			worksheetMode: _.get(value, 'mode', {})
		});
	}
	getQuestionContent(): Observable<any> {
		return this.questionContentBS.asObservable();
	}

	setQuestionDisplayContent(value: any) {
		this.questionDisplayContentBS.next({ content: value });
	}
	getQuestionDisplayContent(): Observable<any> {
		return this.questionDisplayContentBS.asObservable();
	}

	setResetQuestionField(state: boolean) {
		this.resetQuestionFieldBS.next({ empty: state });
	}
	getResetQuestionField(): Observable<any> {
		return this.resetQuestionFieldBS.asObservable();
	}

	setDisplayQuestionField(state: boolean) {
		this.displayQuestionFieldBS.next({ show: state });
	}
	getDisplayQuestionField(): Observable<any> {
		return this.displayQuestionFieldBS.asObservable();
	}

	setConfirmQuitWorksheet(state) {
		this.confirmQuitWorksheetBS.next({ state: state });
	}
	getConfirmQuitWorksheet(): Observable<any> {
		return this.confirmQuitWorksheetBS.asObservable();
	}

	setExpireWorksheetTime(state) {
		this.expireWorksheetTimeBS.next({ expired: state });
	}
	getExpireWorksheetTime(): Observable<any> {
		return this.expireWorksheetTimeBS.asObservable();
	}

	setTranslationContent(data) {
		this.translationContentBS.next({
			language: _.get(data, 'language', null),
			hasTranslation: _.get(data, 'hasTranslation', false),
			showTranslation: _.get(data, 'showTranslation', false),
			displayContent: _.get(data, 'displayContent', {})
		});
	}
	getTranslationContent(): Observable<any> {
		return this.translationContentBS.asObservable();
	}

	setNotificationData(data) {
		this.notificationDataBS.next({
			notifications: _.get(data, 'notifications', []),
			count: _.get(data, 'count', 0),
			promotional: _.get(data, 'promotional', [])
		});
	}
	getNotificationData(): Observable<any> {
		return this.notificationDataBS.asObservable();
	}

	setFlyNotificationStatus(readStatus) {
		this.promotionalShowStatusBS.next({
			status: readStatus
		});
	}
	getFlyNotificationStatus(): Observable<any> {
		return this.promotionalShowStatusBS.asObservable();
	}

	setNotificationTrigger(trigger) {
		this.setNotificationTriggerBS.next({
			trigger: trigger
		});
	}
	getNotificationTrigger(): Observable<any> {
		return this.setNotificationTriggerBS.asObservable();
	}

	setQuestionData(data) {
		this.questionDataBS.next({
			questionData: _.get(data, 'questionData', []),
			remainingTime: _.get(data, 'remainingTime', null),
			totalTime: _.get(data, 'totalTime', null),
			timed: _.get(data, 'timed', false),
			name: _.get(data, 'name', ''),
			pedagogyStatus: _.get(data, 'pedagogyStatus', '')
		});
	}
	getQuestionData(): Observable<any> {
		return this.questionDataBS.asObservable();
	}

	setWorksheetQuesNav(data) {
		this.setWorksheetQuesNavBS.next({
			navValue: _.get(data, 'navValue', ''),
			value: _.get(data, 'value', ''),
			action: _.get(data, 'action', '')
		});
	}
	getWorksheetQuesNav(): Observable<any> {
		return this.setWorksheetQuesNavBS.asObservable();
	}

	setTimerValue(data) {
		this.timerValueBS.next({
			worksheetValue: _.get(data, 'worksheetValue', false),
			endTimer: _.get(data, 'remainingTime', null)
		});
	}
	getTimerValue() {
		return this.timerValueBS.asObservable();
	}

	setRestartTimer(state: boolean) {
		this.restartTimerBS.next({ state: state });
	}
	getRestartTimer(): Observable<any> {
		return this.restartTimerBS.asObservable();
	}

	setScoreSheet(data) {
		this.scoreSheetBS.next({
			open: _.get(data, 'open', false),
			finished: _.get(data, 'finished', false),
			duration: _.get(data, 'duration', null),
			timeTaken: _.get(data, 'timeTaken', null),
			totalAttempted: _.get(data, 'totalAttempted', null),
			totalCorrect: _.get(data, 'totalCorrect', null),
			totalQuestions: _.get(data, 'totalQuestions', null)
		});
	}
	getScoreSheet(): Observable<any> {
		return this.scoreSheetBS.asObservable();
	}

	setKeyboardElements(data) {
		this.keyboardElementsBS.next({
			isDevice: _.get(data, 'isDevice', null),
			isKeyboard: _.get(data, 'isKeyboard', null),
			allInputs: _.get(data, 'allInputs', null),
			selectedInput: _.get(data, 'selectedInput', null)
		});
	}
	getKeyboardElements(): Observable<any> {
		return this.keyboardElementsBS.asObservable();
	}

	setInteractiveSubmitResponse(data) {
		this.interactiveSubmitResponseBS.next({
			result: data
		});
	}
	getInteractiveSubmitResponse(): Observable<any> {
		return this.interactiveSubmitResponseBS.asObservable();
	}

	setActivateNext(next: boolean) {
		this.activateNextBS.next({
			next: next
		});
	}
	getActivateNext(): Observable<any> {
		return this.activateNextBS.asObservable();
	}

	setVoiceOverDisabled(state: boolean) {
		this.voiceOverDisabledBS.next({
			state: state
		});
	}
	getVoiceOverDisabled(): Observable<any> {
		return this.voiceOverDisabledBS.asObservable();
	}
	setLogoutSession(type: number) {
		this.logoutSessionBS.next({
			type: type
		});
	}
	getLogoutSession(): Observable<any> {
		return this.logoutSessionBS.asObservable();
	}

	setFirstTimeUserDetails(details) {
		this.firstTimeUserDetails = details;
	}
	getFirstTimeUserDetails() {
		return this.firstTimeUserDetails;
	}

	setFetchFirstContent(value) {
		this.fetchFirstContentBS.next({ fetch: value });
	}
	getFetchFirstContent(): Observable<any> {
		return this.fetchFirstContentBS.asObservable();
	}
	setTileCalledFrom(from) {
		this.tileCalledFromBS.next({
			from: from
		});
	}

	getTileCalledFrom(): Observable<any> {
		return this.tileCalledFromBS.asObservable();
	}
	setRouterDetails(property: any) {
		this.compatibleBrowserBS.next({
			compatible: _.get(property, 'compatible', false),
			cookies: _.get(property, 'cookies', false),
			localStorage: _.get(property, 'localStorage', false),
			sessionStorage: _.get(property, 'sessionStorage', false),
			dragDrop: _.get(property, 'dragDrop', false),
			firewall: _.get(property, 'firewall', false)
		});
	}
	getRouterDetails(): Observable<any> {
		return this.compatibleBrowserBS.asObservable();
	}

	setTopicId(topicId) {
		this.topicIdBS.next({
			topicId: topicId
		});
	}
	getTopicId(): Observable<any> {
		return this.topicIdBS.asObservable();
	}

	setFavouritesQuestionIndex(data) {
		this.favouritesQuestionBS.next({
			startFrom: _.get(data, 'startFrom', 1),
			limit: _.get(data, 'limit', AppSettings.PAGINATION_LIMIT),
			topicID: _.get(data, 'topicID', null)
		});
	}
	getFavouritesQuestionIndex(): Observable<any> {
		return this.favouritesQuestionBS.asObservable();
	}

	contentPageRedirect(response) {
		const redirectionCode = _.get(response, 'redirectionCode', '').toLowerCase();
		const url: string = _.get(AppSettings, 'REDIRECT_CODE[' + redirectionCode + ']', '');
		if (url !== '') {
			this.router.navigate([url]);
		} else {
			console.log('redirection Data', response);
		}
	}

	setHeaderContent(header) {
		this.headerContentBS.next({
			pedagogyType: _.get(header, 'type', null)
		});
	}
	getHeaderContent(): Observable<any> {
		return this.headerContentBS.asObservable();
	}

	setOpenTransition(state: boolean) {
		this.openTransitionBS.next({
			open: state
		});
	}
	getOpenTransition(): Observable<any> {
		return this.openTransitionBS.asObservable();
	}

	setMathJaxClear(state: boolean) {
		this.mathJaxClearBS.next({
			clear: state
		});
	}
	getMathJaxClear(): Observable<any> {
		return this.mathJaxClearBS.asObservable();
	}

	readNotification(notification) {
		const notificationType = _.get(notification, '', null);
		if (notification) {
			if (notification.typeOf === 'redirect') {
				const redirectTo = _.get(notification, 'redirectTo', '');
				this.handleRedirect(redirectTo, notification);
			}
		}
	}

	handleRedirect(redirectTo, notification) {
		redirectTo = redirectTo.toLowerCase();
		const type: any = _.get(notification, 'type', '');
		let url = '';
		switch (redirectTo) {
			case 'myworksheet':
				url = './worksheets';
				break;
			case 'mytopics':
				url = './topics';
				break;
			case 'mydetails':
				url = './my-mindspark/my-details';
				break;
			case 'messagetrail':
				let messageId: any = '';
				if (type === 'comment') {
					url = './my-mindspark/mailbox/' + notification.data.commentID;
					messageId = notification.data.commentID;
				} else if (type === 'notification') {
					url = './my-mindspark/mailbox/' + notification.nID;
					messageId = notification.nID;
				}
				const data: any = {
					messageID: messageId,
					type: type
				};
				this.setReadMailData(data);
				break;
			default:
				url = './my-mindspark/mailbox';
				break;
		}
		this.router.navigate([url]);
	}

	setWorksheetPauseTimer(value) {
		this.pauseWorksheetTimerBS.next({
			pauseTimer: value
		});
	}

	getWorksheetPauseTimer() {
		return this.pauseWorksheetTimerBS.asObservable();
	}

	setShowTimeoutModal(value) {
		this.showWorksheetTimeoutModalBS.next(value);
	}

	getShowTimeoutModal() {
		return this.showWorksheetTimeoutModalBS.asObservable();
	}

	// getWorksheetNextButtonValue() {
	//     return this.showWorksheetNextButtonBS.asObservable();
	// }

	// setWorksheetNextButtonValue(value) {
	//     this.showWorksheetNextButtonBS.next({
	//         show: value
	//     });
	// }
	clearAllContentService() {
		this.setTemplate('', '', true);
		this.usernameBehaviorSubject = new BehaviorSubject({
			username: 'Student',
			category: 'teacher',
			retailUser: false
		});
		this.secretQuestionsBehaviorSubject = new BehaviorSubject({ secretQuestion: [''] });
		this.templateBS = new BehaviorSubject({ template: null });
		this.unexpectedErrorBS = new BehaviorSubject({ error: null });
		this.contentBS = new BehaviorSubject({
			userInformation: {},
			sessionInformation: {},
			notifications: {},
			permittedNavs: {},
			weeklySummary: {},
			rewardSummary: {}
		});
		this.messagesBS = new BehaviorSubject({ messages: [] });
		this.messageCloseBS = new BehaviorSubject({ closed: false });
		this.conditionalAlertBS = new BehaviorSubject({ message: null });
		this.passwordTypeBS = new BehaviorSubject({ type: 'picture' });
		this.newCommentBS = new BehaviorSubject({ added: false });
		this.questionSubmitBS = new BehaviorSubject({ submit: false });
		this.questionContentBS = new BehaviorSubject({
			from: '',
			grade: '',
			isDynamic: '',
			mode: '',
			action: '',
			context: '',
			attemptNumber: null,
			header: null,
			topicID: '',
			conceptID: '',
			contentId: '',
			contentSeqNum: '',
			contentType: '',
			contentMode: '',
			contentSubMode: '',
			revisionNo: '',
			contentAttempted: '',
			dynamicParameters: '',
			displayMessages: [],
			isFavourite: false,
			contentName: '',
			templateContent: '',
			hasTranslation: null,
			timedTestData: {}
		});
		this.questionDisplayContentBS = new BehaviorSubject({ content: {} });
		this.resetQuestionFieldBS = new BehaviorSubject({ empty: false });
		this.displayQuestionFieldBS = new BehaviorSubject({ show: true });
		this.confirmQuitWorksheetBS = new BehaviorSubject({ state: false });
		this.expireWorksheetTimeBS = new BehaviorSubject({ expired: false });
		this.translationContentBS = new BehaviorSubject({
			language: null,
			showTranslation: false,
			displayContent: {}
		});
		this.setWorksheetQuesNavBS = new BehaviorSubject({ navValue: false, value: 1, action: 'next' });
		/**
         * To get the api's remaining time
         */
		this.questionDataBS = new BehaviorSubject({
			questionData: [],
			remainingTime: null,
			totalTime: null,
			timed: false,
			name: '',
			pedagogyStatus: ''
		});
		/**
         *To get the timer remaining time
         */
		this.timerValueBS = new BehaviorSubject({ worksheetValue: false, remainingTime: null });
		this.restartTimerBS = new BehaviorSubject({ state: null });
		this.scoreSheetBS = new BehaviorSubject({
			open: false,
			finished: false,
			duration: null,
			timeTaken: null,
			totalAttempted: null,
			totalCorrect: null,
			totalQuestions: null
		});
		this.keyboardElementsBS = new BehaviorSubject({
			isDevice: null,
			isKeyboard: null,
			allInputs: null,
			selectedInput: null
		});
		this.interactiveSubmitResponseBS = new BehaviorSubject({ result: null });
		this.activateNextBS = new BehaviorSubject({ next: false });
		this.voiceOverDisabledBS = new BehaviorSubject({ state: false });
		this.logoutSessionBS = new BehaviorSubject({ type: null });
		this.fetchFirstContentBS = new BehaviorSubject({ fetch: false });
		this.compatibleBrowserBS = new BehaviorSubject({
			cookies: null,
			localStorage: null,
			sessionStorage: null,
			dragDrop: null,
			firewall: null,
			compatible: null
		});
		this.topicIdBS = new BehaviorSubject({ topicId: null });
		this.favouritesQuestionBS = new BehaviorSubject({
			startFrom: 1,
			limit: AppSettings.PAGINATION_LIMIT,
			topicID: ''
		});
		this.headerContentBS = new BehaviorSubject({
			pedagogyType: null
		});
		this.notificationDataBS = new BehaviorSubject({
			notifications: [],
			count: 0
		});

		this.promotionalShowStatusBS = new BehaviorSubject({
			status: false
		});
		this.setNotificationTriggerBS = new BehaviorSubject({
			trigger: null
		});
		this.openTransitionBS = new BehaviorSubject({
			open: null
		});
		this.readMailDataBS = new BehaviorSubject({
			messageID: null,
			type: null
		});
		this.mathJaxClearBS = new BehaviorSubject({ clear: null });
		this.tileCalledFromBS = new BehaviorSubject({ from: null });
		this.worksheetNextSequenceBS = new BehaviorSubject({ sequence: null });
		this.pauseWorksheetTimerBS = new BehaviorSubject({ pauseTimer: false });
		this.worksheetSubmitFromBS = new BehaviorSubject({ from: null });
		this.showWorksheetTimeoutModalBS = new BehaviorSubject(false);
	}
}
