import { Component, OnChanges, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { SharedService } from '../../../shared.service';
import { ContentService } from '../../../services/content/content.service';
import { AppSettings } from '../../../../settings/app.settings';
import * as _ from 'lodash';

@Component({
  selector: 'ms-questions-header',
  templateUrl: './questions-header.component.html',
  styleUrls: ['./questions-header.component.scss']
})
export class QuestionsHeaderComponent implements OnChanges, OnDestroy {
  @Input('headerContent') headerContent: any;
  @Input('from') from: any;
  contentDetails: any;
  questionIcon: any;
  toDisplay: any;
  template: string;
  templateClass: string;
  isDisplay: boolean;
  errorInfo: any;
  private getTemplateService: Subscription;
  private getQuestionContentService: Subscription;
  constructor(private contentService: ContentService, private sharedService: SharedService, private router: Router) {
    this.questionIcon = AppSettings.QUESTIONS_ICON;
    this.getTemplateService = this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
      },
      responseError => this.errorInfo = responseError
    );
    this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(
      result => {
        this.contentDetails = result;
        this.toDisplay = _.get(result, 'from', ' ');
        this.headerContent = _.get(result, 'header', null);
        if (this.toDisplay === 'worksheet') {
          this.isDisplay = true;
        }
      }
    );
  }

  ngOnChanges(changes: any): void {
    const changeFrom = _.get(changes, 'from.currentValue', null);
    if (changeFrom !== undefined && changeFrom !== null) {
      this.from = changeFrom;
    }
  }

  ngOnDestroy() {
    this.getTemplateService.unsubscribe();
    this.getQuestionContentService.unsubscribe();
  }

  getContainerClassNames() {
    const mode: any = _.get(this.contentDetails, 'mode', '');
    let className = this.templateClass;
    if (this.toDisplay === 'games' || mode === 'revise') {
      className += ' games-header';
    }
    return className;
  }

  getIconClassName() {
    let className = '';
    const type = _.get(this.headerContent, 'pedagogyContentLeft.type', '').toLowerCase();
    const action = _.get(this.contentDetails, 'action', '').toLowerCase();
    if (type === 'activity') {
      className = 'icon-game';
    } else if (action !== '') {
      className = 'revision-' + action;
    }
    return className;
  }
}
