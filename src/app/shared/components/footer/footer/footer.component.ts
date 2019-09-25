import { Component, OnInit, Input } from '@angular/core';
import { ContentService } from '../../../services/content/content.service';
import { AppSettings } from '../../../../settings/app.settings';

@Component({
  selector: 'ms-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input('template') template;
  @Input('sessionInformation') sessionInformation: any;
  errorInfo: any;

  constructor(private contentService: ContentService) { }

  ngOnInit() {
    this.contentService.getBasicData().subscribe(
      result => this.sessionInformation = result.sessionInformation,
      responseError => this.errorInfo = responseError
    );
  }

}
