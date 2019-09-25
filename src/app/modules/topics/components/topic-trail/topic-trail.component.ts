import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { ContentService } from '../../../../shared/services/content/content.service';
import { SharedService } from '../../../../shared/shared.service';
import { TopicListService } from '../../services/topic-list.service';
import { AppSettings } from '../../../../settings/app.settings';
import { QuestionDisplayReformService } from '../../../../shared/services/question/questionDisplayReform.service';

@Component({
	selector: 'ms-topic-trail',
	templateUrl: './topic-trail.component.html',
	styleUrls: ['./topic-trail.component.scss']
})
export class TopicTrailComponent implements OnInit, OnDestroy {
	maxPageSize: any;
	displayContent: any;
	showWronglyAnsweredQuestions: boolean;
	trailList: any[];
	topicDetails: any;
	topicTrailSubscription: Subscription;
	from: string;
	template: string;
	errorInfo: any;
	topicTrailHeaderData: any;
	templateService: Subscription;
	topicTrailData: any;
	currentTopicTrailData: any;
	settings: any;
	collectionSize: any;
	totalPages: any;
	currentPage: any;
	totalPagesCount: any;
	showWrongAnswers: boolean;
	templateClass: string;
	showAnswer: boolean;

	constructor(
		private sharedService: SharedService,
		private contentService: ContentService,
		private topicListService: TopicListService,
		private questionDisplayReformService: QuestionDisplayReformService
	) {
		this.maxPageSize = AppSettings.PAGINATION_MAX_SIZE;
		this.displayContent = [];
		this.contentService.getTemplate().subscribe(result => {
			this.template = this.contentService.getTemplateId(result);
		}, responseError => (this.errorInfo = responseError));

		this.templateService = this.contentService.getTemplate().subscribe(result => {
			this.template = this.contentService.getTemplateId(result);
			this.templateClass = this.sharedService.getClassName();
		}, responseError => (this.errorInfo = responseError));
		this.topicTrailSubscription = this.sharedService.getTopicTrailData().subscribe(result => {
			this.currentTopicTrailData = result;
			this.getTopicTrailService(result);
		});
		this.sharedService.setTrailFrom('topics');
		this.sharedService.setSiteTitle('Topic Trails');
	}

	ngOnInit() {
		this.showWronglyAnsweredQuestions = false;
		const body = document.getElementsByTagName('body')[0];
		body.classList.add('body-bg');
		this.showWrongAnswers = false;
		this.callLoadJs();
	}

	getTopicTrailService(result) {
		this.sharedService.showLoader();
		this.topicListService.getTopicTrail(result).subscribe(topicTrailResult => {
			this.contentService.setBasicData(topicTrailResult);
			this.topicTrailHeaderData = _.get(topicTrailResult, 'topicDetails', {});
			this.topicTrailData = topicTrailResult;
			this.extractNecessaryData();
			this.from = 'topicTrail';
			this.sharedService.hideLoader();
		}, responseError => (this.errorInfo = this.sharedService.handleResponseError(responseError)));
	}

	check() {
		this.showWronglyAnsweredQuestions = !this.showWronglyAnsweredQuestions;
	}

	extractNecessaryData() {
		this.topicDetails = _.get(this.topicTrailData, 'topicDetails', null);
		this.settings = _.get(this.topicTrailData, 'settings', null);
		//this.showAnswer = false;
		this.showAnswer = _.get(this.topicTrailData, 'settings.showAnswer', null);
		this.collectionSize = _.get(this.topicDetails, 'totalRecords', 1);
		this.totalPages = _.get(this.topicDetails, 'totalPages', 1);
		this.currentPage = _.get(this.topicDetails, 'currentPage', 1);
		this.totalPagesCount = _.get(this.topicDetails, 'pageItemCount', AppSettings.PAGINATION_LIMIT);
		this.trailList = _.get(this.topicTrailData, 'trailList', []);
		this.questionDisplayReformService.initContentService(this.trailList);
		setTimeout(() => {
			this.displayContent = this.questionDisplayReformService.getQuestionsContent();
			for (let i = 0; i < this.displayContent.length; i++) {
				const contentMode = this.trailList[i].contentMode;
				this.displayContent[i].index = i;
				if (
					this.trailList[i].contentType === 'question' &&
					this.displayContent[i].contentType === 'question' &&
					contentMode
				) {
					if (this.displayContent[i].userAnswer.result.toLowerCase() === 'fail') {
						this.showWrongAnswers = true;
					} else if (this.displayContent[i].userAnswer.result.toLowerCase() === 'skip') {
						this.displayContent[i].userAnswer.userAnswer = 'Skipped';
					}
					this.displayContent[i].contentMode = contentMode;
				}
			}
		}, 200);
	}
	callLoadJs() {
		this.questionDisplayReformService.loadJS().then(result => {
			if (result.result !== 'failed') {
				return true;
			} else {
				this.callLoadJs();
			}
		});
	}

	generateOptionString(index) {
		return this.questionDisplayReformService.generateOptionString(index);
	}

	loadPage(page) {
		if (page !== this.currentPage) {
			this.currentPage = page;
			const data = {
				startFrom: (this.currentPage - 1) * this.totalPagesCount + 1,
				limit: 20,
				topicId: this.currentTopicTrailData.topicId,
				index: this.currentPage
			};
			this.showWronglyAnsweredQuestions = false;
			this.showWrongAnswers = false;
			this.sharedService.setTopicTrailData(data);
		}
	}

	ngOnDestroy() {
		this.topicTrailSubscription.unsubscribe();
		this.contentService.setMathJaxClear(true);
	}
}
