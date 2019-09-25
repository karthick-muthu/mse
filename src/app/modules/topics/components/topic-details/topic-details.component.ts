import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { AppSettings } from '../../../../settings/app.settings';
import { GameTileComponent } from '../../../../shared/components/game-tile/game-tile.component';
// tslint:disable-next-line:max-line-length
import { SessionReportService } from '../../../../shared/components/questions/session-report/services/session-report/session-report-service.service';
import { TopicsTileComponent } from '../../../../shared/components/topics-tile/topics-tile.component';
import { ContentService } from '../../../../shared/services/content/content.service';
import { SharedService } from '../../../../shared/shared.service';
import { TopicListService } from '../../services/topic-list.service';

@Component({
  selector: 'ms-topic-details',
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.scss'],
  providers: [GameTileComponent, TopicsTileComponent]
})
export class TopicDetailsComponent implements OnDestroy {
  topicMetrics: any;
  contentDetails: any;
  topicData: any;
  unitList: any;
  higherDetailsList: any;
  from: string;
  topicDetails: any;
  topicId: any;
  template: string;
  errorInfo: any;
  topicTileDetails: any;
  private getTopicDetailsSubscription: Subscription;

  constructor(private sharedService: SharedService, private contentService: ContentService, private topicDetailsService: TopicListService,
    private router: Router, private sessionReportService: SessionReportService, private topicsTileComponent: TopicsTileComponent,
    private gameTileComponent: GameTileComponent) {
    this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
      },
      responseError => this.errorInfo = responseError
    );
    this.getTopicDetailsSubscription = this.contentService.getTopicId().subscribe(
      result => {
        this.topicId = result.topicId;
        this.getTopicDetailsService(this.topicId);
      }
    );
    this.sharedService.setSiteTitle('Topic Details');
    this.contentService.setTileCalledFrom('topicDetails');
    this.from = 'topicDetails';
  }

  getTopicDetailsService(topicId) {

    const data = {
      'topicID': topicId
    };
    const setTopicIdValue = {
      'topicId': topicId
    };
    this.sharedService.setTopicId(setTopicIdValue);
    this.sharedService.showLoader();
    this.topicDetailsService.getTopicDetails(data).subscribe(
      result => {
        this.topicDetails = result;
        this.topicMetrics = _.get(this.topicDetails, 'topicMetrics', null);
        this.contentDetails = _.get(this.topicDetails, 'contentDetails', []);
        this.topicTileDetails = (this.contentDetails !== []) ? [this.contentDetails] : [];
        this.topicData = _.get(this.topicDetails, 'topicData', null);
        this.unitList = _.get(this.topicDetails, 'topicData.unitList', []);
        this.higherDetailsList = _.get(this.topicDetails, 'topicData.higherLevelUnitList', []);
        this.contentService.setBasicData(result);
        this.sharedService.hideLoader();
      },
      responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
    );
  }

  openTopicTrails() {
    const data: any = {
      'startFrom': 1,
      'limit': 20,
      'topicId': this.topicId,
      'index': 1
    };
    this.sharedService.setTopicTrailData(data);
    this.router.navigate(['topics/trails']);
  }

  startTopic() {
    const topicStatus = _.get(this.topicData, 'topicStatus', 'completed');
    const button = {
      state: (topicStatus === 'completed') ? 'redo' : 'continue',
      type: 'learn'
    };
    const topic = {
      contentID: this.topicId
    };
    this.topicsTileComponent.startTopic(this.contentDetails, button);
  }

  startHigherLevel() {
    this.sharedService.showLoader();
    const data: any = {
      topicID: this.topicId
    };
    this.sessionReportService.startTopicHigherLevel(data).subscribe(
      result => {
        data.from = 'topic';
        this.contentService.setQuestionContent(data);
        const redirectionCode = _.get(result, 'redirectionCode', '').toLowerCase();
        if (redirectionCode === 'contentpage') {
          this.contentService.contentPageRedirect(result);
        } else {
          this.sharedService.hideLoader();
        }
      },
      responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
    );
  }

  openActivity(unitID) {
    this.gameTileComponent.openActivity(unitID);
  }

  openFavourites() {
    const data = {
      topicID: this.topicId
    };
    this.contentService.setFavouritesQuestionIndex(data);
    this.router.navigate([AppSettings.REDIRECT_CODE.starredquestions]);
  }

  ngOnDestroy() {
    this.getTopicDetailsSubscription.unsubscribe();
  }
}

