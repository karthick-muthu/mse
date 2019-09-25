import { Component, HostListener, Input, OnChanges, OnDestroy } from '@angular/core';
import * as _ from 'lodash';
import { ContentService } from '../../../services/content/content.service';
import { QuestionsComponent } from '../questions.component';

@Component({
  selector: 'ms-question-alerts',
  templateUrl: './question-alerts.component.html',
  styleUrls: ['./question-alerts.component.scss']
})
export class QuestionAlertsComponent implements OnChanges, OnDestroy {
  @Input('result') result: any;
  @Input('question') question: any;
  private displayMessages: any[];
  private displayShake: boolean;
  private contentDetails: any;
  questionAlertStyle: any;
  conditionalAlert: any;
  messageToDisplay: any;
  errorInfo: any;

  private getQuestionContentService: any;
  private getMessagesService: any;
  private getConditionalAlertService: any;

  constructor(private questionsComponent: QuestionsComponent, private contentService: ContentService) {
    this.contentService.setMessages([]);
    this.getMessagesService = this.contentService.getMessages().subscribe(
      result => {
        this.displayMessages = _.get(result, 'messages', []);
        this.messageToShow();
      },
      responseError => this.errorInfo = responseError
    );
    this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(
      result => this.contentDetails = result,
      responseError => this.errorInfo = responseError
    );
    this.getConditionalAlertService = this.contentService.getConditionalAlert().subscribe(
      result => this.conditionalAlert = result.message,
      responseError => this.errorInfo = responseError
    );
  }

  @HostListener('window:scroll')
  onScroll() {
    const height: number = window.pageYOffset;
    const el: any = document.getElementById('questionHeader');
    if (el) {
      const elHeight: number = el.offsetHeight;
      const alert = document.getElementById('questionAlert');
      if (alert) {
        if (height > elHeight) {
          this.questionAlertStyle = { 'top': 0 };
          alert.classList.add('fixed');
        } else {
          this.questionAlertStyle = { 'top': '-' + height + 'px' };
          alert.classList.remove('fixed');
        }
      }
    }
  }

  ngOnChanges(changes: any): void {
    const changeResult = _.get(changes, 'result.currentValue', null);
    const changeQuestion = _.get(changes, 'question.currentValue', null);
    if (changeResult !== null && changeResult !== undefined) {
      this.result = changeResult;
      this.messageToShow();
    }
    if (changeQuestion !== null && changeQuestion !== undefined) {
      this.question = changeQuestion;
      this.setMessages(this.question);
    }
  }

  ngOnDestroy() {
    this.getMessagesService.unsubscribe();
    this.getQuestionContentService.unsubscribe();
    this.getConditionalAlertService.unsubscribe();
  }

  closeAlert() {
    this.messageToDisplay.close = true;
    this.questionsComponent.updateMessages();
    this.contentService.setMessageClose(true);
  }

  setMessages(question) {
    const messages = _.get(question, 'messages', {});
    this.questionsComponent.generateDisplayMessages(messages);
  }

  messageToShow() {
    let message, messages;
    messages = this.displayMessages;
    const contentAttempted = _.get(this.contentDetails, 'contentAttempted', false);
    if (!contentAttempted) {
      this.messageToDisplay = this.questionsComponent.generateMessageString(messages, 'before', 'ribbon');
    } else {
      this.messageToDisplay = this.questionsComponent.generateMessageString(messages, 'after', 'ribbon');
    }
    message = _.get(this.messageToDisplay, 'message', '');
    if (this.conditionalAlert !== null && this.conditionalAlert !== undefined && this.conditionalAlert !== '') {
      if (message !== '') {
        this.messageToDisplay.message = this.conditionalAlert + '<br>' + message;
      } else {
        this.messageToDisplay.message = this.conditionalAlert;
      }
      setTimeout(() => { this.contentService.setConditionalAlert(null); }, 100);
    }
    this.displayShake = true;
    setTimeout(() => { this.displayShake = (this.displayShake) ? false : this.displayShake; }, 500);
  }

  showMessages() {
    const message = _.get(this.messageToDisplay, 'message', '');
    const close = _.get(this.messageToDisplay, 'close', false);
    return (message !== '' && message !== null && message !== undefined && !close);
  }

  getMessageClass() {
    let className;
    const messageClass = _.get(this.messageToDisplay, 'class', 'ribbongreen').toLowerCase();
    switch (messageClass) {
      case 'ribbongreen': className = 'alert-mistake'; break;
      case 'ribbonred': className = 'alert-incorrect'; break;
      default: className = 'alert-mistake';
    }
    if (this.displayShake) {
      className += ' shake';
    }
    return className;
  }

}
