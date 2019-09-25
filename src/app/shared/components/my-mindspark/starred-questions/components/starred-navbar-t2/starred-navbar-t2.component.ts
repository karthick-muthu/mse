import { Component, OnInit, OnChanges, Input, Output, ViewChild, OnDestroy } from '@angular/core';
import { AppSettings } from '../../../../../../settings/app.settings';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';
import { StarredQuestionsComponent } from '../../../../../../modules/my-mindspark/components/starred-questions/starred-questions.component';
import { ContentService } from '../../../../../services/content/content.service';

@Component({
  selector: 'ms-starred-navbar-t2',
  templateUrl: './starred-navbar-t2.component.html',
  styleUrls: ['./starred-navbar-t2.component.scss']
})
export class StarredNavbarT2Component implements OnInit, OnChanges, OnDestroy {
  private favouritesQuestionIndexSubscription: Subscription;
  @Input('favouritesQuestion') favouritesQuestion: any;
  @ViewChild('selectedTopic') selectedTopic: any;
  pageItemCount: any;
  totalPages: any;
  page: any;
  currentFavoriteIndex: any;
  topicList: any[];
  appSettings: any = AppSettings;
  maxPageSize: any;
  topicID: any;


  constructor(private starredQuestionsComponent: StarredQuestionsComponent, private contentService: ContentService) {
    this.maxPageSize = this.appSettings.PAGINATION_MAX_SIZE;
    this.favouritesQuestionIndexSubscription = this.contentService.getFavouritesQuestionIndex()
      .subscribe(result => {
        this.currentFavoriteIndex = result;
      });
  }

  ngOnInit() {
  }
  ngOnChanges(changes: any): void {
    const changesValue = _.get(changes, 'favouritesQuestion.currentValue', {});
    if (changesValue !== null && changesValue !== undefined) {
      this.favouritesQuestion = changesValue;
      this.topicList = _.get(this.favouritesQuestion, 'topicList', []);
      this.page = _.get(this.favouritesQuestion, 'currentPage', 1);
      this.totalPages = _.get(this.favouritesQuestion, 'totalPages', null);
      this.pageItemCount = _.get(this.favouritesQuestion, 'pageItemCount', null);
      for (let i = 0; i < this.topicList.length; i++) {
        if (this.topicList[i].selected === true) {
          this.topicID = this.topicList[i].topicID;
        }
      }
    }
  }

  ngOnDestroy() {
    this.favouritesQuestionIndexSubscription.unsubscribe();
  }

  loadPage(navigatedPage) {
    if (navigatedPage !== undefined) {
      this.page = navigatedPage;
    }
    if (this.topicID && navigatedPage) {
      const data = {
        'startFrom': ((this.page - 1) * this.pageItemCount) + 1,
        'limit': this.pageItemCount,
        'topicID': this.topicID
      };
      this.contentService.setFavouritesQuestionIndex(data);
    }
  }

  selectTopicId() {
    this.topicID = this.selectedTopic.nativeElement.value;
    const updatedValue = {
      'startFrom': 1,
      'limit': this.pageItemCount,
      'topicID': this.topicID
    };
    this.contentService.setFavouritesQuestionIndex(updatedValue);
  }

}
