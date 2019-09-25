import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { StarredQuestionsService } from '../../../../../modules/my-mindspark/components/starred-questions/starred-questions.service';
import { StarredQuestionsComponent } from '../../../../../modules/my-mindspark/components/starred-questions/starred-questions.component';
import { QuestionDisplayReformService } from '../../../../services/question/questionDisplayReform.service';
import { ContentService } from '../../../../services/content/content.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Rx';
import { SharedService } from '../../../../shared.service';
@Component({
	selector: 'ms-starred-questions-t2',
	templateUrl: './starred-questions-t2.component.html',
	styleUrls: ['./starred-questions-t2.component.scss']
})
export class StarredQuestionsT2Component implements OnInit, OnChanges, OnDestroy {
	@Input('favouritesQuestion') favouritesQuestion: any;
	private initialLoad: boolean;
	showingFrom: any;
	displayContent: any;
	title: string;
	favouritesList: any[] = [];
	showExplanation: boolean;
	moreExplanation: boolean[] = [];

	constructor(
		private sharedService: SharedService,
		private starredQuestionsComponent: StarredQuestionsComponent,
		private starredQuestionsService: StarredQuestionsService,
		private contentService: ContentService,
		private questionDisplayReformService: QuestionDisplayReformService
	) {
		this.initialLoad = true;
	}

	ngOnInit() {
		this.callLoadJs();
	}

	ngOnChanges(changes: any): void {
		const changesValue = _.get(changes, 'favouritesQuestion.currentValue', {});
		if (changesValue !== null && changesValue !== undefined) {
			this.favouritesQuestion = _.cloneDeep(changesValue);
			this.showExplanation = _.get(changesValue, 'settings[0].showAns', true);
			this.showingFrom = _.get(this.favouritesQuestion, 'showingFrom', 1);
			this.favouritesList = _.get(changesValue, 'favouritesList', []);
			this.initializeContent();
		}
	}

	ngOnDestroy() {
		this.contentService.setMathJaxClear(true);
	}

	private callLoadJs() {
		this.questionDisplayReformService.loadJS().then(result => {
			if (result.result !== 'failed') {
				return true;
			} else {
				this.callLoadJs();
			}
		});
	}

	private initializeContent() {
		this.questionDisplayReformService.initContentService(this.favouritesList);
		setTimeout(() => (this.displayContent = this.questionDisplayReformService.getQuestionsContent()), 200);
		this.showMoreExplanation(this.favouritesList);
	}

	showMoreExplanation(favouritesList) {
		for (let i = 0; i < favouritesList.length; i++) {
			this.moreExplanation.push(false);
		}
		return this.moreExplanation;
	}

	toggleExplanation(i) {
		this.starredQuestionsComponent.toggleExplanation(i, this.moreExplanation);
	}

	generateOptionString(index) {
		return this.starredQuestionsComponent.generateOptionString(index);
	}

	removeFromFavourites(fav) {
		const removeFavouritesData = {
			contentId: fav.contentID,
			topicId: this.favouritesQuestion.topicID
		};
		this.starredQuestionsComponent.removeFromFavourites(removeFavouritesData);
	}
	// getFavouritesQuestionService(updatedData) {
	// 	this.sharedService.showLoader();
	// 	this.starredQuestionsService.getFavouritesList(updatedData).subscribe(result => {
	// 		const status = this.contentService.validateResponse(result, {});
	// 		this.sharedService.handleUnexpectedResponse(status);
	// 		if (status === 'success') {
	// 			this.favouritesQuestion = result;
	// 			this.showAnswer = result.settings.showAnswer;
	// 		}
	// 		this.sharedService.hideLoader();
	// 	});
	// }
}
