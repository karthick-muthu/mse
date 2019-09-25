import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../../../settings/app.settings';
import { SessionReportModalComponent } from '../questions/session-report/session-report-modal/session-report-modal.component';
import { TopicListService } from '../../../modules/topics/services/topic-list.service';
import { SharedService } from '../../shared.service';
import { ContentService } from '../../services/content/content.service';
import { SlugifyPipe } from 'ngx-pipes';
import { SearchFilterPipe } from '../../../modules/topics/filters/search-filter.pipe';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ms-topics-tile',
  templateUrl: './topics-tile.component.html',
  styleUrls: ['./topics-tile.component.scss'],
  providers: [SlugifyPipe, TopicListService]
})
export class TopicsTileComponent implements OnInit {
  tileCalledFromSubscription: Subscription;
  tileCalledFrom: any;
  selecteTheme: any;
  lockedTopicOverlay: boolean;
  topicId: any;
  errorInfo: any;
  overlayButton: boolean;
  @Input('template') template: string;
  @Input('for') for: string;
  @Input('topicList') topicList = [];
  @Input('search') search: any;
  @Input('showHigherGrades') showHigherGrades: boolean;
  @Input('grade') grade: boolean;

  moreOptions: boolean[] = [];
  lockedMoreOptions: boolean[] = [];
  lockedTopicList: any;
  constructor(private router: Router, private topicListService: TopicListService, private slugifyPipe: SlugifyPipe,
    private sharedService: SharedService, private contentService: ContentService) {
    this.sharedService.getTopicId().subscribe(result => {
      this.topicId = result.topicId;
    });
    this.contentService.getBasicData().subscribe(result => {
      this.selecteTheme = _.get(result, 'userInformation.selectedTheme', '');
    });
    this.tileCalledFromSubscription = this.contentService.getTileCalledFrom().subscribe(result => {
      this.tileCalledFrom = result.from;
    });
  }

  ngOnInit() {
    this.overlayButton = false;
    if (this.topicList) {
      this.addMoreOptions(this.topicList);
    }
  }
  showOverlay(contentID, index) {
    this.moreOptions[index] = !this.moreOptions[index];
    if (this.topicList.length > 0 && contentID === this.topicList[index].contentID) {
      this.overlayButton = true;
      return this.overlayButton;
    }
  }

  triggerOverlayForLockedTopics(topic, index) {
    this.lockedMoreOptions[index] = !this.lockedMoreOptions[index];
    const contentId = _.get(topic, 'contentID', '');
    if (this.topicList.length > 0 && contentId === this.topicList[index].contentID) {
      return this.lockedMoreOptions[index];
    }
  }

  goToDetailsPage(topic) {
    const topicID = _.get(topic, 'contentID', '');
    this.contentService.setTopicId(topicID);
    this.router.navigate(['/topics/detail']);
  }
  addMoreOptions(topicsList) {
    if (topicsList) {
      this.topicList = topicsList;
      for (let i = 0; i < topicsList.length; i++) {
        this.moreOptions.push(false);
      }
      return this.moreOptions;
    }
  }

  addMoreLockedOptions(topicsList) {
    if (topicsList) {
      this.lockedTopicList = topicsList;
      for (let i = 0; i < topicsList.length; i++) {
        this.lockedMoreOptions.push(false);
      }
      return this.lockedMoreOptions;
    }
  }

  startTopic(topic, button) {
    const contentStatus: any = _.get(topic, 'contentStatus', '');
    let hasPrimaryReportButton: any = _.get(topic, 'buttons[0].type', '');
    let hasPrimaryReviseButton: any = _.get(topic, 'buttons[0].type', '');
    hasPrimaryReportButton = hasPrimaryReportButton.toLowerCase() === 'report' ? true : false;
    hasPrimaryReviseButton = hasPrimaryReviseButton.toLowerCase() === 'revise' ? true : false;
    if ((contentStatus !== '' && contentStatus.toLowerCase() === 'active' && !hasPrimaryReportButton) ||
      (contentStatus.toLowerCase() === 'deactive' && (this.tileCalledFrom === 'topicDetails' || hasPrimaryReviseButton))
    ) {
      this.sharedService.showLoader();
      const data: any = {
        'topicID': topic.contentID,
        'mode': button.type,
        'action': button.state
      };
      this.topicListService.startTopic(data).subscribe(
        result => {
          const status = this.contentService.validateResponse(result, data);
          this.sharedService.handleUnexpectedResponse(status);
          if (status === 'redirect') {
            data.from = 'topic';
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
        },
        responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
      );
    } else if (contentStatus === 'deactive' || hasPrimaryReportButton) {
      if (this.selecteTheme.toLowerCase() === 'highergrade') {
        this.goToDetailsPage(topic);
      } else if (this.selecteTheme.toLowerCase() === 'lowergrade') {
        this.openTopicTrails(topic.contentID);
      }
    }
  }
  setTopicsClearedProgress(progressValue) {
    return ((progressValue.conceptCleared / progressValue.conceptOverall) * 100);

  }
  getTopicProgress(cleared, overall) {
    const progress: number = (cleared / overall) * 100;
    return progress;
  }

  openTopicTrails(topicId) {
    const data: any = {
      'startFrom': 1,
      'limit': 20,
      'topicId': topicId,
      'index': 1
    };
    this.sharedService.setTopicTrailData(data);
    this.router.navigate(['topics/trails']);
  }

  ngDestroy() {
    this.tileCalledFromSubscription.unsubscribe();
  }
}
