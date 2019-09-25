import { Component, OnDestroy, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContentService } from '../../../services/content/content.service';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

@Component({
  selector: 'ms-worsheet-modal',
  templateUrl: './worsheet-modal.component.html',
  styleUrls: ['./worsheet-modal.component.scss']
})
export class WorsheetModalComponent implements OnDestroy {
  showTimer: any;
  worksheetName: any;
  remainingTime: any;
  totalTime: any;
  endTimer: any;
  totalQuestions: number;
  startWorksheetValue: any;
  contentType: string;
  private questionData: any;
  private questionContent: any;
  private getTimerValueService: Subscription;
  private getQuestionService: Subscription;
  private getQuestionContentService: Subscription;

  constructor(public activeModal: NgbActiveModal, private contentService: ContentService) {
    this.startWorksheetValue = false;
    this.getTimerValueService = this.contentService.getTimerValue().subscribe(
      result => {
        this.startWorksheetValue = _.get(result, 'worksheetValue', false);
        this.endTimer = _.get(result, 'endTimer', null);
      }
    );
    this.getQuestionService = this.contentService.getQuestionData().subscribe(
      result => {
        this.questionData = result;
        this.remainingTime = _.get(result, 'remainingTime', '');
        this.totalTime = _.get(result, 'totalTime', '');
        this.worksheetName = _.get(result, 'name', '');
        this.showTimer = _.get(result, 'timed', '');
      }
    );
    this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(
      result => {
        let from: string, templateContent: string;
        this.questionContent = result;
        from = _.get(result, 'from', '').toLowerCase();
        templateContent = _.get(result, 'templateContent', '').toLowerCase();
        this.contentType = (from === 'worksheet') ? from : templateContent;
        this.setTotalQuestions(from);
      }
    );
  }

  ngOnDestroy() {
    this.getTimerValueService.unsubscribe();
    this.getQuestionService.unsubscribe();
    this.getQuestionContentService.unsubscribe();
  }

  startWorksheet() {
    this.startWorksheetValue = true;
    const data = {
      worksheetValue: this.startWorksheetValue,
      remainingTime: this.remainingTime
    };
    this.contentService.setTimerValue(data);
    this.contentService.setMessageClose(true);
    this.contentService.setRestartTimer(true);
    this.closeWorksheet();
  }

  closeWorksheet() {
    // this.startWorksheetValue = false;
    this.activeModal.dismiss();
  }

  setTotalQuestions(from: string) {
    this.totalQuestions = null;
    if (typeof (this.questionData) !== 'undefined' && typeof (this.questionContent) !== 'undefined') {
      if (from === 'worksheet') {
        this.totalQuestions = _.get(this.questionData, 'questionData.length', null);
      } else {
        this.totalQuestions = _.get(this.questionContent, 'timedTestData.totalQuestions', null);
      }
    } else {
      setTimeout(() => { this.setTotalQuestions(from); }, 200);
    }
  }

}
