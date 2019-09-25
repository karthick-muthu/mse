import { Component, OnDestroy, OnInit, HostListener, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';
import { IMathQuill } from 'mathquill-typescript';
import { Subscription } from 'rxjs/Subscription';
import { ContentService } from '../../../services/content/content.service';
import { MathQuillService } from '../../../services/mathquill/mathquill.service';
import { SharedService } from '../../../shared.service';
import { MathquillEditorOptions } from '../mathquill-editor-options.model';
import { QuestionsComponent } from '../questions.component';
import { WorsheetModalComponent } from '../worsheet-modal/worsheet-modal.component';
import { SparkieAlertsComponent } from '../sparkie-alerts/sparkie-alerts.component';
@Component({
  selector: 'ms-questions-structure',
  templateUrl: './questions-structure.component.html',
  styleUrls: ['./questions-structure.component.scss']
})
export class QuestionsStructureComponent implements OnInit, OnDestroy {
  grade: any;
  question: any;
  orientation: string;
  displayType: string;
  showQuestion: boolean;
  showExplanation: any;
  questionContent: any;
  translationContent: any;
  mcqChoices: any;
  questionVoiceOver: string;
  explainationVoiceOver: string;
  startTimer: any;
  endTimer: any;
  newAudioLink: any;
  idk: boolean;
  questionField: any;
  noRewardAlertFlag: boolean;
  evaluationResult: any = null;
  evaluationOutput: any[];
  invalidFormElement: any = {};
  hints: any[] = [];
  errorInfo: any;
  templateClass: any;
  questionStyle: any = {};
  questionTemplate: string;
  template: string;
  voDisabled: string;
  from: any;
  timed: any;
  toDisable = false;
  isDevice: boolean;
  keyboardOptions: MathquillEditorOptions = {
    buttonLatexContents: []
  };
  keyboardElements: any;
  mq: IMathQuill;
  latexSource: string;
  attemptNumber: any;
  contentSubMode: any;
  isDynamic: any;
  private currentQuestion: any;
  private disableOption: boolean;
  private firstElementFocusCount = 0;
  private audio: HTMLAudioElement;
  private timedTestData: any;
  private timedTestTemplate: any;
  private expireTimer: boolean;
  private scrollToExplanationTimeout: any;
  private mathQuillConfig: any = {
    spaceBehavesLikeTab: true,
    handlers: {}
  };
  private scrollDownInterval: any;
  private getTranslationContentService: Subscription;
  private getTemplateService: Subscription;
  private getQuestionSubmitService: Subscription;
  private getMessagesService: Subscription;
  private getMessageCloseService: Subscription;
  private getInteractiveSubmitResponseService: Subscription;
  private getVoiceOverDisabledService: Subscription;
  private getQuestionContentService: Subscription;
  private getQuestionDisplayContentService: Subscription;
  private getQuestionDataService: Subscription;
  private getTimerValueService: Subscription;
  private getExpireWorksheetTimeService: Subscription;
  private getResetQuestionFieldService: Subscription;
  private getDisplayQuestionFieldBS: Subscription;
  private getKeyboardElementsService: Subscription;
  selectedOption: any = null;
  constructor(private contentService: ContentService, private sharedService: SharedService,
    private questionsComponent: QuestionsComponent, private mathQuillService: MathQuillService) {
    this.getTemplateService = this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
      },
      responseError => this.errorInfo = responseError
    );
    this.getQuestionSubmitService = this.contentService.getQuestionSubmit().subscribe(
      result => {
        if (result.submit) {
          if (this.from !== 'worksheet') {
            if (this.oneOfFormTemplates()) {
              this.submitFormAnswer();
            } else if (this.oneOfIframeTemplates() && this.questionTemplate.toLowerCase() === 'interactive') {
              this.evaluateInteractiveContent();
            } else if (this.questionTemplate && this.questionTemplate.toLowerCase() === 'timedtest') {
              this.evaluateTimedTestContent();
            }
            /* Else condition for this funtions is available in questions.component.ts */
          }
          else if (this.from === 'worksheet') {
            if (this.oneOfFormTemplates()) {
              this.submitFormAnswer();
            }
            else if (this.questionTemplate.toLowerCase() === 'mcq') {
              this.evaluateWorksheetOption();
            }
          }
        }
      },
      responseError => this.errorInfo = responseError
    );
    this.getMessagesService = this.contentService.getMessages().subscribe(
      result => this.setQuestionHeight(100)
    );
    this.getMessageCloseService = this.contentService.getMessageClose().subscribe(
      result => this.onCloseSetFocus(result.closed)
    );
    this.getInteractiveSubmitResponseService = this.contentService.getInteractiveSubmitResponse().subscribe(
      result => { if (result.result) { this.submitFormContent(result.result); } }
    );
    this.getVoiceOverDisabledService = this.contentService.getVoiceOverDisabled().subscribe(
      result => {
        this.voDisabled = result.state;
        if (this.voDisabled) { this.pauseAudio(); }
      }
    );
    this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(
      result => {
        this.questionContent = result;
        this.from = _.get(result, 'from', '').toLowerCase();
        this.questionTemplate = _.get(result, 'templateContent', '').toLowerCase();
        this.noRewardAlertFlag = _.get(result, 'noRewardAlertFlag', false);
        this.contentSubMode = _.get(result, 'contentSubMode', '');
        this.grade = _.get(result, 'grade', '');
        this.isDynamic = _.get(result, 'isDynamic', '');


        if (this.questionTemplate === 'mcq' && this.from === 'worksheet') {
          setTimeout(() => {
            this.selectedOption = _.get(this.question, 'userAnswer.userAnswer', null);
          }, 1000)
        }
      }
    );
    this.getQuestionDisplayContentService = this.contentService.getQuestionDisplayContent().subscribe(
      result => {
        this.question = _.get(result, 'content', {});
        this.questionTemplate = _.get(result, 'template', '').toLowerCase();
        this.showQuestion = true;
        this.checkQuestionStructure();
        this.initializeQuestionDetails();
      }
    );
    this.getQuestionDataService = this.contentService.getQuestionData().subscribe(
      result => {
        this.timed = _.get(result, 'timed', '');
      }
    );
    this.getTimerValueService = this.contentService.getTimerValue().subscribe(
      result => {
        this.startTimer = _.get(result, 'worksheetValue', '');
        this.endTimer = _.get(result, 'endTimer', '');
        if (this.startTimer) {
          if (this.endTimer !== null && this.endTimer < 0) {
            this.startTimer = false;
          }
        }
      }
    );
    this.getExpireWorksheetTimeService = this.contentService.getExpireWorksheetTime().subscribe(
      result => this.expireTimer = _.get(result, 'expired', false)
    );
    this.getTranslationContentService = this.contentService.getTranslationContent().subscribe(
      result => {
        this.translationContent = result;
        this.getDisplayType(this.orientation);
        this.setMCQChoices('translation');
      }
    );
    this.getResetQuestionFieldService = this.contentService.getResetQuestionField().subscribe(
      result => {
        if (result.empty) {
          this.showQuestion = false;
          this.contentService.setResetQuestionField(false);
        }
      },
      responseError => this.errorInfo = responseError
    );
    this.getDisplayQuestionFieldBS = this.contentService.getDisplayQuestionField().subscribe(
      result => this.showQuestion = result.show,
      responseError => this.errorInfo = responseError
    );
    /* MathQuill Keyboard Start */
    this.getKeyboardElementsService = this.contentService.getKeyboardElements().subscribe(
      result => {
        this.keyboardElements = result;
        this.isDevice = _.get(this.keyboardElements, 'isDevice', null);
        setTimeout(() => { this.displayKeyboard(); }, 500);
      },
      responseError => this.errorInfo = responseError
    );
    mathQuillService.mqpromise.then((mq: IMathQuill) => {
      this.mq = mq.getInterface(2);
      setTimeout(() => { this.refreshLatex(); }, 200);
    }).catch(() => { });
    this.getKeyboardButtons();
    /* MathQuill Keyboard End */
  }

  ngOnInit() {
    this.checkQuestionStructure();
    this.loadSparkieAlertModal();
  }

  ngOnDestroy() {
    this.getTemplateService.unsubscribe();
    this.getQuestionSubmitService.unsubscribe();
    this.getMessagesService.unsubscribe();
    this.getMessageCloseService.unsubscribe();
    this.getInteractiveSubmitResponseService.unsubscribe();
    this.getVoiceOverDisabledService.unsubscribe();
    this.getQuestionContentService.unsubscribe();
    this.getQuestionDisplayContentService.unsubscribe();
    this.getQuestionDataService.unsubscribe();
    this.getTimerValueService.unsubscribe();
    this.getExpireWorksheetTimeService.unsubscribe();
    this.getTranslationContentService.unsubscribe();
    this.getResetQuestionFieldService.unsubscribe();
    this.getDisplayQuestionFieldBS.unsubscribe();
    this.getKeyboardElementsService.unsubscribe();
    if (this.scrollDownInterval) {
      clearInterval(this.scrollDownInterval);
    }
  }

  @HostListener('window:resize', ['$event'])
  private onresize($event) {
    if (this.orientation) {
      this.getDisplayType(this.orientation);
      this.setQuestionHeight();
    }
  }

  checkQuestionStructure() {

    let data, type, template, currentQuestion, sequenceNo;
    // if (!environment.production) { console.log('questionContent in structure', this.question); }
    if (this.question) {
      this.disableOption = false;
      data = this.question;
      type = _.get(data, 'contentType', '').toLowerCase();
      template = _.get(data, 'template', '').toLowerCase();


      if (template === 'timedtest') {
        sequenceNo = _.get(data, 'timedTestData.questionSequenceNo', null);
        currentQuestion = _.get(data, 'questions[' + sequenceNo + ']', {});
        this.orientation = _.get(currentQuestion, 'optionsOrientation', 'regular').toLowerCase();
      } else {
        this.orientation = _.get(data, 'optionsOrientation', 'regular').toLowerCase();
      }
      this.getDisplayType(this.orientation);
    }
  }

  getDisplayType(orientation: string) {

    let showTranslation,
      hasTranslation,
      type = 'fullwidth';
    hasTranslation = _.get(this.translationContent, 'hasTranslation', false);
    showTranslation = _.get(this.translationContent, 'showTranslation', false);
    if (hasTranslation && showTranslation) {
    } else if (orientation === 'right' && window.innerWidth > 767) {
      type = 'halfwidth';
    }
    this.displayType = type;
  }

  /* Common Functions Start */
  private onInit() {
    this.currentQuestion = _.cloneDeep(this.question);
    this.initializeContent();
    this.setQuestion(this.question, 'questionField');
    this.setMCQChoices('question');
    this.setQuestionVoiceOver(this.question);
    this.setExplainationVoiceOver(this.question);
    this.setHints(this.question, 'hint');
    this.loadTimerModal();
    this.idk = false;
  }

  private oneOfFormTemplates() {
    if (this.questionTemplate) {
      return this.questionsComponent.oneOfFormTemplates(this.questionTemplate);
    }
    return false;
  }

  private oneOfIframeTemplates() {
    if (this.questionTemplate) {
      return this.questionsComponent.oneOfIframeTemplates(this.questionTemplate);
    }
    return false;
  }

  private initializeContent() {
    this.questionStyle = {};
    this.evaluationResult = {};
    this.invalidFormElement = {};
    this.evaluationOutput = [];
    this.hints = [];
    this.contentService.setQuestionSubmit(false);
  }

  private initializeQuestionDetails() {
    this.timedTestData = _.get(this.question, 'timedTestData', {});
    this.timedTestTemplate = _.get(this.timedTestData, 'questionTemplate', '');
    this.firstElementFocusCount = 0;
    this.showExplanation = { visibility: 'hidden', position: 'absolute' };
    this.onInit();
    if (this.scrollDownInterval) {
      clearInterval(this.scrollDownInterval);
    }
  }

  private setQuestion(content, object) {
    let template;
    this.questionField = _.get(content, object, '');
    this.setQuestionHeight();
    this.setFormElements();
    this.scrollToTop();
    if (this.isDevice) {
      if (this.questionTemplate.toLowerCase() === 'timedtest') {
        template = this.timedTestTemplate.toLowerCase();
      } else {
        template = this.questionTemplate.toLowerCase();
      }
      if (template === 'blank' || template === 'blank_dropdown') {
        setTimeout(() => {
          this.refreshLatex();
        }, 500);
      }
    }
  }

  private setQuestionHeight(time?: number) {
    time = isNaN(time) ? 500 : time;
    setTimeout(() => {
      this.questionStyle['min-height'] =
        'calc(100vh - ' + this.questionsComponent.getQuestionBodyHeight(this.displayType) + 'px)';
      if (this.oneOfIframeTemplates() || this.questionTemplate.toLowerCase() === 'game') {
        if (this.questionTemplate.toLowerCase() !== 'interactive') {
          this.scrollToIframe();
        }
      }
      if (window.innerHeight <= 615) {
        this.questionStyle['height'] = '100%';
        if (window.innerHeight <= 420) {
          if (this.questionStyle['min-height']) {
            delete this.questionStyle['min-height'];
          }
        }
      }
    }, time);
  }

  getQuestionStyle(type: string) {
    let mathQuillKeyboard: any, mathQuillKeyboardHeight, isKeyboard: boolean;
    if (this.questionStyle) {
      if (this.displayType === 'fullwidth' && (type === 'primary' || type === 'vernacular')) {
        isKeyboard = _.get(this.keyboardElements, 'isKeyboard', false);
        mathQuillKeyboardHeight = 0;
        if (type === 'primary' && isKeyboard) {
          mathQuillKeyboard = document.getElementsByClassName('mathquill-editor-wrapper');
          if (mathQuillKeyboard) {
            mathQuillKeyboard = document.getElementsByClassName('mathquill-editor-wrapper')[0];
            if (mathQuillKeyboard) {
              mathQuillKeyboardHeight = mathQuillKeyboard.offsetHeight;
            }
          }
        }
        this.questionStyle['padding-bottom'] = mathQuillKeyboardHeight + 'px';
        return this.questionStyle;
      } else if (this.displayType === 'halfwidth' && type === 'secondary') {
        return this.questionStyle;
      }
    }
    return {};
  }

  private setHints(content, object) {
    //  console.log("11");
    this.hints = _.get(content, object, []);
  }

  private setQuestionVoiceOver(content) {
    //console.log("12");

    let template, responseElements, questionIndex, questionVoiceover;
    if (this.questionTemplate !== undefined && this.questionTemplate !== null && this.questionTemplate !== '') {
      template = this.questionTemplate.toLowerCase();
      if (template === 'timedtest') {
        ({ responseElements, questionIndex } = this.getResponseElements());
        questionVoiceover = _.get(this.question, 'questions[' + questionIndex + '].questionVoiceover', null);
      } else {
        questionVoiceover = _.get(this.question, 'questionVoiceover', null);
      }
      this.questionVoiceOver = questionVoiceover;
    } else {
      setTimeout(() => {
        this.setQuestionVoiceOver(content);
      }, 500);
    }
  }

  private setExplainationVoiceOver(content) {
    //console.log("12");

    let template, responseElements, questionIndex, explainationVoiceOver;
    if (this.questionTemplate !== undefined && this.questionTemplate !== null && this.questionTemplate !== '') {
      template = this.questionTemplate.toLowerCase();
      if (template === 'timedtest') {
        ({ responseElements, questionIndex } = this.getResponseElements());
        explainationVoiceOver = _.get(this.question, 'questions[' + questionIndex + '].explanationVoiceOver', null);
      } else {
        explainationVoiceOver = content;
      }
      this.explainationVoiceOver = explainationVoiceOver;
    } else {
      setTimeout(() => {
        this.setExplainationVoiceOver(content);
      }, 500);
    }
  }

  private setFormElements() {

    let responseElements,
      questionIndex,
      options,
      setElementsFocus = false;
    if (this.questionTemplate !== undefined && this.questionTemplate !== null && this.questionTemplate !== '') {
      const template = this.questionTemplate.toLowerCase();
      if (template === 'mcq') {
        this.evaluationOutput = [];
        ({ responseElements, questionIndex } = this.getResponseElements());
        options = _.get(this.question, 'responseElements.mcqPattern.choices', []);
        for (let i = 0; i < options.length; i++) {
          this.evaluationOutput.push('');
        }
      } else if (this.oneOfFormTemplates()) {
        setElementsFocus = true;
      } else if (
        this.timedTestTemplate !== (undefined && null && '') &&
        this.questionsComponent.oneOfFormTemplates(this.timedTestTemplate)
      ) {
        setElementsFocus = true;
      }
      if (setElementsFocus) {
        setTimeout(() => {
          this.setFirstEmptyElementFocus();
        }, 200);
      }
    } else {
      setTimeout(() => this.setFormElements(), 500);
    }
  }

  getFullWidthContainerClass(type) {
    //console.log("14");
    let className = '',
      showTranslation,
      hasTranslation;
    hasTranslation = _.get(this.translationContent, 'hasTranslation', false);
    showTranslation = _.get(this.translationContent, 'showTranslation', false);
    if (hasTranslation && showTranslation) {
      className = type === 'primary' ? 'vernacular fullwidth' : 'col-lg-6 col-md-6 vernacular-col';
    } else {
      if (type === 'primary') {
        className =
          this.displayType === 'fullwidth' ? 'top-spacing bottom-spacing fullwidth' : 'halfwidth full-height';
      } else {
        className = this.displayType === 'fullwidth' ? 'col-sm-12' : ' col-lg-7 col-md-7 col-sm-12';
      }
    }
    return className;
  }

  getContainerRowClass(type) {
    //console.log("15");
    let className = '';
    switch (type) {
      case 'primary':
        className = this.displayType === 'fullwidth' ? '' : 'main-row';
        break;
      case 'secondary':
        className = this.displayType === 'fullwidth' ? 'main-row' : '';
        break;
    }
    return className;
  }

  playAudio(audioLink) {
    if (!this.voDisabled) {
      const paused = _.get(this.audio, 'paused', false);
      if (this.audio && !paused) {
        this.pauseAudio();
      } else {
        this.audio = new Audio(audioLink);
        this.audio.play();
      }
    }
  }

  readOutLoudAudio(audioLink) {
    this.newAudioLink = audioLink;
    this.pauseAudio();
    this.audio = new Audio(this.newAudioLink);
    this.audio.play();
  }

  pauseAudio() {
    if (!_.get(this.audio, 'paused', true)) {
      this.audio.pause();
    }
  }

  getVoiceOverTitle() {
    let titleKey, titleText;
    if (this.voDisabled) {
      titleKey = 'audio_disabled';
    } else {
      const paused = _.get(this.audio, 'paused', false);
      if (!this.audio || (this.audio && paused)) {
        titleKey = 'read out loud';
      } else {
        titleKey = 'stop read';
      }
    }
    this.sharedService.translateMessage(titleKey).subscribe(res => {
      titleText = res;
    });
    return titleText;
  }

  private submitFormContent(evaluationResult, elements?: string[]) {
    this.evaluationResult = _.isEmpty(this.evaluationResult) ? evaluationResult : this.evaluationResult;
    this.setExplainationVoiceOver(this.evaluationResult.explanationVoiceover);
    //this.explainationVoiceOver = _.get(this.evaluationResult.explanationVoiceover, null);
    //this.setExplainationVoiceOver(this.explainationVoiceOver);
    const itemResult = _.get(evaluationResult, 'itemResult', null);
    this.submitOptionAnswer(evaluationResult);
    if (typeof elements !== 'undefined') {
      this.setElementResponseState(evaluationResult, elements);
    } else {
      this.contentService.setInteractiveSubmitResponse(null);
    }
    this.setHints(evaluationResult, 'hints');
    this.contentService.setQuestionSubmit(false);
    // if (!environment.production) { console.log('submitFormContent', evaluationResult); }
  }

  scrollToExplanation() {
    if (this.from !== 'worksheet') {
      let questionForm, questionHeader, heightCheck, eachScroll, height;
      this.showExplanation = { visibility: 'visible' };
      heightCheck = window.scrollY;
      eachScroll = 10;
      questionForm = document.getElementById('questionForm');
      questionHeader = document.getElementById('questionHeader');
      if (questionForm && questionHeader) {
        height = questionForm.offsetHeight + questionHeader.offsetHeight;
        // if (document.getElementById('questionAlert') !== null) { height += document.getElementById('questionAlert').offsetHeight + 40; }
        this.scrollDownInterval = setInterval(() => {
          window.scrollTo(0, heightCheck);
          heightCheck += eachScroll;
          if (heightCheck >= height) {
            clearInterval(this.scrollDownInterval);
          }
        }, 20);
      }
    }
  }

  scrollToTop() {
    let questionHeader,
      height = 0;
    if (window.innerHeight <= 600) {
      questionHeader = document.getElementById('questionHeader');
      height = questionHeader ? questionHeader.offsetHeight : height;
    }
    window.scrollTo(0, height);
  }

  scrollToIframe() {
    let height;
    const extraTop = 20 + 45;
    height = document.getElementById('questionHeader').offsetHeight;
    /* if (document.getElementById('questionAlert') !== null) { height += document.getElementById('questionAlert').offsetHeight + 40; } */
    height += extraTop;
    window.scrollTo(0, height);
  }

  showCorrectAnswer(result: boolean) {
    let returnValue = true;
    const isFirstChallengeAnswer = this.questionsComponent.isFirstChallenge();
    if (isFirstChallengeAnswer) {
      returnValue = result;
    }
    if (this.from === 'worksheet') {
      returnValue = false;
    }
    return returnValue;
  }

  hideIDontKnow() {
    return this.questionsComponent.hideIDontKnow();
  }
  iDontKnow() {
    this.idk = true;
    this.questionsComponent.iDontKnow();
  }

  showTimer() {
    let show = false;
    if (
      (this.from === 'worksheet' && this.timed) ||
      (this.questionTemplate && this.questionTemplate.toLowerCase() === 'timedtest')
    ) {
      show = true;
    }
    return show;
  }
  /* Common Functions End */

  /* MCQ Functions Start */
  setMCQChoices(type) {
    let template,
      questions,
      timedTestTemplate,
      sequenceNo,
      currentQuestion,
      mcqChoices = [];
    template = _.get(this.question, 'template', '').toLowerCase();
    switch (type) {
      case 'translation':
        questions = _.get(this.translationContent, 'displayContent', {});
        this.translationContent.mcqChoices = [];
        break;
      case 'question':
        questions = this.question;
        this.mcqChoices = [];
        break;
    }
    if (template) {
      if (template === 'mcq') {
        mcqChoices = _.get(questions, 'responseElements.mcqPattern.choices', []);
      } else if (template === 'timedtest') {
        timedTestTemplate = _.get(this.question, 'timedTestData.questionTemplate', '').toLowerCase();
        sequenceNo = _.get(this.question, 'timedTestData.questionSequenceNo', null);
        if (timedTestTemplate === 'mcq' && sequenceNo !== null) {
          currentQuestion = _.get(questions, 'questions[' + sequenceNo + ']');
          mcqChoices = _.get(currentQuestion, 'responseElements.mcqPattern.choices', []);
        }
      }
      if (type === 'translation') {
        this.translationContent.mcqChoices = mcqChoices;
      } else {
        this.mcqChoices = mcqChoices;
      }
    } else {
      setTimeout(() => {
        this.setMCQChoices(type);
      }, 200);
    }
  }

  generateOptionString(index) {
    return this.questionsComponent.generateOptionString(index);
  }
  evaluateOption(option) {
    if (this.from === 'worksheet') {
      this.selectedOption = option;
      this.disableOption = false;
    }
    else if (this.from !== 'worksheet' && !this.disableOption) {
      this.disableOption = true;
      let timerAvailable = true;
      const canEvaluate = this.canEvaluateOption(this.evaluationResult);
      if (canEvaluate && !this.idk && timerAvailable) {
        if (this.questionTemplate === 'timedtest') {
          this.evaluateTimedTestContent(option);
        } else {
          this.evaluationResult = this.questionsComponent.evaluateOption(option);
          this.evaluationOutput[option] = (this.evaluationResult.result) ? '1' : '0';
          this.submitOptionAnswer(this.evaluationResult);
          this.contentService.setQuestionSubmit(false);
          this.setHints(this.evaluationResult, 'hints');
        }
      }
    }
  }

  evaluateWorksheetOption() {
    if (this.selectedOption != null) {
      this.evaluationResult = this.questionsComponent.evaluateOption(this.selectedOption);
      this.evaluationOutput[this.selectedOption] = (this.evaluationResult.result) ? '1' : '0';
      this.submitOptionAnswer(this.evaluationResult);
      this.contentService.setQuestionSubmit(false);
    } else {
      let remainingTime;
      let unitSequenceNo;
      this.contentService.getTimerValue().subscribe(result => {
        remainingTime = result.endTimer;
      });
      this.contentService.getNextWorksheetSequence().subscribe(result => {
        unitSequenceNo = result.sequence;
      });
      this.questionsComponent.callSubmitWorksheet(unitSequenceNo, remainingTime);
    }
  }
  canEvaluateOption(result) {
    const canEvaluate = !_.get(result, 'noMoreAttempts', false);
    const currentResult = _.get(result, 'result', false);
    return (canEvaluate && !currentResult);
  }

  getOptionsSectionClass() {
    let template: string,
      orientation: string,
      currentQuestion,
      sequenceNo,
      hasTranslation,
      showTranslation,
      optionsSectionClassName = this.templateClass;
    if (this.question && this.questionTemplate) {
      template = this.questionTemplate.toLowerCase();
      hasTranslation = _.get(this.translationContent, 'hasTranslation', false);
      showTranslation = _.get(this.translationContent, 'showTranslation', false);
      if (template === 'timedtest') {
        template = this.timedTestTemplate;
        sequenceNo = _.get(this.timedTestData, 'questionSequenceNo', null);
        currentQuestion = _.get(this.question, 'questions[' + sequenceNo + ']', {});
        orientation = _.get(currentQuestion, 'optionsOrientation', 'regular').toLowerCase();
      } else {
        orientation = _.get(this.question, 'optionsOrientation', 'regular').toLowerCase();
      }
      if (!hasTranslation || !showTranslation) {
        if (template === 'mcq' && orientation === '2x2') {
          optionsSectionClassName += ' ' + 'option2x2';
        }
      }
    }
    return optionsSectionClassName;
  }
  setOptionsClass(output, choice) {
    let cannotEvaluate, currentResult, correctOption, showCorrectAnswer, userAnswer, className = 'option-default';
    if (!this.idk) {
      switch (output) {
        case '':
          cannotEvaluate = _.get(this.evaluationResult, 'noMoreAttempts', false);
          currentResult = _.get(this.evaluationResult, 'result', false);
          correctOption = this.getCorrectOption(this.evaluationResult, this.question);
          showCorrectAnswer = this.showCorrectAnswer(currentResult);
          if (showCorrectAnswer && (correctOption === choice.toString())) {
            className = 'option-correct';
          } else {
            if (cannotEvaluate || (currentResult && !showCorrectAnswer)) {
              className = 'option-disabled';
            }
          }
          break;
        case '1':
          className = 'option-correct';
          break;
        case '0':
          className = 'option-incorrect';
          break;
      }
    } else {
      className = 'option-disabled';
    }
    return className;
  }


  private getCorrectOption(result, question) {
    let option = null;
    if (result.correctAnswer !== '' && !result.result) {
      const correctAnswer = result.correctAnswer;
      option = this.questionsComponent.getAnswerKey(correctAnswer, 'id');
    }
    return option;
  }

  submitOptionAnswer(result) {
    //this.explainationVoiceOver = _.get(result, 'explanationVoiceOver', null);
    this.setExplainationVoiceOver(result.explanationVoiceover);
    //this.setExplainationVoiceOver(this.explainationVoiceOver);

    let contentMode: string, noMoreAttempts: boolean, currentResult: any, timeTaken: any;
    contentMode = _.get(this.questionContent, 'contentMode', '').toLowerCase();
    noMoreAttempts = _.get(result, 'noMoreAttempts', false);
    currentResult = _.get(result, 'result', false);
    timeTaken = _.get(result, 'timeTaken', 0);
    if (noMoreAttempts || this.isCorrectResult(currentResult)) {
      this.pauseAudio();
      if (typeof (this.scrollToExplanationTimeout) !== 'undefined') { clearTimeout(this.scrollToExplanationTimeout); }
      const displayMessages = _.get(this.questionContent, 'displayMessages', []);
      if (contentMode !== 'challenge' ||
        (contentMode === 'challenge' &&
          (_.indexOf(displayMessages, 'challengeAttempt1') === -1 ||
            (_.indexOf(displayMessages, 'challengeAttempt1') > -1 && this.isCorrectResult(currentResult))))) {
        this.scrollToExplanationTimeout = setTimeout(() => { this.scrollToExplanation(); }, 1000);
      }
      if (this.from === 'worksheet') {
        let remainingTime;
        let unitSequenceNo;
        this.contentService.getTimerValue().subscribe(result => {
          remainingTime = result.endTimer;
        });
        this.contentService.getNextWorksheetSequence().subscribe(result => {
          unitSequenceNo = result.sequence;
        });
        this.questionsComponent.callSubmitWorksheet(unitSequenceNo, remainingTime);
      } else {
        this.questionsComponent.callSubmitAnswer();
      }
    } else {
      this.disableOption = false;
    }
  }
  private isCorrectResult(currentResult): boolean {
    return (currentResult === true || currentResult === 'correct');
  }
  /* MCQ Functions End */

  /* Blank, Dropdown Functions Start */
  submitFormAnswer() {
    let element, elementContent, elementType, htmlInputElement, responseElements, questionIndex;
    const submit: string[] = [], data = {};
    ({ responseElements, questionIndex } = this.getResponseElements());
    const elements = _.keys(responseElements);
    const values = _.values(responseElements);
    for (let i = 0; i < elements.length; i++) {
      element = elements[i];
      elementContent = values[i];
      elementType = _.get(elementContent, 'type', '').toLowerCase();
      htmlInputElement = (<HTMLInputElement>document.getElementById(element));
      this.callSetElementClass(htmlInputElement, null);
      if (htmlInputElement) {
        if (this.isDevice && elementType === 'blank') {
          data[element] = (htmlInputElement) ? htmlInputElement.innerText : '';
        } else {
          data[element] = (htmlInputElement) ? htmlInputElement.value : '';
        }
        submit[i] = this.questionsComponent.validateFormElement(data[element], elementContent);
        // if (submit[i] === 'empty') {
        //   break;
        // }
      }
    }
    if (this.isValidAnswers(submit)) {
      this.evaluationResult = this.questionsComponent.evaluateFormElement(data, questionIndex);
      if (this.questionTemplate === 'timedtest') {
        if (this.isDevice && (this.timedTestTemplate === 'blank' || this.timedTestTemplate === 'blank_dropdown')) {
          this.hideKeyboard();
        }
        this.submitTimedTestQuestion(this.evaluationResult);
      } else {
        if (this.isDevice && (this.questionTemplate === 'blank' || this.questionTemplate === 'blank_dropdown')) {
          this.hideKeyboard();
        }
        if (this.from == 'worksheet') {
          let userInput = [];
          userInput = Object.values(_.get(this.evaluationResult, 'userInput', {}));
          let emptyCount = userInput.reduce(function (n, val) {
            return n + (val === "");
          }, 0);
          if (userInput.length == emptyCount) {
            let unitSequenceNo;
            let remainingTime;
            this.contentService.getNextWorksheetSequence().subscribe(result => {
              unitSequenceNo = _.get(result, 'sequence', 1)
            });
            this.contentService.getTimerValue().subscribe(result => {
              remainingTime = result.endTimer;
            });
            this.questionsComponent.callSubmitWorksheet(unitSequenceNo, remainingTime);
          } else {
            this.submitFormContent(this.evaluationResult, elements);
          }
        } else {
          this.submitFormContent(this.evaluationResult, elements);
        }
      }
    } else {
      this.checkEmptyElements(elements, values);
      this.contentService.setQuestionSubmit(false);
      this.questionsComponent.showValidationAlerts(submit);
    }
    this.setFirstEmptyElementFocus();
  }
  private getResponseElements() {
    let responseElements: any, questionIndex: any;
    if (this.questionTemplate === 'timedtest') {
      questionIndex = _.get(this.timedTestData, 'questionSequenceNo', 0);
      responseElements = _.get(this.question, 'questions[' + questionIndex + '].responseElements', {});
    } else {
      responseElements = _.get(this.question, 'responseElements', {});
    }
    return { responseElements, questionIndex };
  }

  private checkEmptyElements(elements, values) {
    let element, elementType, value, htmlInputElement;
    for (let i = 0; i < elements.length; i++) {
      element = elements[i];
      elementType = _.get(values, '[' + i + '].type', '').toLowerCase();
      htmlInputElement = <HTMLInputElement>document.getElementById(element);
      if (this.isDevice && elementType === 'blank') {
        value = _.get(htmlInputElement, 'innerText', '');
      } else {
        value = _.get(htmlInputElement, 'value', '');
      }
      if (value === '' || value === null || value === undefined || value.trim() === '') {
        this.callSetElementClass(htmlInputElement, false);
      }
    }
  }
  setElementResponseState(evaluationResult, elements) {
    let element, elementType, htmlInputElement, answer, noMoreAttempts, responseElements, questionIndex;
    const result = _.get(evaluationResult, 'itemResult', {});
    const currentResult = _.get(evaluationResult, 'result', false);
    const showCorrectAnswer = this.showCorrectAnswer(currentResult);
    for (let i = 0; i < elements.length; i++) {
      element = elements[i];
      ({ responseElements, questionIndex } = this.getResponseElements());
      elementType = _.get(responseElements, element + '.type', '').toLowerCase();
      htmlInputElement = <HTMLInputElement>document.getElementById(element);
      noMoreAttempts = _.get(evaluationResult, 'noMoreAttempts', false);
      if (this.from === 'worksheet') {
        answer = null;
      } else {
        answer = _.get(result, '[' + element + ']correct', false);
        answer = showCorrectAnswer ? answer : false;
      }
      this.callSetElementClass(htmlInputElement, answer, true, noMoreAttempts, elementType);
    }
  }
  private callSetElementClass(htmlElement, state, disableElement?: boolean, noMoreAttempts?, elementType?) {
    if (htmlElement) {
      this.setElementClass(htmlElement, state);
      if (disableElement) {
        this.disableElements(htmlElement, noMoreAttempts, elementType);
      }
    } else {
      setTimeout(() => {
        this.callSetElementClass(htmlElement, state, disableElement, noMoreAttempts, elementType);
      }, 100);
    }
  }
  private setElementClass(htmlElement, state) {
    let i, className: string, classNames: any;
    classNames = htmlElement.classList.value;
    classNames = classNames ? classNames.split(' ') : [];
    switch (state) {
      case true:
        classNames = this.removeClassName(htmlElement, classNames, 'response-failure');
        htmlElement.classList.value = classNames.join(' ') + ' response-success';
        classNames.push('response-success');
        break;
      case false:
        classNames = this.removeClassName(htmlElement, classNames, 'response-success');
        htmlElement.classList.value = classNames.join(' ') + ' response-failure';
        classNames.push('response-failure');
        break;
      default:
        classNames = this.removeClassName(htmlElement, classNames, 'response-failure');
        classNames = this.removeClassName(htmlElement, classNames, 'response-success');
        htmlElement.classList.value = classNames.join(' ');
        break;
    }
    if (classNames.length > 0) {
      for (i = 0; i < classNames.length; i++) {
        className = classNames[i];
        if (className !== '' && className !== null && className !== undefined) {
          htmlElement.classList.add(className);
        }
      }
    }
  }
  private disableElements(htmlElement, noMoreAttempts, elementType) {
    if (noMoreAttempts) {
      if (this.isDevice && elementType === 'blank') {
        htmlElement.classList.add('mq-disabled');
      } else {
        htmlElement.disabled = true;
      }
    }
  }
  private isValidAnswers(response) {
    if (this.from === 'worksheet') {
      let result = true;
      return result;
    }
    else {
      let result = (response.length === 0) ? false : true;
      for (let i = 0; i < response.length; i++) {
        result = (response[i] !== '') ? false : result;
        if (!result) {
          break;
        }
      }
      return result;
    }
  }
  private removeClassName(htmlElement, classNames, name) {
    const classNameIndex: number = classNames.indexOf(name);
    if (classNameIndex > -1) {
      htmlElement.classList.remove(classNameIndex);
      htmlElement.classList.remove(name);
      delete classNames[classNameIndex];
    }
    return classNames;
  }

  setFirstEmptyElementFocus() {
    let responseElements,
      questionIndex,
      formElements,
      focusSet = false;
    ({ responseElements, questionIndex } = this.getResponseElements());
    formElements = _.keys(responseElements);
    if (formElements.length > 0) {
      for (let i = 0; i < formElements.length; i++) {
        if (!focusSet) {
          focusSet = this.setElementFocus(formElements[i], false);
        }
      }
      if (!focusSet) {
        focusSet = this.setElementFocus(formElements[0], true);
      }
    }
    if (!focusSet) {
      if (this.firstElementFocusCount < 50) {
        setTimeout(() => {
          this.setFirstEmptyElementFocus();
        }, 200);
        this.firstElementFocusCount++;
      } else {
        this.firstElementFocusCount = 0;
      }
    }
  }
  private setElementFocus(element: any, ignoreValue: boolean) {
    let elementValue,
      htmlInputElement,
      questionElement,
      focusSet = false;
    htmlInputElement = <HTMLInputElement>document.getElementById(element);
    questionElement = <HTMLElement>document.getElementsByClassName('question')[0];
    if (htmlInputElement && !htmlInputElement.disabled && questionElement.style.visibility === '') {
      elementValue = this.isDevice ? htmlInputElement.innerText : htmlInputElement.value;
      if (elementValue === '' || ignoreValue) {
        if (this.isDevice) {
          this.setMathQuillFocus(htmlInputElement);
        } else {
          this.setFocus(htmlInputElement);
        }
        focusSet = true;
      }
    }
    return focusSet;
  }
  private setFocus(htmlElement: any) {
    if (htmlElement) {
      htmlElement.focus();
    }
  }
  private setMathQuillFocus(htmlElement: HTMLInputElement) {
    let element;
    if (htmlElement) {
      element = this.mq.MathField(htmlElement, this.mathQuillConfig);
      this.setMathQuillElementFocus(htmlElement, element, true);
    }
  }
  private setMathQuillElementFocus(element: HTMLInputElement, mathQuillElement: any, openKeyboard?: boolean) {
    if (_.indexOf(element.classList, 'mq-disabled') === -1) {
      setTimeout(() => {
        this.setFocus(mathQuillElement);
        if (openKeyboard) {
          element.click();
        }
      }, 500);
    }
  }

  private onCloseSetFocus(status) {
    if (status) {
      setTimeout(() => {
        this.setFirstEmptyElementFocus();
      }, 500);
      this.contentService.setMessageClose(false);
    }
  }
  /* Blank, Dropdown Functions End */

  /* Game, Interaction Functions Start */
  skipContent() {
    this.questionsComponent.skipContent();
  }

  evaluateInteractiveContent() {
    this.contentService.setQuestionSubmit(false);
    this.questionsComponent.evaluateAnswer(null);
  }
  isDisable() {
    return (this.toDisable = true);
  }
  /* Game, Interaction Functions End */

  /* Timed Test Start */
  evaluateTimedTestContent(option?) {
    let questionTemplate: string, sequenceNo;
    this.contentService.setQuestionSubmit(false);
    questionTemplate = _.get(this.timedTestData, 'questionTemplate', '').toLowerCase();
    if (this.questionsComponent.oneOfFormTemplates(questionTemplate)) {
      this.submitFormAnswer();
    } else if (questionTemplate === 'mcq') {
      sequenceNo = _.get(this.timedTestData, 'questionSequenceNo', null);
      this.evaluationResult = this.questionsComponent.evaluateOption(option, sequenceNo);
      this.submitTimedTestQuestion(this.evaluationResult);
    }
  }

  submitTimedTestQuestion(result) {
    let finished;
    finished = _.get(result, 'finished', false);
    if (finished) {
      this.questionsComponent.callSubmitAnswer();
    } else {
      this.questionsComponent.loadNextTimedTestQuestion(result);
    }
  }

  private loadTimerModal() {
    const modal = WorsheetModalComponent;
    if (this.template && this.questionTemplate && this.from) {
      if (!this.startTimer && (this.questionTemplate === 'timedtest' || this.from === 'worksheet')) {
        if (!this.expireTimer) {
          this.sharedService.dismissOpenModal();
          setTimeout(() => {
            this.sharedService.open(modal, ['backDropStop']);
          }, 100);
        }
      }
    } else {
      setTimeout(() => {
        this.loadTimerModal();
      }, 100);
    }
  }
  /* Timed Test End */

  /* MathQuill Keyboard Start */
  refreshLatex() {
    let selectedInput, isKeyboard, i, element, innerLatexMath, allInputs;
    allInputs = _.get(this.keyboardElements, 'allInputs', null);
    if (this.isDevice) {
      if (!allInputs) {
        setTimeout(() => {
          this.refreshLatex();
        }, 200);
      } else {
        selectedInput = _.get(this.keyboardElements, 'selectedInput', null);
        isKeyboard = _.get(this.keyboardElements, 'isKeyboard', null);
        if (selectedInput !== null && isKeyboard) {
          element = document.getElementById(selectedInput);
          innerLatexMath = this.mq.MathField(element, this.mathQuillConfig);
          this.setMathQuillElementFocus(element, innerLatexMath);
          const latex = innerLatexMath.latex();
          this.latexSource = latex;
        } else {
          for (i = 0; i < allInputs.length; i++) {
            element = document.getElementById(allInputs[i]);
            innerLatexMath = this.mq.MathField(element, this.mathQuillConfig);
            if (i === 0) {
              this.setMathQuillElementFocus(element, innerLatexMath);
            }
          }
        }
        this.disableMathQuillTextArea();
      }
    }
  }
  private disableMathQuillTextArea() {
    let i, mathquillFields, mathquillField, textArea;
    mathquillFields = document.querySelectorAll('.mathquill-math-field');
    for (i = 0; i < mathquillFields.length; i++) {
      mathquillField = mathquillFields[i];
      textArea = mathquillField.querySelector('textarea');
      if (textArea && !textArea.readOnly) {
        textArea.readOnly = 'readonly';
        // textArea.mouse
      }
    }
  }

  displayKeyboard() {
    let selectedInput, isKeyboard, element;
    if (this.isDevice) {
      selectedInput = _.get(this.keyboardElements, 'selectedInput', null);
      isKeyboard = _.get(this.keyboardElements, 'isKeyboard', null);
      if (selectedInput !== null && isKeyboard) {
        element = document.getElementById(selectedInput);
        const innerLatexMath = this.mq.MathField(element);
        const latex = innerLatexMath.latex();
        this.latexSource = latex;
        this.getKeyboardButtons();
      }
    }
  }
  getCurrentKeyboard() {
    return this.mathQuillService.getCurrentKeyboard();
  }
  clicked(insert: string) {
    let currentKeyboard,
      selectedInput,
      element,
      insertLower,
      callRefreshLatex = true;
    insertLower = insert.toLowerCase();
    selectedInput = _.get(this.keyboardElements, 'selectedInput', null);
    element = document.getElementById(selectedInput);
    switch (insertLower) {
      case '123':
        this.setKeyboardType('numeric');
        callRefreshLatex = false;
        break;
      case 'abc':
        this.setKeyboardType('alpha');
        callRefreshLatex = false;
        break;
      case 'capslock':
        currentKeyboard = this.mathQuillService.getCurrentKeyboard();
        if (currentKeyboard && currentKeyboard.toLowerCase() === 'alpha') {
          this.setKeyboardType('smallAlpha');
        } else {
          this.setKeyboardType('alpha');
        }
        callRefreshLatex = false;
        break;
      case '⋀':
        this.mq.MathField(element).typedText('^');
        break;
      case 'del':
        this.mq.MathField(element).keystroke('Backspace');
        break;
      case 'space':
        this.mq.MathField(element).typedText(' ');
        break;
      case '←':
        this.mq.MathField(element).keystroke('Backspace');
        // this.mq.MathField(element).keystroke('Shift-Left');
        break;
      case '→':
        this.mq.MathField(element).keystroke('Shift-Right');
        break;
      case 'go':
        this.contentService.setQuestionSubmit(true);
        callRefreshLatex = false;
        break;
      default:
        this.mq.MathField(element).write(insert);
    }
    if (callRefreshLatex) {
      this.refreshLatex();
    }
    this.questionsComponent.checkTimedTestAutoSubmit(selectedInput, null);
    return false;
  }

  setKeyboardType(type, dontGetButtons?: boolean) {
    this.mathQuillService.setCurrentKeyboard(type);
    if (!dontGetButtons) {
      this.getKeyboardButtons();
    }
  }

  getKeyboardButtons() {
    let selectedInput,
      responseElements,
      questionIndex,
      numeric,
      keyboard,
      buttonLatexContents,
      isKeyboardSet = false;
    if (this.question) {
      if (this.isDevice) {
        selectedInput = _.get(this.keyboardElements, 'selectedInput', null);
        if (selectedInput) {
          ({ responseElements, questionIndex } = this.getResponseElements());
          numeric = _.get(responseElements, selectedInput + '.attributes.numeric', false);
          if (numeric) {
            isKeyboardSet = true;
            this.setKeyboardType('numeric', true);
            keyboard = this.mathQuillService.getKeyboard();
            this.keyboardOptions.buttonLatexContents = _.cloneDeep(keyboard);
            if (this.keyboardOptions.buttonLatexContents.length > 0) {
              buttonLatexContents = this.keyboardOptions.buttonLatexContents[1];
              buttonLatexContents.pop();
            }
          }
        }
        if (!isKeyboardSet) {
          keyboard = this.mathQuillService.getKeyboard();
          this.keyboardOptions.buttonLatexContents = _.cloneDeep(keyboard);
        }
      }
    } else {
      setTimeout(() => {
        this.getKeyboardButtons();
      }, 200);
    }
  }

  hideKeyboard() {
    this.questionsComponent.hideKeyboard();
  }
  /* MathQuill Keyboard End */
  private loadSparkieAlertModal() {
    const modal = SparkieAlertsComponent;
    if (this.noRewardAlertFlag == true && this.contentSubMode != 'learn') {
      this.sharedService.dismissOpenModal();
      setTimeout(() => {
        this.sharedService.open(modal, ['backDropStop']);
      }, 100);
    } else {
      setTimeout(() => {
        this.loadSparkieAlertModal();
      }, 100);
    }
  }
}
