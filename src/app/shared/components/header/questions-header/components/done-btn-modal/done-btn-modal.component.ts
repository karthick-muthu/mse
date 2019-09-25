import { Component, Input, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { AppSettings } from '../../../../../../settings/app.settings';
import { ContentService } from '../../../../../services/content/content.service';
import { SharedService } from '../../../../../shared.service';
import { ProgressModalComponent } from '../../../../questions/progress-modal/progress-modal.component';
import { QuestionsComponent } from '../../../../questions/questions.component';

@Component({
  selector: 'ms-done-btn-modal',
  templateUrl: './done-btn-modal.component.html',
  styleUrls: ['./done-btn-modal.component.scss']
})
export class DoneBtnModalComponent implements OnChanges, OnDestroy {
  @Input('pedagogyContentMode') pedagogyContentMode: any;
  @Input('pedagogyHigherLevel') pedagogyHigherLevel: any;
  @ViewChild('quitHigherLevel') quitHigherLevel;
  @ViewChild('messagesModal') messagesModal;
  @ViewChild('quitTimedModal') quitTimedModal;
  @ViewChild('quitTimedtestModal') quitTimedtestModal;
  @ViewChild('timeoutWorksheetModal') timeoutWorksheetModal;
  @ViewChild('confirmQuitWorksheetModal') confirmQuitWorksheetModal;
  @ViewChild('quitRevisionModal') quitRevisionModal;
  @ViewChild('scoreSheetModal') scoreSheetModal;

  closeResult: string;
  pedagogyMessages: any;
  message: any;
  template: string;
  templateClass: string;
  errorInfo: any;
  from: any;
  questionData: any;
  scoreDetails: any;

  private questionContent: any;
  private expireTimer: boolean;
  private userInfo: any;
  private scoreSheet: any;
  private getTemplateService: Subscription;
  private getMessagesService: Subscription;
  private getBasicDataService: Subscription;
  private getQuestionContentService: Subscription;
  private getQuestionDataService: Subscription;
  private getScoreSheetService: Subscription;
  private getTimerValueService: Subscription;
  private getExpireWorksheetTimeService: Subscription;
  private getConfirmQuitWorksheetService: Subscription;
  private getOpenTransitionService: Subscription;
  private getWorksheetTimeoutModalService: Subscription;

  constructor(private router: Router, private sharedService: SharedService, private contentService: ContentService,
    private questionsComponent: QuestionsComponent, private modalService: NgbModal) {
    this.getTemplateService = this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
      },
      responseError => this.errorInfo = responseError
    );
    this.getMessagesService = this.contentService.getMessages().subscribe(
      result => {
        setTimeout(() => {
          this.pedagogyMessages = _.get(result, 'messages', []);
          this.message = this.questionsComponent.generateMessageString(this.pedagogyMessages, 'before', 'overlay');
          if (this.message.class === 'overlay' && !this.message.close) {
            if (this.message.message !== ('' && null && undefined)) {
              this.sharedService.open(this.messagesModal, ['backDropStop']);
            }
          }
        }, 100);
      },
      responseError => this.errorInfo = responseError
    );
    this.getBasicDataService = this.contentService.getBasicData().subscribe(
      result => { this.userInfo = _.get(result, 'userInformation', {}); }
    );
    this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(
      result => {
        this.questionContent = result;
        this.from = _.get(result, 'from', '').toLowerCase();
      }
    );
    this.getQuestionDataService = this.contentService.getQuestionData().subscribe(
      result => {
        this.questionData = result;
      }
    );
    this.getScoreSheetService = this.contentService.getScoreSheet().subscribe(
      result => {
        this.scoreSheet = result;
        if (this.scoreSheet.open) {
          this.scoreSheet.open = false;
          this.contentService.setScoreSheet(this.scoreSheet);
          this.stopContentTimer();
          this.sharedService.open(this.scoreSheetModal, ['backDropStop']);
          this.setScoreDetails();
        }
      }
    );
    this.getTimerValueService = this.contentService.getTimerValue().subscribe(
      result => {
        const endTime: any = _.get(result, 'endTimer', '');
        if (endTime === 1 && this.from === 'worksheet') {
          this.worksheetTimedout();
        }
      }
    );
    this.getExpireWorksheetTimeService = this.contentService.getExpireWorksheetTime().subscribe(
      result => {
        this.expireTimer = _.get(result, 'expired', false);
        if (this.expireTimer) {
          this.worksheetTimedout();
        }
      }
    );
    this.getConfirmQuitWorksheetService = this.contentService.getConfirmQuitWorksheet().subscribe(
      result => {
        if (result.state) {
          this.confirmQuitWorksheet();
          this.contentService.setConfirmQuitWorksheet(false);
        }
      }
    );
    this.getOpenTransitionService = this.contentService.getOpenTransition().subscribe(
      result => {
        if (result.open) {
          this.openTransition();
          this.contentService.setOpenTransition(false);
        }
      }
    );
    this.getWorksheetTimeoutModalService = this.contentService.getShowTimeoutModal().subscribe(res => {
      if (res) {
        this.sharedService.dismissOpenModal();
        this.sharedService.open(this.timeoutWorksheetModal, ['backDropStop']);
      }
    })
  }

  ngOnChanges(changes: any): void {
    const changePedagogyContentMode = _.get(changes, 'pedagogyContentMode.currentValue', null);
    const changePedagogyHigherLevel = _.get(changes, 'pedagogyHigherLevel.currentValue', null);
    if (changePedagogyContentMode !== undefined && changePedagogyContentMode !== null) {
      this.pedagogyContentMode = changePedagogyContentMode.toLowerCase();
    }
    if (changePedagogyHigherLevel !== undefined && changePedagogyHigherLevel !== null) {
      this.pedagogyHigherLevel = changePedagogyHigherLevel.toLowerCase();
    }
  }

  ngOnDestroy() {
    this.getTemplateService.unsubscribe();
    this.getMessagesService.unsubscribe();
    this.getBasicDataService.unsubscribe();
    this.getQuestionContentService.unsubscribe();
    this.getQuestionDataService.unsubscribe();
    this.getScoreSheetService.unsubscribe();
    this.getTimerValueService.unsubscribe();
    this.getExpireWorksheetTimeService.unsubscribe();
    this.getConfirmQuitWorksheetService.unsubscribe();
    this.getOpenTransitionService.unsubscribe();
    this.getWorksheetTimeoutModalService.unsubscribe();
  }

  doneQuestion() {
    let modal: any;
    const mode = this.pedagogyContentMode;
    const higherLevel: string = this.pedagogyHigherLevel;
    const templateContent: string = _.get(this.questionContent, 'templateContent', '').toLowerCase();
    const templateMode: string = _.get(this.questionContent, 'mode', '').toLowerCase();
    this.contentService.setVoiceOverDisabled(true);
    if (this.from === 'worksheet') {
      modal = this.quitTimedModal;
    }
    else if (templateContent === 'timedtest') {
      modal = this.quitTimedtestModal;
    } else if (templateMode === 'revise') {
      modal = this.quitRevisionModal;
    } else if (higherLevel && higherLevel.toLowerCase() === 'in-progress') {
      modal = this.quitHigherLevel;
    } else if (this.from === 'games') {
      this.closeActivity();
    } else {
      this.closeContent();
    }
    if (typeof (modal) !== 'undefined') {
      if (this.from === 'worksheet') {
        this.pauseTimer();
        let unitSequenceNo;
        this.contentService.getNextWorksheetSequence().subscribe(result => {
          unitSequenceNo = _.get(result, 'sequence', 1)
        });
        this.contentService.setNextWorksheetSequence(unitSequenceNo - 1);
        this.contentService.setFromWorksheet('done');
        this.contentService.setQuestionSubmit(true);
      }
      this.sharedService.open(modal, ['backDropStop']);
    }
  }

  pauseTimer() {
    this.contentService.setWorksheetPauseTimer(true);
  }

  quitTopicHigherLevel() {
    this.questionsComponent.quitTopicHigherLevel();
  }

  worksheetTimedout() {
    let unitSequenceNo;
    this.contentService.getNextWorksheetSequence().subscribe(result => {
      unitSequenceNo = _.get(result, 'sequence', 1)
    });
    this.contentService.setNextWorksheetSequence(unitSequenceNo - 1);
    this.contentService.setFromWorksheet('timeout');
    this.contentService.setQuestionSubmit(true);
  }

  confirmQuitWorksheet() {
    this.sharedService.open(this.confirmQuitWorksheetModal, ['backDropStop']);
  }

  quitWorksheets() {
    this.sharedService.dismissOpenModal();
    if (!this.expireTimer) {
      this.questionsComponent.quitWorksheets();
    } else {
      this.contentService.setExpireWorksheetTime(false);
    }
  }

  closeTimedContent() {
    this.stopContentTimer();
    const templateContent: string = _.get(this.questionContent, 'templateContent', '').toLowerCase();
    if (this.from === 'worksheet') {
      this.closeWorksheet();
      this.contentService.setWorksheetPauseTimer(false);
    } else if (templateContent === 'timedtest') {
      this.closeContent();
    }
  }

  private stopContentTimer() {
    this.contentService.setTimerValue({});
    this.questionData.timed = false;
    this.contentService.setQuestionData(this.questionData);
  }

  closeContent() {
    const data = {
      'userTriggered': true,
      'endTopicFlag': false,
      'endTopicHigherLevel': false,
      'sessionTimeExceededFlag': false
    };
    this.questionsComponent.closeContent(data);
  }

  closeWorksheet() {
    const closeWorksheetModal = document.getElementById('closeWorksheetModal');
    if (closeWorksheetModal) {
      closeWorksheetModal.click();
    }
    this.sharedService.dismissOpenModal();
    this.router.navigate([AppSettings.REDIRECT_CODE.worksheetlist]);
  }

  closeActivity() {
    this.router.navigate(['/games']);
  }

  closeRevision() {
    this.sharedService.dismissOpenModal();
    this.router.navigate(['/topics']);
  }

  closePedagogyOverlay() {
    let currentMessage, where;
    for (let i = 0; i < this.pedagogyMessages.length; i++) {
      currentMessage = this.pedagogyMessages[i];
      where = _.get(currentMessage, 'beforeSubmit.where', '').toLowerCase();
      if (where === 'overlay') {
        this.pedagogyMessages[i].beforeSubmit.where = '';
        this.pedagogyMessages[i].beforeSubmit.messages.default = '';
        this.pedagogyMessages[i].beforeSubmit.messages.defaultClose = true;
        this.contentService.setMessages(this.pedagogyMessages);
      }
    }
    this.sharedService.dismissOpenModal();
    this.contentService.setMessageClose(true);
  }

  setScoreDetails() {
    this.scoreDetails = {};
    let accuracy, total, attempted, correct, wrong, timeTaken;
    total = _.get(this.scoreSheet, 'totalQuestions', null);
    attempted = _.get(this.scoreSheet, 'totalAttempted', null);
    correct = _.get(this.scoreSheet, 'totalCorrect', null);
    timeTaken = _.get(this.scoreSheet, 'timeTaken', null);
    if (!isNaN(timeTaken)) {
      timeTaken = timeTaken / 60;
      timeTaken = Number.isInteger(timeTaken) ? timeTaken : timeTaken.toFixed(2);
    }
    if (total !== null && total !== 0) {
      wrong = attempted - correct;
      accuracy = 100 * correct / total;
      accuracy = Number.isInteger(accuracy) ? accuracy : accuracy.toFixed(2);
    } else {
      accuracy = null;
      wrong = null;
    }
    this.scoreDetails = {
      finished: _.get(this.scoreSheet, 'finished', false),
      userName: _.get(this.userInfo, 'name', ''),
      duration: _.get(this.scoreSheet, 'duration', null),
      timeTaken: timeTaken,
      accuracy: accuracy,
      total: total,
      correct: correct,
      wrong: wrong
    };
  }

  getContentType() {
    let contentType = '';
    const templateContent: string = _.get(this.questionContent, 'templateContent', '').toLowerCase();
    if (this.from === 'worksheet') {
      contentType = 'worksheet';
    } else if (templateContent === 'timedtest') {
      contentType = templateContent.toLowerCase();
    }
    return contentType;
  }

  updateAnswer() {
    this.sharedService.dismissOpenModal();
    this.questionsComponent.resetQuestionService();
    this.questionsComponent.resetTimedTestContent();
    this.questionsComponent.updateAnswer();
  }

  padZero(value?) {
    value = (value) ? value : '0';
    return this.sharedService.padPrefix(value, 2, '0');
  }

  openTransition() {
    this.sharedService.open(ProgressModalComponent, ['backDropStop']);
  }

  showButton(type) {
    let flag: boolean;
    const templateMode: string = _.get(this.questionContent, 'mode', '').toLowerCase();
    if (type === 'done') {
      flag = ((this.from === 'topic') && templateMode !== 'revise');
    } else if (type === 'close') {
      flag = (this.from === 'games' || templateMode === 'revise' || this.from === 'worksheet');
    }
    return flag;
  }

  resumeWorksheet() {
    this.contentService.setWorksheetPauseTimer(false);
    this.sharedService.dismissOpenModal();
  }
}
