import { Component, OnInit, OnChanges, Input, Inject, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { SharedService } from '../../../../../shared.service';
import { ContentService } from '../../../../../services/content/content.service';
import { AppSettings } from '../../../../../../settings/app.settings';
import * as _ from 'lodash';

@Component({
  selector: 'ms-question-concept',
  templateUrl: './question-concept.component.html',
  styleUrls: ['./question-concept.component.scss']
})
export class QuestionConceptComponent implements OnInit, OnChanges {
  @ViewChild('pedagogyConceptDropDown') pedagogyConceptDropDown: any;
  @Input('pedagogyContent') pedagogyContent: any;
  template: string;
  templateClass: string;
  questionIcon: any;
  errorInfo: any;
  borderStyle: any = { 'border-top-width': '0', 'border-bottom-width': '0' };
  fluidHeight: any = { 'height': '0' };

  constructor(private sharedService: SharedService, private contentService: ContentService, @Inject(DOCUMENT) private document: Document) {
    this.questionIcon = AppSettings.QUESTIONS_ICON;
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
    const changeValue = _.get(changes, 'pedagogyContent.currentValue', null);
    if (changeValue !== undefined && changeValue !== null) {
      this.pedagogyContent = changeValue;
      this.calculateHeaderHeight();
    }
  }

  calculateHeaderHeight() {
    let questionHeader, height, width, borderheight, conceptList;
    setTimeout(() => {
      questionHeader = document.getElementById('questionHeader');
      if (questionHeader) {
        height = questionHeader.offsetHeight;
        width = questionHeader.offsetWidth;
        if (width > 575) {
          borderheight = (!isNaN(height)) ? (height / 2) : height;
          this.borderStyle = { 'border-top-width': borderheight + 'px', 'border-bottom-width': borderheight + 'px' };
          this.fluidHeight = { 'height': height + 'px' };
        } else {
          height = height / 2;
          this.borderStyle = {};
          this.fluidHeight = { 'height': height + 'px' };
        }
        if (height > 80) {
          conceptList = document.querySelector('.concepts-list');
          if (conceptList) {
            conceptList.classList.add('align-dropdown');
          }
        }
      } else {
        setTimeout(() => { this.calculateHeaderHeight(); }, 80);
      }
    }, 20);
  }

}
