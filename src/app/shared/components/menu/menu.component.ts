import { Component, Input, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { SharedService } from '../../shared.service';
import { ContentService } from '../../services/content/content.service';

@Component({
  selector: 'ms-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  template: string;
  menuList: any;
  errorInfo: any;

  constructor(private contentService: ContentService, private sharedService: SharedService) {
    this.contentService.getBasicData().subscribe(
      result => this.menuList = result.permittedNavs,
      responseError => this.errorInfo = responseError
    );
    this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
      }
    );
  }

}
