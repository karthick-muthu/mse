import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../../../shared.service';
import { ContentService } from '../../../services/content/content.service';
import { AppSettings } from '../../../../settings/app.settings';

@Component({
  selector: 'ms-questions-footer',
  templateUrl: './questions-footer.component.html',
  styleUrls: ['./questions-footer.component.scss']
})
export class QuestionsFooterComponent implements OnInit {
  appSettings: any;
  sessionInformation: any;
  template: any;
  templateClass: string;
  errorInfo: any;

  constructor(private sharedService: SharedService, private contentService: ContentService) {
    this.appSettings = AppSettings;
    this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
      },
      responseError => this.errorInfo = responseError
    );
  }

  ngOnInit() {
    this.contentService.getBasicData().subscribe(
      result => this.sessionInformation = result.sessionInformation,
      responseError => this.errorInfo = responseError
    );
  }

}
