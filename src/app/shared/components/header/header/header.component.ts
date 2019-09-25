import { Component, Input, OnDestroy } from '@angular/core';
import { ContentService } from '../../../services/content/content.service';
import { HomeService } from '../../../../modules/home/home.service';
import { Subscription } from 'rxjs/Subscription';
import { SharedService } from '../../../shared.service';
import * as _ from 'lodash';

@Component({
  selector: 'ms-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {

  count: number;
  notificationsResult: any;
  notificationPermitted: any;
  permittedNavs: any;
  @Input('template') template;
  @Input('isDetailed') isDetailedView;
  @Input('isProfileVisible') isProfileVisible: any;
  @Input('formValue') formValue: any;

  dashboardData: any;
  errorInfo: any;
  getBasicDataService: Subscription;

  constructor(private contentService: ContentService, private homeService: HomeService, private sharedService: SharedService) {
    this.getBasicDataService = this.contentService.getBasicData().subscribe(
      result => {
        this.dashboardData = result;
        this.permittedNavs = result.permittedNavs;
        this.notificationPermitted = _.get(result, 'permittedNavs.notification', false);
      },
      responseError => this.errorInfo = responseError
    );
  }

  ngOnDestroy() {
    this.getBasicDataService.unsubscribe();
  }

  logout(type?: number) {
    type = (type) ? type : 0;
    this.homeService.logout(type);
  }

}
