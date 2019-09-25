import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ContentService } from '../../../../shared/services/content/content.service';
import { SharedService } from '../../../../shared/shared.service';
import { WorksheetsService } from '../../services/worksheets.service';
import { QuestionDisplayReformService } from '../../../../shared/services/question/questionDisplayReform.service';
import * as _ from 'lodash';
import { AppSettings } from '../../../../settings/app.settings';

@Component({
  selector: 'ms-worksheet-report',
  templateUrl: './worksheet-report.component.html',
  styleUrls: ['./worksheet-report.component.scss']
})
export class WorksheetReportComponent implements OnInit, OnDestroy {
  totalPagesCount: number;
  currentWorksheetTrailData: any;
  trailList: any[];
  topicList: any;
  settings: any;
  collectionSize: number;
  currentPage: number;
  totalPages: number;
  showingFrom: number;
  displayContent: any;
  showWronglyAnsweredQuestions: boolean;
  worksheetReportData: any;
  showWrongAnswers: boolean;
  templateClass: string;
  templateService: Subscription;
  worksheetReportBodyData: any;
  worksheetReportSubscription: Subscription;
  template: string;
  errorInfo: any;
  from: any;
  worksheetName: any;
  constructor(private sharedService: SharedService, private contentService: ContentService, private worksheetsService: WorksheetsService,
    private questionDisplayReformService: QuestionDisplayReformService) {
    this.templateService = this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
      },
      responseError => this.errorInfo = responseError
    );
    this.worksheetReportSubscription = this.sharedService.getWorksheetReportData().subscribe(worksheetDataResult => {
      this.currentWorksheetTrailData = worksheetDataResult;
      this.getWorksheetReport(worksheetDataResult);
    });
    this.showWrongAnswers = false;
    this.sharedService.setSiteTitle('Worksheet Report');
    this.sharedService.setTrailFrom('worksheetreport');
  }

  ngOnInit() {
    this.showWronglyAnsweredQuestions = false;
    this.from = 'worksheet';
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('body-bg');
    this.displayContent = [];
    this.callLoadJs();
  }


  callLoadJs() {
    this.questionDisplayReformService.loadJS().then(
      result => {
        if (result.result !== 'failed') {
          return true;
        } else {
          this.callLoadJs();
        }
      }
    );
  }

  getWorksheetReport(worksheetDataResult) {
    this.sharedService.showLoader();
    this.worksheetsService.getWorksheetReport(worksheetDataResult).subscribe(
      result => {
        this.contentService.setBasicData(result);
        this.worksheetReportData = result;
        this.extractData();
        this.sharedService.hideLoader();
      });
  }

  extractData() {
    this.worksheetName = _.get(this.worksheetReportData, 'worksheetName', '');
    this.topicList = _.get(this.worksheetReportData, 'topicList', []);
    this.settings = _.get(this.worksheetReportData, 'settings', null);
    this.collectionSize = _.get(this.worksheetReportData, 'totalQuestion', 1);
    this.currentPage = _.get(this.worksheetReportData, 'currentPage', 1);
    this.totalPages = _.get(this.worksheetReportData, 'totalPages', 1);
    this.showingFrom = _.get(this.worksheetReportData, 'showingFrom', 1);
    this.totalPagesCount = _.get(this.worksheetReportData, 'pageItemCount', AppSettings.PAGINATION_LIMIT);
    this.trailList = _.get(this.worksheetReportData, 'trailList', []);

    this.questionDisplayReformService.initContentService(this.trailList);
    setTimeout(() => {
      this.displayContent = this.questionDisplayReformService.getQuestionsContent();
      for (let i = 0; i < this.displayContent.length; i++) {
        this.displayContent[i].index = i;
        if ((this.trailList[i].contentType === 'question' && this.displayContent[i].contentType === 'question' && this.displayContent[i].userAnswer.result !== null)) {
          if (this.displayContent[i].userAnswer.result.toLowerCase() === 'fail') {
            this.showWrongAnswers = true;
          } else if (this.displayContent[i].userAnswer.result.toLowerCase() === 'skip') {
            this.displayContent[i].userAnswer.userAnswer = 'Skipped';
          }
        }
      }
    }, 200);

  }

  loadPage(page) {
    if (page !== this.currentPage) {
      this.currentPage = page;
      const data = {
        startFrom: ((this.currentPage - 1) * this.totalPagesCount) + 1,
        limit: 20,
        worksheetID: this.currentWorksheetTrailData.worksheetID,
        index: this.currentPage
      };
      this.showWronglyAnsweredQuestions = false;
      this.showWrongAnswers = false;
      this.sharedService.setWorksheetReportData(data);
    }
  }

  generateOptionString(index) {
    return this.questionDisplayReformService.generateOptionString(index);
  }

  check() {
    this.showWronglyAnsweredQuestions = !this.showWronglyAnsweredQuestions;
  }
  ngOnDestroy() {
    this.worksheetReportSubscription.unsubscribe();
    this.contentService.setMathJaxClear(true);
  }
}
