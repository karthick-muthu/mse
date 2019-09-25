import { Component, OnInit, OnChanges, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { QuestionsComponent } from '../questions.component';
import { QuestionsStructureComponent } from '../questions-structure/questions-structure.component'
import { CommentModalComponent } from '../../comments/comment-modal/comment-modal.component';
import { SharedService } from '../../../shared.service';
import { ContentService } from '../../../services/content/content.service';
import { SessionReportService } from '../session-report/services/session-report/session-report-service.service';
import * as _ from 'lodash';

@Component({
  selector: 'ms-question-sidebar-btn',
  templateUrl: './question-sidebar-btn.component.html',
  styleUrls: ['./question-sidebar-btn.component.scss']
})
export class QuestionSidebarBtnComponent implements OnChanges, OnDestroy {
  @Input('audio') audio: any;
  @Input('evaluationResult') result: any = {};
  @Input('question') question: any;
  pedagogyType: any;
  pedagogyStatus: any;
  template: any;
  questionTemplate: string;
  templateClass: any;
  endTimer: any;
  remainingTime: any;
  isFavourite = false;
  disableNext: boolean;
  disableSubmit: boolean;
  activateNext: boolean;
  from: any;
  from1: any;
  startTimer: any;
  totalTime: any;
  hasTranslation: boolean;
  errorInfo: any;
  questionData: any;
  private questionContent: any;
  private templateService: Subscription;
  private activateNextService: Subscription;
  private getQuestionContentService: Subscription;
  private getQuestionDataService: Subscription;
  private getTimerValueService: Subscription;
  private getQuestionSubmitService: Subscription;
  private getNextQuestionSequenceService: Subscription;
  //private getWorksheetButtonService: Subscription;

  constructor(private questionsStructureComponent: QuestionsStructureComponent, private sharedService: SharedService, private contentService: ContentService,
    private sessionReportService: SessionReportService, private questionsComponent: QuestionsComponent) {
    this.isFavourite = false;
    this.templateService = this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
      },
      responseError => this.errorInfo = responseError
    );
    this.activateNextService = this.contentService.getActivateNext().subscribe(
      result => {
        this.activateNext = result.next;
      },
      responseError => this.errorInfo = responseError
    );
    this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(
      result => {
        this.questionContent = result;
        this.isFavourite = _.get(result, 'isFavourite', false);
        this.questionTemplate = _.get(result, 'templateContent', '').toLowerCase();
        this.from = _.get(result, 'from', '').toLowerCase();
        this.hasTranslation = _.get(result, 'hasTranslation', false);
      },
      responseError => this.errorInfo = responseError
    );
    this.getQuestionDataService = this.contentService.getQuestionData().subscribe(
      result => {
        //this.from = _.get(result, 'from', '').toLowerCase();
        this.remainingTime = _.get(result, 'remainingTime', '');
        this.pedagogyStatus = _.get(result, 'pedagogyStatus', '');
        this.questionData = _.get(result, 'questionData', []);
      }
    );
    this.getTimerValueService = this.contentService.getTimerValue().subscribe(
      result => {
        this.startTimer = _.get(result, 'worksheetValue', '');
        this.endTimer = _.get(result, 'endTimer', '');
        if (this.startTimer) {
          if (this.endTimer <= 0) {
            this.startTimer = false;
          }
        }
      }
    );
    this.getQuestionSubmitService = this.contentService.getQuestionSubmit().subscribe(
      result => {
        if (!result.submit) {
          this.disableSubmit = false;
        }
      }
    );
    this.contentService.getHeaderContent().subscribe(result => {
      this.pedagogyType = result.pedagogyType;
    });
    // this.getWorksheetButtonService = this.contentService.getWorksheetNextButtonValue().subscribe(
    //   result => {
    //     console.log(result);
    //   }
    // )
  }

  ngOnChanges(changes: any): void {
    const changeEvaluationResult = _.get(changes, 'result.currentValue', '');
    const changeQuestion = _.get(changes, 'question.currentValue', null);
    if (changeQuestion !== undefined && changeQuestion !== null) {
      this.question = changeQuestion;
      this.disableNext = false;
      this.disableSubmit = false;
    }
    if (changeEvaluationResult !== null && changeEvaluationResult !== undefined) {
      this.result = changeEvaluationResult;
    }
  }

  ngOnDestroy(): void {
    this.templateService.unsubscribe();
    this.activateNextService.unsubscribe();
    this.getQuestionContentService.unsubscribe();
    this.getQuestionDataService.unsubscribe();
    this.getTimerValueService.unsubscribe();
    this.getQuestionSubmitService.unsubscribe();
    if (this.getNextQuestionSequenceService) this.getNextQuestionSequenceService.unsubscribe();
  }

  commentActive() {
    setTimeout(() => {
      this.sharedService.open(CommentModalComponent);
    }, 200);
  }

  addToFavourities() {
    if (!this.isFavourite) {
      this.questionsComponent.addToFavourities();
      this.setAsFavourite();
    }
  }
  setAsFavourite() {
    this.isFavourite = !this.isFavourite;
    this.questionContent.isFavourite = this.isFavourite;
    this.contentService.setQuestionContent(this.questionContent);
  }

  loadNext() {
    this.disableNext = true;
    this.questionsComponent.updateAnswer();
    this.questionsStructureComponent.pauseAudio();
  }

  showSubmitButton() {
    let questionTemplate: string, sequenceNo, autoSubmit = false;
    if (this.questionTemplate === 'timedtest') {
      autoSubmit = _.get(this.question, 'autoSubmit', false);
      sequenceNo = _.get(this.question, 'timedTestData.questionSequenceNo', null);
      questionTemplate = _.get(this.question, 'questions[' + sequenceNo + '].template', '').toLowerCase();
    } else {
      questionTemplate = this.questionTemplate;
    }
    if ((this.questionsComponent.oneOfFormTemplates(questionTemplate) || questionTemplate === 'interactive') && !autoSubmit && this.from !== 'worksheet') {
      return true;
    }
    return false;
  }

  submitFormAnswer() {
    if (this.from == 'worksheet') {
      this.disableSubmit = false;
      let unitSequenceNo;
      this.getNextQuestionSequenceService = this.contentService.getNextWorksheetSequence().subscribe(result => {
        unitSequenceNo = _.get(result, 'sequence', 1);
      });
      this.contentService.setNextWorksheetSequence(unitSequenceNo);
      this.contentService.setFromWorksheet('next');
      this.contentService.setQuestionSubmit(true);
    } else {
      this.disableSubmit = true;
      this.contentService.setQuestionSubmit(true);
    }
  }

  skipContent() {
    this.submitFormAnswer();
  }

  confirmQuitWorksheet() {
    let unitSequenceNo;
    this.getNextQuestionSequenceService = this.contentService.getNextWorksheetSequence().subscribe(result => {
      unitSequenceNo = _.get(result, 'sequence', 1);
    });
    this.contentService.setNextWorksheetSequence(unitSequenceNo - 1);
    this.contentService.setFromWorksheet('submit');
    this.contentService.setQuestionSubmit(true);
    this.contentService.setConfirmQuitWorksheet(true);
  }

  displayQuitWorksheetButton() {
    let quitWorksheet = false, i = 0;
    _.forEach(this.questionData, function (value) {
      if (value['unitStatus'] === 'completed') {
        i++;
      }
    });
    if (i === this.questionData.length) {
      quitWorksheet = true;
    }
    if (quitWorksheet && this.from == 'worksheet') {
      return true;
    }
    return false;
  }

}
