import { Component } from '@angular/core';
import { ContentService } from '../../../services/content/content.service';
import { SharedService } from '../../../shared.service';
import * as _ from 'lodash';

@Component({
  selector: 'ms-my-tabs',
  templateUrl: './my-tabs.component.html',
  styleUrls: ['./my-tabs.component.scss']
})
export class MyMindsparkTabsComponent {
  templateClass: string;
  permittedNavs: any;

  constructor(private contentService: ContentService, private sharedService: SharedService) {
    this.contentService.getBasicData().subscribe(result => {
      this.permittedNavs = _.get(result, 'permittedNavs', {});
    });
    this.contentService.getTemplate().subscribe(result => {
      this.templateClass = this.sharedService.getClassName();
    });
  }

}
