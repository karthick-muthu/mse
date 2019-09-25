import { Component, HostListener, Inject, NgZone, OnDestroy, OnInit, Input, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { TranslateService } from 'ng2-translate';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../environments/environment';
import { WorksheetsService } from '../../../modules/worksheets/services/worksheets.service';
import { AppMessageSettings } from '../../../settings/app.messages';
import { AppSettings } from '../../../settings/app.settings';
import { ContentService } from '../../services/content/content.service';
import { SharedService } from '../../shared.service';
import { QuestionsService } from './questions.service';
import { SessionReportModalComponent } from './session-report/session-report-modal/session-report-modal.component';
import { WorsheetModalComponent } from './worsheet-modal/worsheet-modal.component';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'ms-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy {
  @ViewChild('timeoutWorksheetModal') timeoutWorksheetModal;
  @Input('showContentPreview') showContentPreview;

  private thisQuestion: any;
  private nextQuestion: any;
  private contentManipulation: any = null;
  private questionInitiate: any;
  private questionIndex: number;
  private timeTestIndex: number;
  private questionService: any;
  private formTemplates: string[];
  private iframeTemplates: string[];
  private allowedModes: string[];
  private contentDetails: any;
  private contentResponse: any;
  private allowEnter: boolean;
  private hideIDKButton: boolean;
  private timedtestKeyDownCheck: any;
  private translationContent: any;
  private keyboardElements: any;
  private isQuestionsPage: boolean;
  private getTemplateService: Subscription;
  private getMessagesService: Subscription;
  private getQuestionContentService: Subscription;
  private getFetchFirstContentService: Subscription;
  private getQuestionSubmitService: Subscription;
  private getTimerValueService: Subscription;
  private getRestartTimerService: Subscription;
  private getTranslationContentService: Subscription;
  private getKeyboardElementsService: Subscription;
  private getQuestionDataService: Subscription;
  startWorksheetValue: any;
  endTime: any;
  blockNext: any;
  remainingTime: any;
  worksheetResult: any;
  contentId: string;
  contentType: string;
  template: string;
  templateClass: string;
  headerContent: any;
  templateContent: any;
  topicTrailHeaderData: string;
  displayContent: any;
  displayMessages: any;
  evaluationResult: any;
  errorInfo: any;
  from: any;
  initializeQuestionContent: boolean;
  selectedInput: string;
  isDevice: boolean;
  isKeyboard: boolean;
  quesNum: any;
  isOpenedFirstTime: any;
  isEncryptionEnabled: boolean;
  contentParams: any;
  screenHeight: number;
  screenWidth: number;
  isMobile: boolean = false;
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 576) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }
  constructor(private questionsService: QuestionsService, private contentService: ContentService, private sharedService: SharedService,
    private router: Router, private activatedRoute: ActivatedRoute, private _ngZone: NgZone, @Inject(DOCUMENT) private document: Document, private translate: TranslateService,
    private worksheetsService: WorksheetsService) {
    this.getScreenSize();
    this.isQuestionsPage = true;
    this.contentService.setTileCalledFrom('questions');
    this.sharedService.setSiteTitle('Questions');
    this.iframeTemplates = AppSettings.IFRAMETEMPLATES;
    this.formTemplates = AppSettings.FORMTEMPLATES;
    this.allowedModes = AppSettings.ALLOWED_MODES;
    this.getTemplateService = this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
        this.sharedService.setBodyClass(null, ['questions']);
      },
      responseError => this.errorInfo = responseError
    );
    this.getMessagesService = this.contentService.getMessages().subscribe(
      result => this.displayMessages = result.messages,
      responseError => this.errorInfo = responseError
    );
    this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(
      result => {
        this.contentDetails = _.cloneDeep(result);
        this.from = result.from;
        this.topicTrailHeaderData = 'from';
      },
      responseError => this.errorInfo = responseError
    );
    this.getFetchFirstContentService = this.contentService.getFetchFirstContent().subscribe(
      result => {
        if (result.fetch) {
          this.callFetchFirstContent();
        }
      }
    );
    this.getQuestionSubmitService = this.contentService.getQuestionSubmit().subscribe(
      result => {
        if (result.submit) {
          this.callSkipContent();
        }
      },
      responseError => this.errorInfo = responseError
    );
    this.getTimerValueService = this.contentService.getTimerValue().subscribe(
      result => {
        this.blockNext = _.get(result, 'worksheetValue', '');
        this.endTime = _.get(result, 'endTimer', '');
        if (this.endTime === 1) {
          this.stopTimedTestContent();
        }
      }
    );
    this.getRestartTimerService = this.contentService.getRestartTimer().subscribe(
      result => {
        if (result.state) {
          setTimeout(() => this.restartTimer(), 1000);
        }
      }
    );
    this.getTranslationContentService = this.contentService.getTranslationContent().subscribe(
      result => this.translationContent = result,
      responseError => this.errorInfo = responseError
    );
    this.getKeyboardElementsService = this.contentService.getKeyboardElements().subscribe(
      result => this.keyboardElements = result,
      responseError => this.errorInfo = responseError
    );
    this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(
      result => {
        this.quesNum = _.get(result, 'contentSeqNum', '');
      }
    );
    this.exposeAngularComponent();
    this.sharedService.getAndClearCookies();
  }

  private exposeAngularComponent() {
    window['angularComponent'] = {
      validateNumeric: (elementId, event) => this.checkNumeric(elementId, event),
      detectTimedTestAutoSubmit: (elementId, event) => this.checkTimedTestAutoSubmit(elementId, event),
      saveDataCallBack: (result) => this.saveActivityCallBack(result),
      completeDataCallBack: (result) => this.completeActivityCallBack(result),
      setResultCallback: (result) => this.setInteractiveCallBack(result),
      setErrorLogCallback: (result) => this.setErrorLogCallBack(result),
      displayKeyboard: (id) => this.displayKeyboard(id),
      zone: this._ngZone,
      component: this
    };
  }

  ngOnInit() {
    if (this.showContentPreview) {
      this.sharedService.setSiteTitle('Content Preview');
    }
    this.callLoadJS();
    this.checkIsDevice();
  }

  ngOnDestroy() {
    this.isQuestionsPage = false;
    this.getTemplateService.unsubscribe();
    this.getMessagesService.unsubscribe();
    this.getQuestionContentService.unsubscribe();
    this.getFetchFirstContentService.unsubscribe();
    this.getQuestionSubmitService.unsubscribe();
    this.getTimerValueService.unsubscribe();
    this.getRestartTimerService.unsubscribe();
    this.getTranslationContentService.unsubscribe();
    this.getKeyboardElementsService.unsubscribe();
    this.contentService.setMathJaxClear(true);
  }

  /* Common Functions Start */
  @HostListener('document:keydown', ['$event'])
  private keydown(event: KeyboardEvent) {
    let submitQuestion: boolean, finished: boolean, autoSubmit: boolean, template: string, replaceAction = false,
      isOverlay = false, where: string, messageText: string, key: any, keyCode: number;
    const noMoreAttempts = _.get(this.evaluationResult, 'noMoreAttempts', false);
    key = _.get(event, 'key', '');
    key = (typeof (key) === 'string') ? key.toLowerCase() : key;
    keyCode = _.get(event, 'keyCode', null);
    let messages: any = _.get(this.displayContent, 'messages', {}); // [0].beforeSubmit.where
    messages = _.values(messages);
    messages.forEach(message => {
      where = _.get(message, 'beforeSubmit.where', '').toLowerCase();
      messageText = _.get(message, 'beforeSubmit.messages.default', '');
      if (where === 'overlay' && messageText !== '') {
        isOverlay = true;
      }
    });
    if (this.allowEnter && (key === 'enter' || keyCode === 13) && !isOverlay) {
      if (!noMoreAttempts) {
        submitQuestion = false;
        if (this.templateContent === 'timedtest') {
          finished = _.get(this.questionService, 'userAttemptInfo.finished', false);
          autoSubmit = _.get(this.displayContent, 'autoSubmit', false);
          template = _.get(this.questionService, 'childObjects[' + this.timeTestIndex + '].template', '').toLowerCase();
          if (!finished && !autoSubmit && this.oneOfFormTemplates(template)) { submitQuestion = true; }
        } else if (this.oneOfFormTemplates(this.templateContent)) {
          submitQuestion = true;
        }
        if (submitQuestion) {
          this.contentService.setQuestionSubmit(true);
          replaceAction = true;
        }
      } else {
        this.updateAnswer();
        replaceAction = true;
      }
      if (replaceAction) {
        event.preventDefault();
      }
    }
  }

  private callFetchFirstContent() {
    //this.from = _.get(this.contentDetails, 'from', '').toLowerCase();
    if (this.showContentPreview) {
      let data = this.contentDetails;
      data.from = 'topic';
      this.contentService.setQuestionContent(data);
    }
    if (this.from !== '') {
      this.resetQuestionService();
      this.resetTimedTestContent();
      // this.contentService.setMathJaxClear(true);
      this.fetchFirstContent();
    } else {
      setTimeout(() => { this.callFetchFirstContent(); }, 200);
    }
  }

  private callLoadJS() {
    this.loadJS().then(
      result => {
        if (result.result !== 'failed') {
          this.contentService.setFetchFirstContent(true);
        } else {
          this.callLoadJS();
        }
      },
      responseError => this.errorInfo = responseError
    );
  }

  private loadJS(): Promise<any> {
    const response = { result: 'failed' };
    if (typeof (window['ContentService']) === 'undefined') {
      const appBaseURL = _.get(environment, 'appBaseURL', '');
      const dynamicScripts = [appBaseURL + 'assets/js/contentService.js?v=' + environment.releaseVersion];
      try {
        for (let i = 0; i < dynamicScripts.length; i++) {
          const node = document.createElement('script');
          node.src = dynamicScripts[i];
          node.type = 'text/javascript';
          node.async = false;
          node.charset = 'utf-8';
          document.getElementsByTagName('head')[0].appendChild(node);
        }
        response.result = 'success';
      } catch (error) { }
    } else {
      response.result = 'loaded';
    }
    return Promise.resolve(response);
  }

  useHint() {
    return this.questionService.hintsTaken();
  }

  setDefaultNull(content) {
    return (content) ? content : null;
  }

  private setErrorLogCallBack(errorLog) {
    const data = this.getErrorLogData(errorLog);
    this.questionsService.contentErrorLog(data).subscribe(
      result => {
        const status = this.contentService.validateResponse(result, {});
        this.sharedService.handleUnexpectedResponse(status);
        if (status === 'redirect') {
          this.handleContentError(result);
        }
      },
      responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
    );
  }
  private getErrorLogData(errorLog) {
    let fileSrc, fileName: any, data: any;
    fileSrc = _.get(errorLog, 'src', '');
    fileName = this.getFileName(fileSrc);
    data = {
      'contentID': _.get(errorLog, 'contentID', ''),
      'contentType': _.get(this.displayContent, 'contentType', ''),
      'typeErrorLog': _.get(errorLog, 'typeErrorLog', '')
    };
    if (data.typeErrorLog.toLowerCase() === 'imagenotloading') {
      data.imageName = fileName;
      data.imagePath = fileSrc;
    } else if (data.typeErrorLog.toLowerCase() === 'iframenotloading') {
      data.iframeName = fileName;
      data.iframePath = fileSrc;
    }
    return data;
  }
  private getFileName(src) {
    let fileName = (src) ? src.split('?') : [];
    fileName = (fileName[0]) ? fileName[0] : '';
    fileName = fileName.substring(fileName.lastIndexOf('/') + 1);
    return fileName;
  }
  /* Common Functions End */

  /* Common Question Initialization Start */
  fetchFirstContent(data?: any) {
    this.sharedService.showLoader();
    this.allowEnter = false;
    this.questionIndex = 0;
    this.timeTestIndex = 0;
    this.contentService.setFetchFirstContent(false);
    data = (typeof (data) === 'undefined') ? {} : data;
    if (this.showContentPreview) {
      let getData;
      this.activatedRoute.queryParams.subscribe(res => {
        getData = res;
      });
      if (getData) {
        this.questionsService.fetchContentPreview(getData).subscribe(
          result => {
            if (this.from === 'worksheet') {
              this.worksheetResult = _.cloneDeep(result);
            }
            const status = this.contentService.validateResponse(result, {});
            this.sharedService.handleUnexpectedResponse(status, 'home');
            if (status === 'success') {
              this.contentService.setTemplate(result);
              this.contentService.setBasicData(result);
              this.initContentService(result);
            } else if (status === 'redirect') {
              this.handleContentError(result);
            }
            this.sharedService.hideLoader();
          },
          responseError => {
            this.contentService.setUnexpectedError('unexpected');
            this.errorInfo = this.sharedService.handleResponseError(responseError, 'questions', 'home');
          }
        );
      }
    } else {
      this.questionsService.fetchFirstContent(data).subscribe(
        result => {
          if (this.from === 'worksheet') {
            this.worksheetResult = _.cloneDeep(result);
            this.isEncryptionEnabled = _.get(result, 'isEncryptionEnabled', false);
          }
          const status = this.contentService.validateResponse(result, {});
          this.sharedService.handleUnexpectedResponse(status, 'home');
          if (status === 'success') {
            this.contentService.setTemplate(result);
            this.contentService.setBasicData(result);
            this.initContentService(result);
          } else if (status === 'redirect') {
            this.handleContentError(result);
          }
          this.sharedService.hideLoader();
        },
        responseError => {
          this.contentService.setUnexpectedError('unexpected');
          this.errorInfo = this.sharedService.handleResponseError(responseError, 'questions', 'home');
        }
      );
    }
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
  }

  private handleContentError(response) {
    this.contentResponse = null;
    const data = _.get(response, 'redirectionData', {});
    if (!_.isEmpty(data)) {
      if (this.from === 'worksheet') {
        this.contentService.setExpireWorksheetTime(true);
      } else {
        this.closeContent(data);
      }
    }
  }

  closeContent(data) {
    if (this.showContentPreview) {
      return;
    } else {
      this.sharedService.showLoader();
      this.questionsService.closeContent(data).subscribe(
        contentResult => {
          this.setQuestionTopicIdData(contentResult);
          this.topicSessionReport(contentResult);
        },
        responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
      );
    }
  }

  quitTopicHigherLevel() {
    if (this.showContentPreview) {
      return;
    } else {
      this.questionsService.quitTopicHigherLevel().subscribe(
        contentResult => {
          this.setQuestionTopicIdData(contentResult);
          this.topicSessionReport(contentResult);
        },
        responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
      );
    }
  }

  private topicSessionReport(contentResult: any) {
    const status = this.contentService.validateResponse(contentResult, {});
    this.sharedService.handleUnexpectedResponse(status, 'home');
    if (status === 'redirect') {
      const code = _.get(contentResult, 'redirectionCode', '').toLowerCase();
      const redirectionData = _.get(contentResult, 'redirectionData', null);
      if (redirectionData) {
        if (code === 'topicsessionreport') {
          this.sharedService.open(SessionReportModalComponent, ['backDropStop']);
        } else {
          this.sharedService.hideLoader();
          this.contentService.contentPageRedirect(contentResult);
        }
      }
    }
  }

  /**
   * Initialize Content Service.
   *
   * @param content any
   */
  private initContentService(content) {
    if (window['ContentService']) {
      this.contentManipulation = window['ContentService'];
      this.setQuestionsContent(content);
    } else {
      setTimeout(() => this.initContentService(content), 200);
    }
  }

  /**
   * Set all the Question Content prameters that are required.
   *
   * @param content any
   */
  private setQuestionsContent(content) {
    this.hideIDKButton = false;
    if (this.contentManipulation) {
      this.thisQuestion = _.cloneDeep(content);
      this.contentId = _.get(content, 'contentData.contentId', '');
      this.contentType = _.get(content, 'contentData.contentType', '');
      this.evaluationResult = {};
      const data = _.get(content, 'contentData.data', {});
      if (!_.isEmpty(data)) {
        this.initializeQuestionContent = this.doInitializeQuestionContent();
        if (this.initializeQuestionContent) {
          this.questionInitiate = new this.contentManipulation(data);
          this.questionService = this.questionInitiate[this.questionIndex];
        }
        this.headerContent = this.setHeaderContent(content);
        this.contentService.setHeaderContent(this.headerContent.pedagogyContentLeft);
        this.templateContent = this.questionService.getTemplate();
        this.templateContent = this.templateContent.toLowerCase();
        this.displayContent = this.generateDisplayContent(content);
        this.contentService.setQuestionDisplayContent(this.displayContent);
        this.setTimedTestContent(content, this.from.toLowerCase());
        this.setQuestionContentServiceData(content, false);
        this.questionService.startContentTimer();
        if (this.oneOfIframeTemplates(this.templateContent)) {
          if (this.templateContent === 'interactive') {
            this.questionService.setResultCallback(window['angularComponent'].setResultCallback);
          } else {
            this.questionService.setSaveDataCallback(window['angularComponent'].saveDataCallBack);
            this.questionService.setCompleteCallback(window['angularComponent'].completeDataCallBack);
          }
        }
        this.contentManipulation.setErrorLogCallback(window['angularComponent'].setErrorLogCallback);
      }
      this.openTopicProgress();
      this.allowEnter = true;
      this.contentService.setNextWorksheetSequence(_.get(content, 'contentData.contentSeqNum', 1));
      this.contentParams = _.get(content, 'contentData.contentParams', []);
      setTimeout(() => {
        this.exposeAngularComponent();
      }, 200);
    } else {
      setTimeout(() => this.setQuestionsContent(content), 200);
    }
  }
  doInitializeQuestionContent() {
    let status = true;
    if (this.templateContent && this.templateContent === 'timedtest' &&
      !isNaN(this.endTime) && this.endTime !== null && this.endTime >= 0) {
      status = _.get(this.questionService, 'userAttemptInfo.finished', false);
    }
    return (status || !this.questionService);
  }

  setQuestionContentServiceData(content, setContentAttempted?: boolean) {
    let name = '';
    this.isOpenedFirstTime = _.get(content, 'contentHeaderInfo.isOpenedFirstTime', false);
    if (this.from === 'worksheet' && !this.isOpenedFirstTime) {
      this.startWorksheet();
    }
    if (this.isOpenedFirstTime) {
      this.loadTimerModal();
    }
    const questionContent = _.cloneDeep(this.contentDetails);
    setContentAttempted = (setContentAttempted) ? setContentAttempted : false;
    if (!setContentAttempted) {
      questionContent.context = _.get(content, 'userInformation.language', '');
      questionContent.grade = _.get(content, 'userInformation.grade', '');
      questionContent.header = this.headerContent;
      questionContent.attemptNumber = _.get(content, 'contentHeaderInfo.attemptNumber', '');
      questionContent.noRewardAlertFlag = _.get(content, 'noRewardAlertFlag', '');
      questionContent.contentSeqNum = _.get(content, 'contentData.contentSeqNum', '');
      questionContent.contentType = _.get(content, 'contentData.contentType', '');
      questionContent.contentMode = _.get(content, 'contentData.contentMode', '');
      questionContent.contentSubMode = _.get(content, 'contentData.contentSubMode', '');
      questionContent.revisionNo = _.get(content, 'contentData.data.[' + this.questionIndex + '].revisionNo', '').toString();
      questionContent.isDynamic = _.get(content, 'contentData.data.[' + this.questionIndex + '].isDynamic', '');
      questionContent.displayMessages = _.get(content, 'contentHeaderInfo.pedagogyMessages', '');
      questionContent.dynamicParameters = _.get(content, 'contentData.data.[' + this.questionIndex + '].dynamicParameters', '');
      questionContent.isFavourite = false;
      if (this.oneOfFormTemplates(this.templateContent) || this.templateContent === 'mcq' ||
        this.templateContent === 'interactive') {
        name = _.get(content, 'contentHeaderInfo.pedagogyChild.name', '');
      } else if (this.oneOfIframeTemplates(this.templateContent) && this.templateContent.toLowerCase !== 'interactive') {
        name = _.get(content, 'contentData.data.[' + this.questionIndex + '].name', '');
      } else if (this.templateContent === 'timedtest') {
        name = _.get(content, 'contentData.data.[' + this.questionIndex + '].title', '');
      }
      questionContent.contentName = name;
      questionContent.templateContent = this.templateContent;
      questionContent.hasTranslation = _.get(content, 'contentData.contentTranslationFlag', false);
      questionContent.timedTestData = this.getTimedTestHeaderData();
      this.setTranslationContentServiceData(content, questionContent.hasTranslation);
    }
    questionContent.contentId = this.contentId;
    questionContent.conceptID = _.get(content, 'contentHeaderInfo.pedagogyChild.id', '');
    questionContent.contentAttempted = setContentAttempted;
    this.contentService.setVoiceOverDisabled(setContentAttempted);
    // if (!environment.production) { console.log('newQuestionContent', questionContent); }

    this.contentService.setQuestionContent(questionContent);
  }

  loadTimerModal() {
    const modal = WorsheetModalComponent;
    setTimeout(() => { this.sharedService.open(modal, ['backDropStop']); });
  }

  setQuestionTopicIdData(content) {
    const questionContent = _.cloneDeep(this.contentDetails);
    // if (!environment.production) { console.log('oldQuestionContent', questionContent); }
    let topicId = _.get(content, 'redirectionData.ID', '');
    if (topicId === '') {
      topicId = _.get(content, 'redirectionData.topicID', '');
    }
    questionContent.topicID = topicId;
    // if (!environment.production) { console.log('newQuestionContent', questionContent); }
    this.contentService.setQuestionContent(questionContent);
  }

  /**
   * Get Display Object from ContentService and get various
   * other paramenter that are required to display Questions.
   *
   * @param content any
   * @returns any
   */
  generateDisplayContent(content) {
    let userAttemptData, displayContent;
    displayContent = this.questionService.getDisplayObject();
    displayContent.showHint = (displayContent.hint) ? true : false;
    displayContent.contentType = this.contentType;
    displayContent.sequence = _.get(content, 'contentData.contentSeqNum', '');
    displayContent.mode = _.get(content, 'contentData.contentMode', '');
    displayContent.messages = this.getDisplayMessages(content);
    displayContent.permittedNavs = this.setPermittedNav(content);
    displayContent.timedTestData = this.getTimedTestHeaderData();
    displayContent.template = (displayContent.template) ? displayContent.template : this.templateContent;
    if (this.from === 'worksheet') {
      userAttemptData = _.get(content, 'contentData.contentParams.userAttemptData', null);
      if (userAttemptData) {
        displayContent.userAnswer = this.questionService.getUserAnswer(userAttemptData);
      } else {
        displayContent.userAnswer = null;
      }
    }
    displayContent = this.reformDisplayContent(displayContent);
    return displayContent;
  }

  /**
   * Changing the question display content so as to show all
   * types of questions in the section.
   *
   * @param displayContent any
   * @returns any
   */
  private reformDisplayContent(displayContent, translationDisplay?: boolean) {
    let outputQuestion = '', question = '', template = '', blocked = '';
    translationDisplay = (translationDisplay) ? translationDisplay : false;
    const questionPattern = new RegExp(/\[[a-zA-Z0-9_]+\]/g);
    if (this.templateContent === 'timedtest') {
      question = _.get(displayContent, 'questions[' + this.timeTestIndex + '].question', '');
      template = _.get(displayContent, 'questions[' + this.timeTestIndex + '].template', '').toLowerCase();
    } else {
      question = _.get(displayContent, 'question', '');
      template = this.templateContent;
    }
    const tempArray: any[] = question.split(questionPattern);
    const matches = question.match(questionPattern);
    if (template === 'blank' || template === 'blank_dropdown') {
      if (!translationDisplay) {
        this.setInputKeyboardElements(displayContent, matches);
      }
    } else {
      this.unsetKeyboardElements();
    }
    for (let i = 0; i < tempArray.length; i++) {
      outputQuestion += tempArray[i] + this.generateElement(displayContent, matches, i, translationDisplay);
    }
    blocked = (translationDisplay) ? ' blocked' : '';
    outputQuestion = outputQuestion.replace(/<iframe/g, '<div class="block-iframe-parent">' +
      '<div class="block-iframe' + blocked + '"></div><iframe');
    outputQuestion = outputQuestion.replace(/<\/iframe>/g, '</iframe></div>');
    displayContent.questionField = outputQuestion;
    // if (!environment.production) { console.log('displayContent', displayContent); }
    return displayContent;
  }

  /**
   * Generate the question elements in case of
   *    ► Blank
   *    ► Dropdown
   *
   * @param displayContent any
   * @param matches string[]
   * @param i number
   * @returns string
   */
  private generateElement(displayContent, matches, i, translationDisplay) {
    let match, userAnswer: any, ques_resp, attributes, ques_type, choices, isDevice,
      userAnswerValue = '', selected = '', keyDown = '', param = '', element = '', options = '';
    const directAttributes = ['style', 'size', 'maxlength'];
    const elementWrapper = { 'start': '', 'end': '' };
    if (matches && matches[i]) {
      isDevice = this.isDevice;
      match = matches[i].substr(1, (matches[i].length - 2));
      if (this.templateContent === 'timedtest') {
        ques_resp = _.get(displayContent, 'questions[' + this.timeTestIndex + '].responseElements.' + match, {});
      } else {
        ques_resp = _.get(displayContent, 'responseElements.' + match, {});
      }
      ques_type = _.get(ques_resp, 'type', '');
      if (ques_type.toLowerCase() !== 'blank') {
        userAnswer = _.get(displayContent, 'userAnswer.userAnswer', null);
        userAnswer = (userAnswer !== null) ? userAnswer.split(',') : [];
      } else {
        userAnswer = _.get(displayContent, 'userAnswer.userAnswer', null);
      }
      attributes = _.get(ques_resp, 'attributes', {});
      /* Set attributes for the element */
      param = 'id="' + match + '" name="' + match + '"';
      _.forEach(attributes, function (value: any, key: any) {
        switch (key.toLowerCase()) {
          case 'style':
          case 'maxlength':
            param += ' ' + key.toLowerCase() + '="' + value + '"';
            break;
          case 'size':
            if (isDevice) {
              param += ' style="width:' + (value * 11) + 'px"';
            } else {
              param += ' ' + key.toLowerCase() + '="' + value + '"';
            }
            break;
          case 'texttype':
            elementWrapper.start = '<' + value + '>';
            elementWrapper.end = '</' + value + '>';
            break;
          case 'numeric':
            keyDown = 'angularComponent.validateNumeric(' + match + ', event);';
            break;
        }
      });
      /* Set choices for select */
      choices = _.get(ques_resp, 'choices', []);
      if (ques_type.toLowerCase() !== 'blank') {
        userAnswerValue = (userAnswer[i]) ? userAnswer[i] : '';
        _.forEach(choices, function (choice: any, key: any) {
          options = (options === '') ? '<option value="">Select</option>' : options;
          selected = (userAnswerValue.toString() === choice.value.toString()) ? ' selected="selected"' : '';
          options += '<option value="' + choice.id + '"' + selected + '>' + choice.value + '</option>';
        });
      }
      switch (ques_type.toLowerCase()) {
        case 'blank':
          keyDown += (keyDown === '') ? '' : ' ';
          keyDown += 'angularComponent.detectTimedTestAutoSubmit(' + match + ', event)';
          param += ' onkeydown="' + keyDown + '"';
          if (translationDisplay) {
            param = 'disabled';
          }
          if (isDevice) {
            param += (!_.includes(param, 'style="width')) ? ' style="width:99px"' : '';
            element = `<div class="mathquill-editor">
                <div ` + param + ` onClick="angularComponent.displayKeyboard(` + match + `)" class="mathquill-math-field">`
              + userAnswerValue + `</div></div>`;
          } else {
            param += (!_.includes(param, 'size')) ? ' size="9"' : '';
            if (userAnswer) {
              element = '<input type="text" ' + param + ' value="' + userAnswer[match].userAnswer + '"' +
                ' autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">';
            } else {
              element = '<input type="text" ' + param + ' value=""' +
                ' autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">';
            }
          }
          break;
        case 'dropdown':
          param += ' onchange = "angularComponent.detectTimedTestAutoSubmit(' + match + ', event)"';
          if (translationDisplay) {
            param = 'disabled';
          }
          element = '<select ' + param + '>' + options + '</select>';
          break;
      }
    }
    element = elementWrapper.start + element + elementWrapper.end;
    return element;
  }

  /**
   * Set the header details for the question
   *
   * @param result any
   * @returns any
   */
  private setHeaderContent(result) {
    let pedagogyContent = { pedagogyContentLeft: {}, pedagogyContentRight: {} };
    if (result.contentHeaderInfo) {
      pedagogyContent = {
        pedagogyContentLeft: {
          id: _.get(result, 'contentHeaderInfo.pedagogyID', null),
          type: _.get(result, 'contentHeaderInfo.pedagogyType', null),
          name: _.get(result, 'contentHeaderInfo.pedagogyName', null),
          progress: _.get(result, 'contentHeaderInfo.pedagogyProgress', null),
          higherLevelStatus: _.get(result, 'contentHeaderInfo.pedagogyHigherLevelStatus', null),
          pedagogyMessages: _.get(result, 'contentHeaderInfo.pedagogyMessages', [])
        },
        pedagogyContentRight: {
          id: _.get(result, 'contentHeaderInfo.pedagogyID', null),
          child: _.get(result, 'contentHeaderInfo.pedagogyChild', null),
          sparkie: _.get(result, 'contentHeaderInfo.rewardInfo.sparkie', null),
          progress: _.get(result, 'contentHeaderInfo.pedagogyProgress', null),
          higherLevelStatus: _.get(result, 'contentHeaderInfo.pedagogyHigherLevelStatus', null),
          contentMode: _.get(result, 'contentData.contentMode', 'regular'),
          type: _.get(result, 'contentData.contentType', ''),
          timedTestData: this.getTimedTestHeaderData()
        }
      };
    }
    return pedagogyContent;
  }

  private getTimedTestHeaderData() {
    const contentType: string = this.questionService.getContentType().toLowerCase();
    let timedTestData: any = {};
    /* This sections is for Timed Test - Start */
    if (contentType === 'group') {
      timedTestData = {
        'questionSequenceNo': this.timeTestIndex,
        'questionTemplate': _.get(this.questionService, 'childContents[' + this.timeTestIndex + '].template', '').toLowerCase(),
        'totalAttempts': _.get(this.questionService, 'totalAttempts', ''),
        'totalCorrect': _.get(this.questionService, 'totalCorrect', ''),
        'totalQuestions': _.get(this.questionService, 'totalQuestions', '')
      };
    }
    /* This sections is for Timed Test - End */
    // if (!environment.production) { console.log(timedTestData); }
    return timedTestData;
  }

  private setPermittedNav(result) {
    const permittedNav = _.get(result, 'permittedNavs', '');
    return { showFavorites: _.get(permittedNav, 'myFavourities', false), showComment: _.get(permittedNav, 'message', false) };
  }

  private openTopicProgress() {
    if (this.allowTopicProgress()) {
      this.contentService.setOpenTransition(true);
    }
  }
  private allowTopicProgress() {
    const pedagogyMessages: any = _.get(this.headerContent, 'pedagogyContentLeft.pedagogyMessages', []);
    const contentSubMode: any = _.get(this.contentDetails, 'contentSubMode', '');
    return (this.initializeQuestionContent &&
      _.indexOf(pedagogyMessages, 'startPedagogyChild') > -1 &&
      _.indexOf(this.allowedModes, contentSubMode) > -1);
  }

  getQuestionBodyHeight(displayType: string) {
    let height = 0;
    const header = document.getElementById('questionHeader');
    const timer = document.getElementById('questionTimer');
    const footer = document.getElementById('questionFooter');
    height += (header) ? header.offsetHeight : 0;
    if (displayType === 'halfwidth') {
      height += (timer) ? timer.offsetHeight : 0;
    }
    if (window.innerHeight > 615) {
      height += (footer) ? footer.offsetHeight : 0;
    }
    // if (document.getElementById('questionAlert') !== null) { height += document.getElementById('questionAlert').offsetHeight + 40; }
    return height;
  }

  oneOfFormTemplates(template) {
    return (_.indexOf(this.formTemplates, template.toLowerCase()) >= 0);
  }

  oneOfIframeTemplates(template) {
    return (_.indexOf(this.iframeTemplates, template.toLowerCase()) >= 0);
  }

  addToFavourities() {
    const contentInfo = this.questionService.getContentInfo();
    contentInfo.dynamicParameters = this.contentDetails.dynamicParameters;
    const data = {
      topicID: this.contentDetails.topicID,
      conceptID: this.contentDetails.conceptID,
      contentInfo: contentInfo
    };
    if (this.showContentPreview) {
      return;
    } else {
      this.questionsService.addToFavourities(data).subscribe(
        result => {
          const status = this.contentService.validateResponse(result, data);
          this.sharedService.handleUnexpectedResponse(status);
          if (status === 'success') {
            console.log('added content to favorites');
          }
        },
        responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
      );
    }
  }

  resetQuestionService() {
    this.unsetKeyboardElements();
  }
  /* Common Question Initialization End */

  /* Common Submit Start */
  private checkEvaluationResult(result: any) {
    const resultState: any = result.result;
    if ((resultState === false || resultState !== 'correct') && !result.noMoreAttempts) {
      const alertMessage = _.get(result, 'alertMessage', '');
      const errorMessage = (resultState === 'unattempted') ? 'empty' : 'result_error';
      this.showValidationAlerts([errorMessage], alertMessage);
    }
  }

  evaluateAnswer(answer, sequenceNo?: number) {
    answer = (answer !== null) ? JSON.stringify(answer) : answer;
    if (sequenceNo !== (undefined && null && '')) {
      this.evaluationResult = this.questionService.evaluateAnswer(answer, sequenceNo);
    } else {
      this.evaluationResult = this.questionService.evaluateAnswer(answer);
    }
    this.updateMessages();
    return this.evaluationResult;
  }

  callSubmitAnswer(submitData?: any) {
    this.setQuestionContentServiceData(this.thisQuestion, true);
    if (typeof (submitData) === 'undefined') {
      submitData = this.questionService.getSubmitData();
    } else {
      this.hideIDKButton = true;
    }
    if (this.templateContent === 'timedtest') {
      this.updateTimedTestData();
    }
    submitData.contentSeqNum = this.getSequenceNumber();
    submitData.mode = _.get(this.contentDetails, 'mode', '');
    submitData.contentSubMode = _.get(this.contentDetails, 'contentSubMode', '');
    this.disableIframes();
    if (this.templateContent === 'timedtest') {
      this.callTimedTestAnswerAction();
    }
    if (this.oneOfIframeTemplates(this.templateContent) && this.templateContent !== 'interactive') {
      this.callActivitySubmitAnswerAction();
    }
    if (this.showContentPreview) {
      return;
    } else {
      this.questionsService.submitAnswer(submitData).subscribe(
        result => {
          this.contentResponse = result;
          this.handleSubmitAnswerResponse(result, submitData);
        },
        responseError => {
          this.contentService.setUnexpectedError('unexpected');
          this.errorInfo = this.sharedService.handleResponseError(responseError, 'questions', 'home');
        }
      );
    }
  }

  callSubmitWorksheet(nextSequence?: any, remainingTime?: any) {
    let getFromWorksheetService = this.contentService.getFromWorksheet().subscribe(result => {
      if (result.from !== 'done'
        // && result.from !== 'timeout'
      ) {
        this.sharedService.showLoader();
      }
    });
    getFromWorksheetService.unsubscribe();
    this.thisQuestion.contentHeaderInfo.isOpenedFirstTime = false;
    this.setQuestionContentServiceData(this.thisQuestion, true);
    const submitData = this.questionService.getSubmitData();
    submitData.contentSeqNum = _.get(this.worksheetResult, 'contentData.contentSeqNum', '');
    submitData.remainingTime = _.get(this.worksheetResult, 'contentHeaderInfo.remainingTime', '');
    if (remainingTime != null) {
      submitData.remainingTime = remainingTime;
    }
    if (typeof (nextSequence) !== 'undefined') {
      submitData.nextContentSeqNum = nextSequence;
    }
    this.disableIframes();
    let blankeys = Object.keys(submitData.userResponse);
    let blankCount = 0
    for (let i = 0; i < blankeys.length; i++) {
      if (submitData.userResponse[blankeys[i]].userAnswer === "" && submitData.contentInfo.questionType == 'Blank') {
        blankCount = blankCount + 1;
      }
    }
    if (submitData.contentInfo.questionType == 'Blank' && this.contentParams.userAttemptData.length == 0 && blankeys.length == blankCount) {
      submitData.result = "unAttempted";
      submitData.userAttemptData = {};
      submitData.userResponse = {};
    }

    if (this.isEncryptionEnabled) { // encoding result

      submitData.result = btoa(submitData.result);

      if (typeof (submitData.userAttemptData.trials) != 'undefined' &&
        typeof (submitData.userAttemptData.trials[0]) != 'undefined' &&
        typeof (submitData.userAttemptData.trials[0].result) != 'undefined') {
        submitData.userAttemptData.trials[0].result = btoa(submitData.userAttemptData.trials[0].result);
      }
    }



    if (this.showContentPreview) {
      return;
    } else {
      let submitWorksheetService = this.questionsService.submitWorksheetQuestion(submitData).subscribe(
        result => {
          this.contentResponse = result;
          let attemptedQuestions = this.contentResponse.contentHeaderInfo.pedagogyProgress.unitList.filter((unit) => {
            return unit.unitStatus == 'completed';
          });
          let getFromWorksheetService = this.contentService.getFromWorksheet().subscribe(res => {
            if (res.from == 'timeout'
              //&& this.contentResponse.contentHeaderInfo.pedagogyProgress.totalUnits == attemptedQuestions.length
            ) {
              let worksheetID = this.worksheetResult.contentHeaderInfo.pedagogyID;
              let resultCode;
              this.worksheetsService.quitWorksheet(worksheetID).subscribe(
                result => {
                  resultCode = result.resultCode;
                  const status = this.contentService.validateResponse(result, {});
                  this.sharedService.handleUnexpectedResponse(status, 'home');
                  if (resultCode == 'C004') {
                    this.sharedService.hideLoader();
                    this.contentService.setShowTimeoutModal(true);
                  }
                });
            } else {
              this.handleSubmitAnswerResponse(result, submitData);
            }
          });
          getFromWorksheetService.unsubscribe();
        },
        responseError => {
          this.contentService.setUnexpectedError('unexpected');
          this.errorInfo = this.sharedService.handleResponseError(responseError, 'questions', 'home');
        },
        () => {
        }
      );
    }
  }

  private disableIframes() {
    const iframes = (document.getElementsByClassName('block-iframe'));
    _.forEach(iframes, (frame) => {
      frame = <HTMLElement>frame;
      frame.classList.add('blocked');
    });
  }

  private handleSubmitAnswerResponse(result: any, submitData: any) {
    const status = this.contentService.validateResponse(result, submitData);
    this.sharedService.handleUnexpectedResponse(status, 'home');
    if (status === 'success') {
      this.contentService.setBasicData(result);
      this.nextQuestion = result;
      // this.contentService.setWorksheetNextButtonValue({
      //   from: this.from,
      //   questionData: this.nextQuestion.contentHeaderInfo.pedagogyProgress.unitList
      // });
      if (this.from == 'worksheet') {
        this.setTimedTestContent(this.nextQuestion, this.from);
        this.loadNextContent();
      }
    }
    // } else if (status === 'redirect') {
    //   if (this.from === 'worksheet') {
    //     this.contentService.setExpireWorksheetTime(true);
    //   }
    // }
  }

  resetTimedTestContent() {
    this.contentService.setTimerValue({});
    this.contentService.setQuestionData({});
    this.initializeQuestionContent = true;
    this.timeTestIndex = 0;
  }

  updateAnswer(explanationRating?: any, userExplanation?: any, feedbackResponse?: any) {
    this.allowEnter = false;
    explanationRating = this.setDefaultNull(explanationRating);
    userExplanation = this.setDefaultNull(userExplanation);
    feedbackResponse = this.setDefaultNull(feedbackResponse);
    this.contentService.setActivateNext(false);
    if (this.oneOfFormTemplates(this.templateContent) || this.templateContent === 'mcq' ||
      this.templateContent === 'interactive') {
      const submitData = this.questionService.getUpdateData(explanationRating, userExplanation, feedbackResponse);
      if (this.showContentPreview) {
        return;
      } else if (this.from !== 'worksheet') {
        this.questionsService.updateAnswer(submitData).subscribe(
          result => {
            const resultStatus = this.contentService.validateResponse(result, submitData);
            this.sharedService.handleUnexpectedResponse(resultStatus);
            if (resultStatus === 'success') {
              if (this.contentResponse) {
                const contentResponseStatus = this.contentService.validateResponse(this.contentResponse, {});
                this.sharedService.handleUnexpectedResponse(contentResponseStatus);
                if (contentResponseStatus === 'redirect') {
                  this.handleContentError(this.contentResponse);
                }
              }
            }
            // this.sharedService.hideLoader();
          },
          responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
        );
      }
    }
    this.loadNextContent();
  }
  private loadNextContent() {
    if (this.nextQuestion) {
      this.sharedService.hideLoader();
      if (this.from === 'worksheet') {
        this.worksheetResult = _.cloneDeep(this.nextQuestion);
        if (this.nextQuestion.contentData.contentSeqNum > 25) {
          const data = {
            navValue: 'true',
            value: 1,
            action: ' '
          };
          this.contentService.setWorksheetQuesNav(data);
        }
      }
      if (this.templateContent === 'game') {
        this.setQuestionsContent(this.nextQuestion);
        this.contentService.setActivateNext(false);
      } else {
        this.setQuestionsContent(this.nextQuestion);
        this.updateMessages(true);
      }
      this.nextQuestion = null;
    } else {
      if (this.isQuestionsPage && this.contentResponse !== null) {
        const status = this.contentService.validateResponse(this.contentResponse, {});
        this.sharedService.handleUnexpectedResponse(status);
        if (status === 'redirect') {
          this.handleContentError(this.contentResponse);
        } else {
          this.sharedService.showLoader();
          setTimeout(() => {
            this.loadNextContent();
          }, 500);
        }
      }
    }
  }

  isFirstChallenge() {
    let displayMessages: string[] = _.get(this.contentDetails, 'displayMessages', []);
    if (displayMessages) {
      displayMessages = displayMessages.join('----').toLowerCase().split('----');
      const contentMode: string = _.get(this.contentDetails, 'contentMode', '');
      const isFirstAttempt: boolean = _.indexOf(displayMessages, 'challengeattempt1') > -1;
      return (contentMode === 'challenge' && isFirstAttempt);
    }
  }

  hideIDontKnow() {
    const allowedModes = ['assessment', 'challenge', 'wildcard'];
    const noMoreAttempts = _.get(this.evaluationResult, 'noMoreAttempts', false);
    if (noMoreAttempts) {
      return true;
    } else {
      const hideIDK = (typeof (this.hideIDKButton) === 'undefined') ? false : this.hideIDKButton;
      const mode: string = _.get(this.displayContent, 'mode', '').toLowerCase();
      return (!(_.indexOf(allowedModes, mode) > -1) || hideIDK);
    }
  }

  iDontKnow() {
    let element: any, elements: any, htmlElement: any;
    const submitData = this.questionService.skipThis();
    this.callSubmitAnswer(submitData);
    if (this.from !== 'worksheet') {
      this.contentService.setActivateNext(true);
    }
    if (this.oneOfFormTemplates(this.templateContent)) {
      elements = _.get(this.displayContent, 'responseElements', null);
      if (elements) {
        elements = _.keys(elements);
        for (let i = 0; i < elements.length; i++) {
          element = elements[i];
          htmlElement = (<HTMLInputElement>document.getElementById(element));
          htmlElement.disabled = true;
        }
      }
    }
  }
  /* Common Submit End */

  /* MCQ Start */
  /**
   * Evaluate the MCQ response.
   *
   * @param option string | number
   */
  evaluateOption(option, sequenceNo?: number) {
    let result: any = {};
    if (this.questionService) {
      const answer = [{ value: option }];
      if (sequenceNo !== (undefined && null && '')) {
        result = this.evaluateAnswer(answer, sequenceNo);
      } else {
        result = this.evaluateAnswer(answer);
      }
      this.checkEvaluationResult(result);
    }
    // if (!environment.production) { console.log('evaluateOption', result); }
    return result;
  }

  generateOptionString(index) {

    if (index !== null && index !== undefined) {
      index = parseInt(index.toString(), 10);
      return String.fromCharCode(65 + index);
    }
  }

  getAnswerKey(correctAnswer, value?: string) {
    value = (value === undefined) ? 'key' : value;
    let answer = null;
    if (correctAnswer !== '' && correctAnswer !== null && correctAnswer !== undefined) {
      const choices = _.get(this.displayContent, 'responseElements.mcqPattern.choices', []);
      const newThis = this;
      _.forEach(choices, function (choice, key) {
        if (correctAnswer.toString() === choice.id.toString()) {
          if (value === 'key') {
            answer = newThis.generateOptionString(key);
          } else if (value === 'id') {
            answer = choice.id.toString();
          }
        }
      });
    }
    return answer;
  }
  /* MCQ End */

  /* Blank, Dropdown Start */
  validateFormElement(data, element) {
    let submit = '';
    submit = (data === null || data === undefined || data === '' || data.trim() === '') ? 'empty' : submit;
    if (submit === '') {
      const numeric = _.get(element, 'attributes.numeric', false);
      if (numeric) {
        data = data.replace(/−/g, '-');
        submit = (isNaN(parseInt(data, 10))) ? 'not_numeric' : submit;
      }
    }
    return submit;
  }

  evaluateFormElement(data, sequenceNo?: number) {
    let result: any = {}, value: any, eachAnswer: any, answer: any[];
    if (this.questionService) {
      answer = [];
      Object.keys(data).forEach(function (key) {
        value = data[key];
        value = value.replace(/−/g, '-').replace(/​/g, '');
        eachAnswer = { name: key, value: value };
        answer.push(eachAnswer);
      }, (data));
      // if (!environment.production) { console.log('answer', answer); }
      if (sequenceNo !== (undefined && null && '')) {
        result = this.evaluateAnswer(answer, sequenceNo);
      } else {
        result = this.evaluateAnswer(answer);
      }
      if (this.templateContent !== 'timedtest') {
        this.checkEvaluationResult(result);
      }
    }
    // if (!environment.production) { console.log('form result', result); }
    return result;
  }

  checkNumeric(elementId: string, event: any) {
    let key: string = _.get(event, 'key', '');
    if (key === '') {
      const keyCode: number = parseInt(_.get(event, 'keyCode', '0'), 10);
      if (keyCode >= 48 && keyCode <= 57) {
        key = (keyCode - 48).toString();
      } else if (keyCode >= 96 && keyCode <= 105) {
        key = (keyCode - 96).toString();
      } else {
        switch (keyCode) {
          case 8: key = 'Backspace'; break;
          case 109:
          case 189: key = '-'; break;
          case 110:
          case 190: key = '.'; break;
        }
      }
    }
    const ctrl = _.get(event, 'ctrlKey', '');
    const notNumber = key === '' || key === null || key === undefined || (isNaN(parseInt(key, 10)) && key.length === 1 && !ctrl);
    const allowedSplChar = key === '-' || key === '.';
    if (notNumber && !allowedSplChar) {
      event.preventDefault();
      this.showValidationAlerts(['not_numeric']);
    }
  }
  /* Blank, Dropdown End */

  /* Game, Interative Start */
  skipContent() {
    this.contentService.setQuestionSubmit(false);
    this.questionService.skipThis();

  }

  callSkipContent() {
    if (typeof (this.templateContent) !== 'undefined' && this.templateContent !== (null && '')) {
      if (this.oneOfIframeTemplates(this.templateContent) && this.templateContent !== 'interactive') {
        this.skipContent();
        // } else if (this.from == 'worksheet') {
        //   let unitSequenceNo;
        //   let remainingTime;
        //   this.contentService.getNextWorksheetSequence().subscribe(result => {
        //     unitSequenceNo = _.get(result, 'sequence', 1)
        //   });
        //   this.contentService.getTimerValue().subscribe(result => {
        //     remainingTime = result.endTimer;
        //   });
        //   if (this.questionService.getTemplate() !== 'Blank') {
        //     this.callSubmitWorksheet(null, unitSequenceNo, true, remainingTime);
        //   }
        // }
        /* Else condition for this funtions is available in questions-structure.component.ts */
      }
    }
    else {
      setTimeout(() => { this.callSkipContent(); }, 100);
    }
  }

  saveActivityCallBack(data) {
    data.contentSeqNum = this.getSequenceNumber();
    if (this.showContentPreview) {
      return;
    } else {
      this.questionsService.saveActivity(data).subscribe(
        result => { /* if (!environment.production) { console.log(result); } */ },
        responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
      );
    }
    // if (!environment.production) { console.log('saveActivityCallBack', data); }
  }

  completeActivityCallBack(data) {
    data.contentSeqNum = this.getSequenceNumber();
    this.callActivitySubmitAnswerAction();
    if (this.showContentPreview) {
      return;
    } else {
      this.questionsService.submitActivity(data).subscribe(
        result => {
          this.contentResponse = result;
          this.handleSubmitAnswerResponse(result, data);
        },
        responseError => {
          this.contentService.setUnexpectedError('unexpected');
          this.errorInfo = this.sharedService.handleResponseError(responseError, 'questions', 'home');
        }
      );
    }
    // if (!environment.production) { console.log('completeActivityCallBack', data); }
  }

  private callActivitySubmitAnswerAction() {
    const isSkipped = _.get(this.questionService, 'isSkipped', false);
    if (isSkipped) {
      this.updateAnswer();
    } else {
      if (this.from !== 'worksheet' && this.templateContent !== 'timedtest') {
        this.contentService.setActivateNext(true);
      }
    }
  }

  setInteractiveCallBack(data) {
    // if (!environment.production) { console.log('setInteractiveCallBack', data); }
    this.checkEvaluationResult(data);
    if (data.result.toLowerCase() !== 'unattempted') {
      this.contentService.setInteractiveSubmitResponse(data);
    }
  }

  private getSequenceNumber() {
    const sequence = _.get(this.contentDetails, 'contentSeqNum', null);
    return sequence;
  }
  /* Game, Interative End */

  /* Worksheet Actions Start */
  quitWorksheets() {
    this.sharedService.showLoader();
    let worksheetID = this.worksheetResult.contentHeaderInfo.pedagogyID;
    let resultCode;
    this.worksheetsService.quitWorksheet(worksheetID).subscribe(
      result => {
        resultCode = result.resultCode;
        this.sharedService.hideLoader();
        const status = this.contentService.validateResponse(result, {});
        this.sharedService.handleUnexpectedResponse(status, 'home');
        this.router.navigate([AppSettings.REDIRECT_CODE.worksheetlist]);
      }
    );
  }
  /* Worksheet Actions End */

  /* TimedTest Actions Start */
  loadNextTimedTestQuestion(result: any) {
    this.nextQuestion = _.cloneDeep(this.thisQuestion);
    this.timeTestIndex++;
    this.loadNextContent();
  }

  private callTimedTestAnswerAction() {
    const duration = _.get(this.displayContent, 'duration', 0);
    const userAttempt: any = _.cloneDeep(this.evaluationResult);
    userAttempt.timeTaken = (duration * 60) - this.endTime;
    userAttempt.open = true;
    userAttempt.duration = duration;
    this.contentService.setScoreSheet(userAttempt);
    this.resetTimedTestContent();
  }

  private setTimedTestContent(data, from) {
    let time: any, questionData = {};
    if (from === 'worksheet') {
      this.contentService.getTimerValue().subscribe(result => {
        this.remainingTime = result.endTimer;
      });
      if (this.remainingTime == null) {
        this.remainingTime = _.get(data, 'contentHeaderInfo.remainingTime', 0);
      } else {
        if (this.remainingTime > 0) {
          this.remainingTime -= 1;
        }
      }
      questionData = {
        questionData: _.get(data, 'contentHeaderInfo.pedagogyProgress.unitList', []),
        remainingTime: this.remainingTime,
        totalTime: _.get(data, 'contentHeaderInfo.totalTime', 0),
        timed: _.get(data, 'contentHeaderInfo.timed', false),
        name: _.get(data, 'contentHeaderInfo.pedagogyName', ''),
        pedagogyStatus: _.get(data, 'contentHeaderInfo.pedagogyStatus', ''),
      };
    } else if (this.templateContent === 'timedtest') {
      // Converting minutes to seconds
      if (this.initializeQuestionContent) {
        time = {
          total: _.get(this.displayContent, 'duration', 0) * 60,
          remaining: _.get(this.displayContent, 'duration', 0) * 60
        };
      } else {
        time = {
          total: _.get(this.displayContent, 'duration', 0) * 60,
          remaining: --this.endTime
        };
      }
      questionData = {
        questionData: [],
        remainingTime: time.remaining,
        totalTime: time.total,
        timed: true,
        name: _.get(this.displayContent, 'timedTestTitle', ''),
        pedagogyStatus: 'in-progress'
      };
    }
    this.contentService.setQuestionData(questionData);
    if (this.from !== 'worksheet') {
      const timerdata = {
        worksheetValue: true,
        remainingTime: this.remainingTime
      };
      this.contentService.setTimerValue(timerdata);
      this.contentService.setMessageClose(true);
      this.contentService.setRestartTimer(true);
    }
  }

  checkTimedTestAutoSubmit(elementId, event) {
    let autoSubmit;
    if (this.timedtestKeyDownCheck) {
      clearTimeout(this.timedtestKeyDownCheck);
    }
    if (this.templateContent && this.templateContent === 'timedtest') {
      const timedTestTemplate = _.get(this.displayContent, 'timedTestData.questionTemplate', '');
      if (timedTestTemplate !== null && timedTestTemplate !== undefined) {
        autoSubmit = _.get(this.displayContent, 'autoSubmit', false);
        if (this.oneOfFormTemplates(timedTestTemplate.toLowerCase()) && autoSubmit) {
          this.timedtestKeyDownCheck = setTimeout(() => {
            this.contentService.setQuestionSubmit(true);
          }, 2000);
        }
      }
    }
  }

  updateTimedTestData() {
    const timedTestData = this.getTimedTestHeaderData();
    this.contentDetails.timedTestData = timedTestData;
    this.contentService.setQuestionContent(this.contentDetails);
    this.displayContent.timedTestData = timedTestData;
    this.translationContent.displayContent.timedTestData = timedTestData;
  }

  restartTimer() {
    if (this.questionService) {
      this.questionService.restartTimer();
      this.contentService.setRestartTimer(false);
    } else {
      setTimeout(() => {
        this.restartTimer();
      }, 100);
    }
  }

  stopTimedTestContent() {
    this.contentService.setTimerValue({});
    if (this.templateContent === 'timedtest') {
      this.callSubmitAnswer();
    }
  }
  /* TimedTest Actions End */

  /* Vernacular Start */
  setTranslationContentServiceData(content, hasTranslation) {
    this.translationContent.hasTranslation = hasTranslation;
    if (hasTranslation) {
      this.translationContent.language = _.get(content, 'contentData.translationLanguage', null);
      this.translationContent.displayContent = this.getTranslationData(content);
    }
    this.contentService.setTranslationContent(this.translationContent);
  }

  getTranslationData(content) {
    let translatedQuestion;
    translatedQuestion = this.questionService.getTranslatedDisplayObject();
    translatedQuestion.showHint = (translatedQuestion.hint) ? true : false;
    translatedQuestion.contentType = this.contentType;
    translatedQuestion.sequence = _.get(content, 'contentData.contentSeqNum', '');
    translatedQuestion.mode = _.get(content, 'contentData.contentMode', '');
    translatedQuestion.timedTestData = this.getTimedTestHeaderData();
    translatedQuestion.template = (translatedQuestion.template) ? translatedQuestion.template : this.templateContent;
    translatedQuestion = this.reformDisplayContent(translatedQuestion, true);
    // if (!environment.production) { console.log(translatedQuestion); }
    return translatedQuestion;
  }

  getTranslatedExplanation() {
    if (this.questionService) {
      return this.questionService.getTranslatedExplanation();
    }
    return {};
  }

  getTranslatedHints() {
    if (this.questionService) {
      return this.questionService.getTranslatedHints();
    }
    return {};
  }
  /* Vernacular End */

  /* Handle Alert Messages Start */
  /**
   * Store the display messages that are available in
   * pedagogy messages.
   *
   * @param content any
   * @returns any
   */
  private getDisplayMessages(content) {
    const displayMessages = {};
    if (this.initializeQuestionContent) {
      const appMessage = _.cloneDeep(AppMessageSettings);
      const messages = _.get(content, 'contentHeaderInfo.pedagogyMessages', []);
      _.forEach(messages, function (value, key) {
        displayMessages[value] = _.get(appMessage, value, {});
      });
    }
    return displayMessages;
  }

  updateMessages(discardAll?: boolean) {
    let condition, display;
    discardAll = (discardAll) ? discardAll : false;
    const result: any = this.evaluationResult;
    for (let index = 0; index < this.displayMessages.length; index++) {
      const message = this.displayMessages[index];
      const beforeConditions = _.get(message, 'beforeSubmit.conditions', ['default']);
      const afterConditions = _.get(message, 'afterSubmit.conditions', ['default']);
      for (let beforeIndex = 0; beforeIndex < beforeConditions.length; beforeIndex++) {
        condition = beforeConditions[beforeIndex];
        display = _.get(message, 'beforeSubmit.messages.' + condition + 'Display', false);
        if (display || discardAll) { this.displayMessages[index].beforeSubmit.messages[condition + 'Close'] = true; }
        if (this.checkBeforeSubmit(condition, result)) {
          this.displayMessages[index].beforeSubmit.messages[condition + 'Display'] = true;
        }
      }
      for (let afterIndex = 0; afterIndex < afterConditions.length; afterIndex++) {
        condition = afterConditions[afterIndex];
        display = _.get(message, 'afterSubmit.messages.' + condition + 'Display', false);
        if (display || discardAll) { this.displayMessages[index].afterSubmit.messages[condition + 'Close'] = true; }
        if (this.checkAfterSubmit(condition, result)) {
          this.displayMessages[index].afterSubmit.messages[condition + 'Display'] = true;
        }
      }
    }
    this.discardOldMessages(this.displayMessages, discardAll);
  }

  private checkAfterSubmit(condition, result) {
    let status;
    const noMoreAttempts = _.get(result, 'noMoreAttempts', false);
    const resultStatus = _.get(result, 'result', false);
    switch (condition) {
      case 'default':
        status = true;
        break;
      case 'result_true':
        status = (noMoreAttempts) ? this.checkAfterSubmitResult(resultStatus, true) : false;
        break;
      case 'result_false':
        status = (noMoreAttempts) ? this.checkAfterSubmitResult(resultStatus, false) : false;
        break;
      default: status = false;
    }
    return status;
  }
  private checkBeforeSubmit(condition, result) {
    let status;
    switch (condition) {
      case 'default':
        status = true;
        break;
      default: status = false;
    }
    return status;
  }

  private checkAfterSubmitResult(result, status) {
    result = (result === 'correct') ? true : result;
    result = (result === 'incorrect') ? false : result;
    return (result === status);
  }

  discardOldMessages(displayMessages, discardAll?) {
    let message, messageText, afterMessages, beforeMessages, afterConditions, beforeConditions, condition, close;
    if (discardAll) {
      this.displayMessages = [];
    } else {
      for (let index = 0; index < this.displayMessages.length; index++) {
        message = this.displayMessages[index];
        beforeConditions = _.get(message, 'beforeSubmit.conditions', ['default']);
        afterConditions = _.get(message, 'afterSubmit.conditions', ['default']);
        for (let beforeIndex = 0; beforeIndex < beforeConditions.length; beforeIndex++) {
          condition = beforeConditions[beforeIndex];
          messageText = _.get(message, 'beforeSubmit.messages.' + condition, '');
          close = _.get(message, 'beforeSubmit.messages.' + condition + 'Close', false);
          if (messageText === '' || close) {
            delete this.displayMessages[index].beforeSubmit.messages[condition];
            delete this.displayMessages[index].beforeSubmit.messages[condition + 'Close'];
            delete this.displayMessages[index].beforeSubmit.messages[condition + 'Display'];
          }
        }
        for (let afterIndex = 0; afterIndex < afterConditions.length; afterIndex++) {
          condition = afterConditions[afterIndex];
          messageText = _.get(message, 'beforeSubmit.messages.' + condition, '');
          close = _.get(message, 'beforeSubmit.messages.' + condition + 'Close', false);
          if (messageText === '' || close) {
            delete this.displayMessages[index].beforeSubmit.messages[condition];
            delete this.displayMessages[index].beforeSubmit.messages[condition + 'Close'];
            delete this.displayMessages[index].beforeSubmit.messages[condition + 'Display'];
          }
        }
      }
      beforeMessages = _.get(message, 'beforeSubmit.messages', {});
      afterMessages = _.get(message, 'afterSubmit.messages', {});
      if (_.isEmpty(beforeMessages) && _.isEmpty(afterMessages)) {
        this.displayMessages = [];
      }
    }
    this.contentService.setMessages(this.displayMessages);
  }

  showValidationAlerts(messageTypes: string[], alertMessage?: string) {
    let message, messageId = '';
    const appMessage = _.cloneDeep(AppMessageSettings);
    alertMessage = (typeof (alertMessage) !== 'string' || alertMessage === '') ? '' : alertMessage;
    if (alertMessage !== '') {
      this.contentService.setConditionalAlert(alertMessage);
    }
    this.updateMessages();
    for (let typeIndex = 0; typeIndex < messageTypes.length; typeIndex++) {
      const messageType = messageTypes[typeIndex];
      switch (messageType) {
        case 'empty':
          messageId = 'submitEmptyBlank';
          break;
        case 'not_numeric':
          messageId = 'alphabetInNumericBlank';
          break;
        case 'result_error':
          messageId = 'moreThanOneTrial';
          break;
        default:
          messageId = '';
          break;
      }
      if (messageId !== '') {
        message = _.get(appMessage, messageId, {});
        this.generateDisplayMessages([message]);
      }
    }
  }

  generateDisplayMessages(messages: any) {
    const messageKeys = _.keys(messages);
    for (let i = 0; i < messageKeys.length; i++) {
      const key = messageKeys[i];
      const message = messages[key];
      const beforeMessages = _.get(message, 'beforeSubmit.messages', {});
      const beforeConditions = _.get(message, 'beforeSubmit.conditions', ['default']);
      const afterMessages = _.get(message, 'afterSubmit.messages', {});
      const afterConditions = _.get(message, 'afterSubmit.conditions', ['default']);
      const displayMessage = {
        beforeSubmit: {
          where: _.get(message, 'beforeSubmit.where', 'ribbonGreen').toLowerCase(),
          action: _.get(message, 'beforeSubmit.action', ''),
          conditions: beforeConditions,
          messages: this.getRandomMessage('before', beforeMessages, beforeConditions)
        },
        afterSubmit: {
          where: _.get(message, 'afterSubmit.where', 'ribbonGreen').toLowerCase(),
          action: _.get(message, 'afterSubmit.action', ''),
          conditions: afterConditions,
          messages: this.getRandomMessage('after', afterMessages, afterConditions)
        }
      };
      this.displayMessages.push(displayMessage);
    }
    this.contentService.setMessages(this.displayMessages);
  }

  generateMessageString(messages, when, whereBase) {
    let message, messageContent, setMessage, where;
    for (let i = 0; i < messages.length; i++) {
      setMessage = false;
      message = messages[i];
      where = _.get(message, when + 'Submit.where', '').toLowerCase();
      switch (whereBase) {
        case 'ribbon':
          setMessage = (where === 'ribbongreen' || where === 'ribbonred'); break;
        case 'overlay':
          setMessage = (where === 'overlay'); break;
      }
      if (setMessage) {
        messageContent = this.getMessageString(message, when, messageContent);
      }
    }
    return {
      action: _.get(messageContent, 'action', ''),
      class: where,
      close: false,
      message: _.get(messageContent, 'messageText', '')
    };
  }

  private getMessageString(message, when, messageContent) {
    let messageData, messageText = '', conditions, condition, action;
    conditions = _.get(message, when + 'Submit.conditions', ['default']);
    for (let conditionalIndex = 0; conditionalIndex < conditions.length; conditionalIndex++) {
      condition = conditions[conditionalIndex];
      action = _.get(message, when + 'Submit.action', '');
      messageData = {
        message: _.get(message, when + 'Submit.messages.' + condition, ''),
        close: _.get(message, when + 'Submit.messages.' + condition + 'Close', false),
        display: _.get(message, when + 'Submit.messages.' + condition + 'Display', false),
      };
      if (messageData.display && !messageData.close) {
        messageText += (messageText !== '') ? '<br>' : '';
        messageText += messageData.message;
      }
    }
    if (messageText !== '') {
      return { messageText: messageText, action: action };
    } else {
      return messageContent;
    }
  }

  getRandomMessage(type, messages, conditions) {
    let condition, messagesLength, randomKey, message, extraText;
    for (let i = 0; i < conditions.length; i++) {
      condition = conditions[i];
      messagesLength = _.get(messages, condition, []).length;
      if (messagesLength > 0) {
        randomKey = this.generateRandomNumber(0, (messagesLength - 1));
      } else {
        randomKey = 0;
      }
      message = _.get(messages, condition + '.' + randomKey, '');
      this.sharedService.translateMessage(message).subscribe(
        res => {
          extraText = this.getExtraMessageText(message);
          messages[condition] = extraText + res;
        }
      );
      messages[condition + 'Display'] = (type === 'before' && condition === 'default') ? true : false;
      messages[condition + 'Close'] = false;
    }
    return messages;
  }

  private generateRandomNumber(min, max) {
    if (min === max) { return min; }
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private getExtraMessageText(message) {
    let extraText = '';
    const content = _.get(AppSettings, 'OVERLAYCONTENT.' + message, '');
    const image = _.get(content, 'image', '');
    let text = _.get(content, 'text', '');
    const className = _.get(content, 'class', '');
    if (text !== '') {
      this.sharedService.translateMessage(text).subscribe(
        res => { text = res; }
      );
    }
    extraText += (image !== '') ? '<span class="effort-mode"><img src="' + image + '"/>' : '';
    extraText += (text !== '') ? '<span class="mode-level ' + className + '">' + text + '</span>' : '';
    extraText += (image !== '') ? '</span>' : '';
    return extraText;
  }
  /* Handle Alert Messages End */

  /* MathQuill Keyboard Start */
  checkIsDevice() {
    this.isDevice = false;
  }

  setInputKeyboardElements(displayContent, matches) {
    let i: number, match: string, type: string, keyboardElements: any;
    const allInputs: string[] = [];
    if (matches) {
      for (i = 0; i < matches.length; i++) {
        if (matches[i] && matches[i] !== '') {
          match = matches[i].substr(1, (matches[i].length - 2));
          if (this.templateContent === 'timedtest') {
            type = _.get(displayContent, 'questions[' + this.timeTestIndex + '].responseElements.' + match + '.type', '').toLowerCase();
          } else {
            type = _.get(displayContent, 'responseElements.' + match + '.type', '').toLowerCase();
          }
          if (type === 'blank') {
            allInputs.push(match);
          }
        }
      }
    }
    keyboardElements = {
      isDevice: this.isDevice,
      isKeyboard: null,
      allInputs: allInputs,
      selectedInput: null
    };
    this.contentService.setKeyboardElements(keyboardElements);
  }

  displayKeyboard(element) {
    this.keyboardElements.selectedInput = _.get(element, 'id', '');
    this.keyboardElements.isKeyboard = true;
    this.contentService.setKeyboardElements(this.keyboardElements);
  }

  unsetKeyboardElements() {
    this.contentService.setKeyboardElements({});
  }

  hideKeyboard() {
    this.keyboardElements.isKeyboard = false;
    this.contentService.setKeyboardElements(this.keyboardElements);
  }
  /* MathQuill Keyboard End */


}
