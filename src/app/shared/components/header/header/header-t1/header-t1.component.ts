import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../../../shared.service';
import { ContentService } from '../../../../services/content/content.service';
import { HeaderComponent } from '../header.component';
import * as _ from 'lodash';

@Component({
  selector: 'ms-header-t1',
  templateUrl: './header-t1.component.html',
  styleUrls: ['./header-t1.component.scss']
})
export class HeaderT1Component implements OnInit {
  rewardSummary: any;
  permittedNavs: any;
  @Input('notifications') notifications: any;

  constructor(private headerComponent: HeaderComponent, private sharedService: SharedService, private contentService: ContentService) { }

  ngOnInit() {
    this.contentService.getBasicData().subscribe(result => {
      this.permittedNavs = _.get(result, 'permittedNavs');
      this.rewardSummary = _.get(result, 'rewardSummary');
    });
  }
  logout() {
    this.sharedService.setReloadRestrict('blockReload');
    this.headerComponent.logout();

  }
}
