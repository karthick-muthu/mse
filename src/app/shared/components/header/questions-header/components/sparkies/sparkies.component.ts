import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { SharedService } from '../../../../../shared.service';
import { ContentService } from '../../../../../services/content/content.service';
import * as _ from 'lodash';

@Component({
  selector: 'ms-sparkies',
  templateUrl: './sparkies.component.html',
  styleUrls: ['./sparkies.component.scss']
})
export class SparkiesComponent implements OnInit, OnChanges {
  @Input('pedagogySparkie') pedagogySparkie;
  template: string;
  templateClass: string;
  errorInfo: any;

  constructor(private sharedService: SharedService, private contentService: ContentService) {
    this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
      },
      responseError => this.errorInfo = responseError
    );
  }

  ngOnInit() {
  }

  ngOnChanges(changes: any): void {
    const changeValue = _.get(changes, 'pedagogySparkie.currentValue', null);
    if (changeValue !== undefined && changeValue !== null) {
      this.pedagogySparkie = changeValue;
    }
  }
}
