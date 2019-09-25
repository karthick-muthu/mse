import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { AppSettings } from '../../../../settings/app.settings';
import { ContentService } from '../../../../shared/services/content/content.service';
import { SharedService } from '../../../../shared/shared.service';
import { TopicListService } from '../../services/topic-list.service';

@Component({
  selector: 'ms-topics-list',
  templateUrl: './topics-list.component.html',
  styleUrls: ['./topics-list.component.scss'],
  providers: [TopicListService]
})
export class TopicsListComponent implements OnInit {
  priorityContents: any;
  isRetail: boolean;
  gradeData: any;
  topicImageDefault: string = AppSettings.TOPIC_DEFAULT_IMAGE;
  higherGradeLoaded = false;
  topicTiles: any[];
  errorInfo: string;
  contentNames: any[] = [];
  grade: any;
  showHigherGrades: boolean;
  isClassVisible: boolean;
  dashboardData: any;
  higherGradeTopics: any;
  template: string;
  templateClass: string;
  selectedTheme: any;
  permittedNavs: any;


  @Input('for') for: string;
  @Input('topicList') topicList: any;
  @Input('isProfileVisible') isProfileVisible: any;

  constructor(private sharedService: SharedService, private contentService: ContentService, private service: TopicListService,
    private router: Router) {
    this.getTopicList();
    this.sharedService.setSiteTitle('Topics');
    this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
        this.sharedService.setBodyClass();
      },
      responseError => this.errorInfo = responseError
    );
    this.for = 'topics';
  }

  ngOnInit() {
  }
  check() {
    this.showHigherGrades = !this.showHigherGrades;
    if (this.showHigherGrades) {
      this.sharedService.showLoader();
      this.service.getHigherGrades().subscribe(
        topicsData => {
          const status = this.contentService.validateResponse(topicsData, {});
          this.sharedService.handleUnexpectedResponse(status);
          if (status === 'success') {
            this.higherGradeTopics = topicsData.topicList;
            this.addHigherGradesToTopic();
          }
          this.sharedService.hideLoader();
        },
        responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
      );
    }
  }
  addHigherGradesToTopic() {
    this.removeHigherGradeTopics();
    if (this.showHigherGrades) {
      this.topicList = this.topicList.concat(this.higherGradeTopics);
    }
  }

  removeHigherGradeTopics() {
    for (let index = 0; index < this.topicList.length; index++) {
      const tile = this.topicList[index];
      if (tile['grades']) {
        this.topicList.splice(index, 1);
      }
    }
  }
  getTopicList() {
    this.sharedService.showLoader();
    this.service.getTopicList().subscribe(
      result => {
        const status = this.contentService.validateResponse(result, {});
        this.sharedService.handleUnexpectedResponse(status);
        if (status === 'success') {
          this.gradeData = result;
          this.topicList = _.get(result, 'topicList', []);
          this.selectedTheme = _.get(result, 'userInformation.selectedTheme', '');
          this.isRetail = _.get(result, 'userInformation.isRetail', false);
          this.priorityContents = _.get(result, 'priorityContents', []);
          this.contentService.setTemplate(result);
          this.contentService.setBasicData(result);
          this.permittedNavs = _.get(result, 'permittedNavs', {});
        }
        this.sharedService.hideLoader();
      },
      error => this.errorInfo = this.sharedService.handleResponseError(error)
    );
  }
}
