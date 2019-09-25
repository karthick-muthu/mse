import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ContentService } from '../../../../shared/services/content/content.service';
import { SharedService } from '../../../../shared/shared.service';
import { GamesService } from '../../games.service';

@Component({
  selector: 'ms-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit {

  showText: string;
  attemptedActivityList: any[];
  unattemptedActivityList: any[];
  lockedActivityList: any[];
  gameList: { list: any; type: string; text: any; status: boolean; }[];
  gameStatus: string;
  activityTypes: string[];
  templateClass: string;
  priorityContents: any;
  settings: any;
  activityList: any;
  template: string;
  errorInfo: any;

  constructor(private sharedService: SharedService, private contentService: ContentService, private gameService: GamesService) {
    this.contentService.getTemplate().subscribe(
      result => {
        this.templateClass = this.sharedService.getClassName();
        this.template = this.contentService.getTemplateId(result);
      },
      responseError => this.errorInfo = responseError
    );
  }

  ngOnInit() {
    this.getActivityList();
  }

  getActivityList() {
    this.sharedService.showLoader();
    this.gameService.getListActivity().subscribe(activityListResult => {
      const status = this.contentService.validateResponse(activityListResult, {});
      this.sharedService.handleUnexpectedResponse(status);
      if (status === 'success') {
        this.activityList = _.get(activityListResult, 'activityList', {});
        this.activityTypes = Object.keys(this.activityList);
        this.settings = _.get(activityListResult, 'settings', {});
        this.priorityContents = _.get(activityListResult, 'priorityContents', {});
        this.contentService.setTemplate(activityListResult);
        this.contentService.setBasicData(activityListResult);
        this.formGameList();
      }
      this.sharedService.hideLoader();
    });
  }
  formGameList(): any {

    this.showText = 'show more';
    this.attemptedActivityList = _.get(this.activityList, 'attempted', []);
    this.unattemptedActivityList = _.get(this.activityList, 'unattempted', []);
    this.lockedActivityList = _.get(this.activityList, 'locked', []);
    this.gameList = [
      { list: this.unattemptedActivityList, type: 'unattempted', text: this.showText, status: false },
      { list: this.attemptedActivityList, type: 'attempted', text: this.showText, status: false },
      { list: this.lockedActivityList, type: 'locked', text: this.showText, status: false }
    ];
  }

  getActivityType(type) {
    switch (type) {
      case 'attempted':
        this.gameStatus = 'played';
        break;
      case 'locked':
        this.gameStatus = 'locked';
        break;
      default:
        this.gameStatus = 'latest';
        break;
    }
    return type;
  }
  toggleShowMoreGames(activityType, index) {

    this.gameList[index].status = !this.gameList[index].status;

    if (this.gameList[index].status) {
      this.gameList[index].text = 'show less';
    } else {
      this.gameList[index].text = 'show more';
    }
  }
}
