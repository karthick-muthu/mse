import { AfterViewInit, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { TranslateService } from 'ng2-translate';
import { environment } from '../../../../../../environments/environment';
import { AppMessageSettings } from '../../../../../settings/app.messages';
import { AppSettings } from '../../../../../settings/app.settings';
import { ContentService } from '../../../../services/content/content.service';
import { SharedService } from '../../../../shared.service';
import { SessionReportService } from '../services/session-report/session-report-service.service';

@Component({
  selector: 'ms-session-report-modal',
  templateUrl: './session-report-modal.component.html',
  styleUrls: ['./session-report-modal.component.scss'],
})
export class SessionReportModalComponent implements OnInit, AfterViewInit, OnDestroy {
  sliderClass: string;
  showFirstSlide: boolean;
  gifToShow: string;
  sessionReward: any;
  sessionReport: any;
  template: any;
  templateClass: any;
  errorInfo: any;
  topicID: any;
  concepts: boolean[] = [];
  higherLevelConceptsCompletedMsg: string;
  challengeQuestionAttemptMsg: string;
  messages: any[] = [];
  struggledThroughConceptMsg: string;
  topicCompletionImage: any;
  from: string;
  questionContentData: any;
  private allowedModes: string[];
  private getTemplateService: any;
  private getQuestionContentService: any;

  constructor(private modalService: NgbModal, private sessionReportService: SessionReportService, private router: Router,
    public ngbActiveModal: NgbActiveModal, private sharedService: SharedService, private contentService: ContentService,
    @Inject(DOCUMENT) private document: Document, private translate: TranslateService) {
    this.gifToShow = AppSettings.SESSIONREPORT_ANIMATIONS[2];
    this.allowedModes = AppSettings.ALLOWED_MODES;
    this.getTemplateService = this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
      },
      responseError => this.errorInfo = responseError
    );
    this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(
      result => {
        this.from = _.get(result, 'from', '');
        this.questionContentData = result;
        this.topicID = _.get(result, 'topicID', '');
      },
      responseError => this.errorInfo = responseError
    );
    this.contentService.setResetQuestionField(true);
    this.showFirstSlide = false;
    this.sliderClass = 'animation-without-slides';
  }

  ngOnInit() {
    if (this.from !== 'worksheet') {
      this.getSessionReportContent();
    } else {
      this.handleWorksheetReport();
    }
  }

  ngAfterViewInit() {
    if (document.querySelector('.modal-content') !== undefined && document.querySelector('.modal-content') !== null) {
      document.querySelector('.modal-content').classList.add('modal-custom-width');
      document.querySelector('.modal-backdrop').classList.add('modal-disable');
    }
  }

  ngOnDestroy(): void {
    this.getTemplateService.unsubscribe();
    this.getQuestionContentService.unsubscribe();
  }

  handleWorksheetReport() {
    this.sharedService.hideLoader();
    this.sessionReport = {};
    this.sessionReport.topicName = '<div>' + this.questionContentData.worksheetName + '</div>';
    this.sessionReport.timeSpent = 0;
    this.sessionReport.timeUpMsg = true;
    this.showFirstSlide = false;
  }

  getSessionReportContent() {
    this.sharedService.showLoader();
    const topicData = {
      topicID: this.topicID
    };
    this.sessionReportService.getTopicSessionReport(topicData).subscribe(
      result => {
        this.extractReport(result);
        this.sharedService.translateMessage('topic completion').subscribe(res => {
          this.topicCompletionImage = 'url(' + environment.appBaseURL + res + ')';
        });
        this.sharedService.hideLoader();
      },
      error => this.errorInfo = this.sharedService.handleResponseError(error)
    );
  }

  goToHigherLevels() {
    this.sharedService.showLoader();
    const data = {
      topicID: this.topicID
    };
    this.sessionReportService.startTopicHigherLevel(data).subscribe(
      result => {
        this.ngbActiveModal.close();
        if (_.indexOf(['/home', '/topics'], this.router.url) > -1) {
          this.router.navigate(['content']);
        } else {
          this.contentService.setFetchFirstContent(true);
        }
      },
      responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
    );
  }

  getDetails() {
    this.contentService.setTopicId(this.topicID);
    this.ngbActiveModal.close();
    this.router.navigate(['topics/detail']);
  }

  howidid() {
    this.ngbActiveModal.close();
    const data: any = {
      'startFrom': 1,
      'limit': 20,
      'topicId': this.topicID,
      'index': 1
    };
    this.sharedService.setTopicTrailData(data);
    this.sharedService.setTrailFrom('sessionTrail');
    this.router.navigate(['topics/trails']);
  }

  goToHome() {
    this.ngbActiveModal.close();
    this.contentService.setTileCalledFrom('details');
    this.router.navigate(['/home']);
  }

  extractReport(report) {
    const status = this.contentService.validateResponse(report, {});
    this.sharedService.handleUnexpectedResponse(status, 'home');
    if (status === 'success') {
      const messages = _.toArray(_.get(report, 'sessionReward.messages', {}));
      this.sessionReport = report.sessionReport;
      this.sessionReward = report.sessionReward;
      for (let i = 0; i < report.sessionReport.conceptsOverall; i++) {
        this.concepts[i] = false;
      }
      const rewardCelebration = _.get(this.sessionReport, 'rewardCelebration', null);
      this.displayCelebration(rewardCelebration);
      this.getSessionReportBodyClass();
      this.getProgress(report.sessionReport.conceptsClearedOverall);
      this.getMessages(messages);
    }
  }

  getProgress(cleared) {
    for (let i = 0; i < cleared; i++) {
      this.concepts[i] = true;
    }
  }

  getMessages(messages) {
    let key;
    messages.forEach(element => {
      key = element.messageKey;
      const conceptsNumber = element.conceptCleared;
      const number = 'number';
      const message = {
        'key': key,
        'value': AppMessageSettings[key]
      };
      if (key === 'accurateClusterSuccess') {
        message.value = message.value.replace('<conceptCleared>', conceptsNumber);
      }
      this.messages.push(message);
    });
  }

  padZero(value?) {
    value = (value) ? value : '0';
    return this.sharedService.padPrefix(value, 2, '0');
  }

  displayCelebration(rewardCelebration) {
    const mode: string = _.get(this.sessionReport, 'currentMode', '');
    let imagePath = null;
    if (rewardCelebration) {
      if (rewardCelebration.challenge &&
        rewardCelebration.shield &&
        rewardCelebration.sparkie) {
        imagePath = AppSettings.SESSIONREPORT_ANIMATIONS[0];
      } else if (!rewardCelebration.challenge &&
        rewardCelebration.shield &&
        rewardCelebration.sparkie) {
        imagePath = AppSettings.SESSIONREPORT_ANIMATIONS[0];
      } else if (!rewardCelebration.challenge &&
        !rewardCelebration.shield &&
        rewardCelebration.sparkie) {
        imagePath = AppSettings.SESSIONREPORT_ANIMATIONS[1];
      } else {
        return false;
      }
    }
    if (imagePath) {
      setTimeout(() => {
        this.gifToShow = imagePath;
      }, 3000);
    } else {
      this.gifToShow = imagePath;
    }
    this.showFirstSlide = ((_.indexOf(this.allowedModes, mode) > -1) && (rewardCelebration.challenge ||
      rewardCelebration.shield ||
      rewardCelebration.sparkie) && imagePath !== null);
    return (_.indexOf(this.allowedModes, mode) > -1);
  }

  getSessionReportBodyClass() {
    let className = '';
    const rewardCelebration = _.get(this.sessionReport, 'rewardCelebration', null);
    if (this.showFirstSlide && this.gifToShow !== null) {
      className = 'animation-slides';
    } else {
      className = 'animation-without-slides';
    }
    this.sliderClass = className;
  }

  getProgressActiveStyle() {
    let progressBar: any, progressBarLength: number, progressActiveLength: number, totalProgress: any;
    progressBar = document.getElementsByClassName('session-report-progress-bar');
    progressBar = (progressBar) ? progressBar[0] : progressBar;
    totalProgress = _.get(this.sessionReport, 'conceptsOverall', null);
    if (progressBar && totalProgress && totalProgress > 0) {
      progressBarLength = progressBar.offsetWidth;
      progressActiveLength = progressBarLength / totalProgress;
    }
    progressActiveLength = (progressActiveLength) ? progressActiveLength : 0;
    return { width: progressActiveLength + 'px' };
  }

}
