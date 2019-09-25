import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';
import { ContentService } from '../../../../shared/services/content/content.service';
import { StarredQuestionsService } from './starred-questions.service';
import { AppSettings } from '../../../../settings/app.settings';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import { QuestionDisplayReformService } from '../../../../shared/services/question/questionDisplayReform.service';

@Component({
	selector: 'ms-starred-questions',
	templateUrl: './starred-questions.component.html',
	styleUrls: ['./starred-questions.component.scss']
})
export class StarredQuestionsComponent implements OnInit, OnDestroy {
	private getTemplateService: Subscription;
	private favouritesQuestionIndexSubscription: Subscription;
	updatedData: any;
	totalPagesCount: any;
	favouritesQuestion: any;
	template: string;
	errorInfo: any;
	appSettings: any = AppSettings;

	constructor(
		private sharedService: SharedService,
		private contentService: ContentService,
		private starredQuestionsService: StarredQuestionsService,
		private questionDisplayReformService: QuestionDisplayReformService
	) {
		this.sharedService.setSiteTitle('Favourites');
		this.getTemplateService = this.contentService.getTemplate().subscribe(result => {
			this.template = this.contentService.getTemplateId(result);
		}, responseError => (this.errorInfo = responseError));
		this.favouritesQuestionIndexSubscription = this.contentService
			.getFavouritesQuestionIndex()
			.subscribe(result => {
				this.getFavouritesQuestionService(result);
			});
		this.sharedService.setTrailFrom('favourites');
	}

	ngOnInit() {}

	getFavouritesQuestionService(updatedData) {
		this.sharedService.showLoader();
		this.starredQuestionsService.getFavouritesList(updatedData).subscribe(result => {
			const status = this.contentService.validateResponse(result, {});
			this.sharedService.handleUnexpectedResponse(status);
			if (status === 'success') {
				this.favouritesQuestion = result;
				this.contentService.setTemplate(result);
				this.contentService.setBasicData(result);
				this.totalPagesCount = result.pageItemCount;
			}
			this.sharedService.hideLoader();
		});
	}

	generateOptionString(index) {
		return this.questionDisplayReformService.generateOptionString(index);
	}

	toggleExplanation(y, showOptions) {
		for (let i = 0; i < showOptions.length; i++) {
			if (i === y) {
				showOptions[i] = !showOptions[i];
			} else {
				showOptions[i] = false;
			}
		}
	}

	removeFromFavourites(removeFavouritesData) {
		this.starredQuestionsService.removeFromFavourites(removeFavouritesData).subscribe(result => {
			const status = this.contentService.validateResponse(result, {});
			this.sharedService.handleUnexpectedResponse(status);
			if (status === 'success') {
				const removedFavourites = _.get(result, 'resultData', null);
				if (removedFavourites !== null) {
					this.contentService.setFavouritesQuestionIndex(removedFavourites);
				}
			}
		});
	}

	ngOnDestroy() {
		this.favouritesQuestionIndexSubscription.unsubscribe();
		this.getTemplateService.unsubscribe();
		this.contentService.setMathJaxClear(true);
	}
}
