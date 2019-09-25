import { Component, OnDestroy } from '@angular/core';
import { ContentService } from '../../../services/content/content.service';
import * as _ from 'lodash';
import { QuestionsComponent } from '../questions.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ms-question-timer',
  templateUrl: './question-timer.component.html',
  styleUrls: ['./question-timer.component.scss']
})
export class QuestionTimerComponent implements OnDestroy {

  timed: any;
  from: any;
  endTimer: any;
  expireTimer: boolean;
  warningTime: number;
  totalTime: any;
  widthValue: any;
  remainingTime: any;
  clear: any;
  startWorksheet: any;
  decreaseWidthValue: any;
  pauseTimer: any;
  private questionContent: any;
  private getTimerValueService: Subscription;
  private getQuestionContentService: Subscription;
  private getExpireWorksheetTimeService: Subscription;
  private getQuestionDataService: Subscription;
  private getWorksheetPauseTimerService: Subscription;

  constructor(private contentService: ContentService, private questionsComponent: QuestionsComponent) {
    this.getQuestionDataService = this.contentService.getQuestionData().subscribe(
      result => {
        this.remainingTime = _.get(result, 'remainingTime', '');
        this.totalTime = _.get(result, 'totalTime', '');
        this.timed = _.get(result, 'timed', '');
      }
    );
    this.getTimerValueService = this.contentService.getTimerValue().subscribe(
      result => {
        this.startWorksheet = _.get(result, 'worksheetValue', false);
        this.endTimer = _.get(result, 'endTimer', null);
        this.widthValue = 100;
        this.warningTime = (10 * this.totalTime) / 100;
        if (this.startWorksheet) {
          this.clearTimer();
          if (this.pauseTimer == false) {
            this.timeOut();
          }
        }
      }
    );
    this.getExpireWorksheetTimeService = this.contentService.getExpireWorksheetTime().subscribe(
      result => this.expireTimer = _.get(result, 'expired', false)
    );
    this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(
      result => {
        this.questionContent = result;
        this.from = _.get(result, 'from', '');
      }
    );
    this.getWorksheetPauseTimerService = this.contentService.getWorksheetPauseTimer().subscribe(
      result => {
        this.pauseTimer = result.pauseTimer;
        if (this.pauseTimer === true) {
          clearInterval(this.clear);
        } else {
          this.timeOut();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.getTimerValueService.unsubscribe();
    this.getQuestionDataService.unsubscribe();
    this.getExpireWorksheetTimeService.unsubscribe();
    this.getQuestionContentService.unsubscribe();
    this.getWorksheetPauseTimerService.unsubscribe();
    this.clearTimer();
  }

  timeOut() {
    this.clear = setInterval(() => {
      if (this.remainingTime > 0) {
        if (this.startWorksheet) {
          let data: any = {
            worksheetValue: this.startWorksheet,
            remainingTime: this.remainingTime--
          };
          this.decreaseWidthValue = (this.widthValue * this.remainingTime) / this.totalTime;
          if (this.expireTimer) {
            data = {};
            clearInterval(this.clear);
          }
          this.contentService.setTimerValue(data);
          if (this.remainingTime === 0) {
            clearInterval(this.clear);
          }
        } else {
          this.decreaseWidthValue = 100;
        }
      }
    }, 1000);
  }

  clearTimer() {
    if (this.clear) {
      clearInterval(this.clear);
    }
  }
}
