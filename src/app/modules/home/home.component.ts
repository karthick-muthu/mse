import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { AppSettings } from '../../settings/app.settings';
import { ContentService } from '../../shared/services/content/content.service';
import { SharedService } from '../../shared/shared.service';
import { HomeService } from './home.service';

@Component({
  selector: 'ms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  permittedNavs: any;
  selectedTheme: string;
  getTemplateService: Subscription;
  templateClass: string;
  displayDetailedView = true;
  dashboardData: any;
  errorInfo: string;
  isProfileVisible = false;
  template: string;

  priorityContents: any;
  profileVisible: any;
  homeTileList: any[] = [];
  for: string;
  topicImageDefault: string = AppSettings.TOPIC_DEFAULT_IMAGE;

  constructor(private sharedService: SharedService, private contentService: ContentService, private homeService: HomeService,
    private router: Router) {
    this.sharedService.setSiteTitle('Home');
    this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.sharedService.setBodyClass();
        document.body.classList.add('home-page');
      },
      responseError => this.errorInfo = responseError
    );
    this.getTemplateService = this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
      },
      responseError => this.errorInfo = responseError
    );
    this.sharedService.getAndClearCookies();
  }

  ngOnInit() {
    this.for = 'home';
    this.getHomeDetails();
  }

  getHomeDetails() {
    this.sharedService.showLoader();
    this.homeService.getHomeDetails().subscribe(
      homeData => {
        const status = this.contentService.validateResponse(homeData, {});
        this.sharedService.handleUnexpectedResponse(status);
        if (status === 'success') {
          this.homeTileList = _.toArray(homeData.contentList);
          this.priorityContents = _.get(homeData, 'priorityContents', []);
          this.selectedTheme = _.get(homeData, 'userInformation.selectedTheme', '');
          this.permittedNavs = _.get(homeData, 'permittedNavs', '');
          this.contentService.setTemplate(homeData);
          this.contentService.setBasicData(homeData);
        }
        this.sharedService.hideLoader();
      },
      responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
    );
  }

  continueTopic() {

  }
  ngDestroy() {
    this.getTemplateService.unsubscribe();
  }
}
