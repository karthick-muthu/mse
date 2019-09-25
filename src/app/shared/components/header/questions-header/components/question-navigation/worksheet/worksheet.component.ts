import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../../../../../shared.service';
import { ContentService } from '../../../../../../services/content/content.service';
import { AppSettings } from '../../../../../../../settings/app.settings';
import { Subscription } from 'rxjs/Subscription';
import { QuestionsComponent } from '../../../../../questions/questions.component';
import { QuestionsStructureComponent } from '../../../../../questions/questions-structure/questions-structure.component';
import * as _ from 'lodash';


@Component({
  selector: 'ms-worksheet',
  templateUrl: './worksheet.component.html',
  styleUrls: ['../question-navigation.component.scss']
})
export class WorksheetComponent implements OnDestroy {
  @Input('toDisplay') toDisplay: any;

  private WorksheetQuesNavService: Subscription;
  private getQuestionContentService: Subscription;
  private getQuestionDataService: Subscription;
  private getNextQuestionSequenceService: Subscription;

  value: any;
  action: any;
  navValue: any;
  quesNum: any;
  quesNumTotal: any;
  totalQues: any;
  questionTemplate: any;
  questionIcon: any;
  template: string;
  templateClass: string;
  errorInfo: any;
  unitName: string;
  questionToBeDisplay;
  max_range: number;
  startQuesRange = 0;
  selectedQuestionNum: any;
  questionId: any;
  unitSequenceNo;
  constructor(private sharedService: SharedService, public contentService: ContentService,
    private questionsComponent: QuestionsComponent) {
    this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
      },
      responseError => this.errorInfo = responseError
    );
    this.questionIcon = AppSettings.QUESTIONS_ICON;
    this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(
      result => {
        this.questionTemplate = _.get(result, 'templateContent', '');
        this.quesNum = _.get(result, 'contentSeqNum', '');
        this.questionId = _.get(result, 'contentId', '');
        setTimeout(() => {
          this.setCurrentQuestion();
        }, 1000);
      }
    );
    this.getQuestionDataService = this.contentService.getQuestionData().subscribe(
      result => {
        this.unitName = _.get(result, 'name', null);
        this.quesNumTotal = _.get(result, 'questionData', []);
        this.totalQues = _.get(result, 'questionData.length', []);
        if (this.totalQues > 25) {
          if (this.max_range > 25) {
            this.max_range = this.max_range;
          } else {
            this.max_range = 25;
          }
        } else {
          this.max_range = this.totalQues;
        }
      }
    );
    this.WorksheetQuesNavService = this.contentService.getWorksheetQuesNav().subscribe(
      result => {
        this.navValue = _.get(result, 'navValue', '');
        this.value = _.get(result, 'value', '');
        this.action = _.get(result, 'action', '');
        if (this.navValue) {
          this.changeQuestions(this.action);
          const data = {
            navValue: false,
            value: 1,
            action: ' '
          };
          this.contentService.setWorksheetQuesNav(data);
        }
      }
    );
    this.getNextQuestionSequenceService = this.contentService.getNextWorksheetSequence().subscribe(result => {
      this.unitSequenceNo = _.get(result, 'sequence', 1);
      if (this.unitSequenceNo - 1 > 25) {
        if (this.max_range <= this.totalQues) {
          this.max_range = this.unitSequenceNo - 1;
          this.startQuesRange = this.max_range - 25;
        }
      } else {
        this.max_range = 25;
        this.startQuesRange = 0;
      }
    });
    this.sharedService.getAndClearCookies();
  }
  setCurrentQuestion() {
    if (this.questionId !== '') {
      for (let i = 0; i < this.quesNumTotal.length; i++) {
        if (this.quesNumTotal[i]['unitID'] == this.questionId) {
          this.selectedQuestionNum = this.quesNumTotal[i];
        }
      }
    } else {
      this.selectedQuestionNum = this.quesNumTotal[0];
    }
    let tmpNextUnitSeqNum = 1;
    if(typeof(this.selectedQuestionNum)!='undefined'){
      if(typeof(this.selectedQuestionNum.unitSequenceNo)!='undefined'){
        tmpNextUnitSeqNum=this.selectedQuestionNum.unitSequenceNo + 1;
      }
    }
    this.contentService.setNextWorksheetSequence(tmpNextUnitSeqNum);
  }
  ngOnDestroy() {
    this.getQuestionDataService.unsubscribe();
    this.getQuestionContentService.unsubscribe();
    this.WorksheetQuesNavService.unsubscribe();
    this.getNextQuestionSequenceService.unsubscribe();
  }

  displayQues(quesNum) {
    this.selectedQuestionNum = quesNum;
    const unitSequenceNo = _.get(quesNum, 'unitSequenceNo', 1);
    this.contentService.setNextWorksheetSequence(unitSequenceNo);
    this.contentService.setFromWorksheet('nav');
    this.contentService.setQuestionSubmit(true);
  }

  changeQuestions(action) {
    if (action === 'prev') {
      if (this.startQuesRange > 0) {
        this.startQuesRange = this.startQuesRange - 1;
        this.max_range = this.max_range - 1;
      }
    } else if (action === 'next') {
      if (this.max_range <= this.totalQues) {
        this.startQuesRange = this.startQuesRange + 1;
        this.max_range = this.max_range + 1;
      }
    }
  }


  getProgressClass(quesNum) {
    let unitStatus: string, className = '';
    unitStatus = _.get(quesNum, 'unitStatus', '');
    if (unitStatus !== (null && undefined)) {
      unitStatus = unitStatus.toLowerCase();
      switch (unitStatus) {
        case 'completed':
          if (quesNum == this.selectedQuestionNum) {
            className = 'current-active'
          } else {
            className = 'completed';
          }
          break;
        case 'in-progress':
          if (quesNum == this.selectedQuestionNum) {
            className = 'current-active'
          }
          break;
      }
    }
    return className;
  }


}
