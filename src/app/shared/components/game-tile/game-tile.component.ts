import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import { GamesService } from '../../../modules/games/games.service';
import { ContentService } from '../../services/content/content.service';
import { SharedService } from '../../shared.service';
import { SessionReportModalComponent } from '../questions/session-report/session-report-modal/session-report-modal.component';

@Component({
  selector: 'ms-game-tile',
  templateUrl: './game-tile.component.html',
  styleUrls: ['./game-tile.component.scss']
})
export class GameTileComponent implements OnInit {
  showOverlay: boolean[] = [];
  errorInfo: any;
  activityListArray: any;
  type: string;
  topicImageDefault: any;
  @Input('activityList') activityList: any;
  @Input('activityType') activityType: any;

  constructor(private gameService: GamesService, private contentService: ContentService, private sharedService: SharedService) { }

  ngOnInit() {
    this.topicImageDefault = '';
    if (this.activityList) {
      this.activityListArray = _.toArray(this.activityList);
      if (this.activityType === 'locked') {
        for (let i = 0; i < this.activityListArray.length; i++) {
          this.showOverlay.push(false);
        }
      }
    }
  }
  openActivityListing(contentID) {
    if (this.activityType.toLowerCase() === 'locked') {
      for (let i = 0; i < this.activityListArray.length; i++) {
        if (contentID === this.activityListArray[i].contentID) {
          this.showOverlay[i] = !this.showOverlay[i];
        }
      }
    } else { this.openActivity(contentID); }

  }
  openActivity(contentID) {
    const data: any = {
      activityID: contentID
    };
    this.sharedService.showLoader();
    this.gameService.openActivity(data).subscribe(result => {
      const status = this.contentService.validateResponse(result, data);
      this.sharedService.handleUnexpectedResponse(status);
      if (status === 'redirect') {
        data.from = 'games';
        data.topicID = contentID;
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
      responseError => this.errorInfo = this.sharedService.handleResponseError(responseError));
  }
}
