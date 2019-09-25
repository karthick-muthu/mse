import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'angular2-moment';
import { ProgressBarModule } from 'ng2-progress-bar';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { TranslateLoader, TranslateStaticLoader } from 'ng2-translate/src/translate.service';
import { QuestionsComponent } from './questions.component';
import { QuestionsHeaderComponent } from '../header/questions-header/questions-header.component';
import { QuestionsStructureComponent } from './questions-structure/questions-structure.component';
import { QuestionsFooterComponent } from '../footer/questions-footer/questions-footer.component';
import { QuestionConceptComponent } from '../header/questions-header/components/question-concept/question-concept.component';
import { QuestionNavigationComponent } from '../header/questions-header/components/question-navigation/question-navigation.component';
import { DefaultComponent } from '../header/questions-header/components/question-navigation/default/default.component';
import { TimeTestComponent } from '../header/questions-header/components/question-navigation/time-test/time-test.component';
import { WorksheetComponent } from '../header/questions-header/components/question-navigation/worksheet/worksheet.component';
import { SparkiesComponent } from '../header/questions-header/components/sparkies/sparkies.component';
import { QuestionTypeComponent } from './question-type/question-type.component';
import { QuestionAlertsComponent } from './question-alerts/question-alerts.component';
import { QuestionTimerComponent } from './question-timer/question-timer.component';
import { QuestionHintComponent } from './question-hint/question-hint.component';
import { QuestionExplanationComponent } from './question-explanation/question-explanation.component';
import { QuestionSidebarBtnComponent } from './question-sidebar-btn/question-sidebar-btn.component';
import { DoneBtnModalComponent } from '../header/questions-header/components/done-btn-modal/done-btn-modal.component';
import { SessionReportModalComponent } from './session-report/session-report-modal/session-report-modal.component';
import { WorsheetModalComponent } from './worsheet-modal/worsheet-modal.component';
import { MathButtonComponent } from '../math-button/math-button.component';
import { ProgressModalComponent } from './progress-modal/progress-modal.component';

import { QuestionsService } from './questions.service';
import { MathsService } from '../../services/maths/maths.service';
import { SessionReportService } from './session-report/services/session-report/session-report-service.service';
import { DoAPICallService } from '../../services/doAPICall/doAPICall.service';
import { MathQuillService } from '../../services/mathquill/mathquill.service';

import { MathsDirective } from '../../directives/maths/maths.directive';
import { ContentPreviewComponent } from '../content-preview/content-preview.component';

import { MinutesSecondsPipe } from './session-report/filters/minutes-seconds.pipe';
import { OrdinalNamePipe } from '../../pipes/ordinalName/ordinalName.pipe';
import { MinuteSecondPipe } from '../../pipes/minuteSecond/minuteSecond.pipe';
import { SanitizeCodePipe } from '../../pipes/sanitize/sanitizeCode.pipe';
import { VernacularBtnComponent } from './vernacular-btn/vernacular-btn.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { RoundProgressModule, RoundProgressConfig } from 'angular-svg-round-progressbar';
import { SparkieAlertsComponent } from './sparkie-alerts/sparkie-alerts.component';
import { RevisionAlertComponent } from './revision-alert/revision-alert.component';


import { environment } from '../../../../environments/environment';
import { CpQuestionsStructureComponent } from '../content-preview/components/cp-questions-structure/cp-questions-structure.component';
import { CpQuestionsFooterComponent } from '../content-preview/components/cp-questions-footer/cp-questions-footer.component';

export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, './assets/i18n', '.json?v=' + environment.releaseVersion);
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),
    RouterModule,
    MomentModule,
    ProgressBarModule,
    RoundProgressModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
    })
  ],
  exports: [
    QuestionsComponent,
    QuestionsStructureComponent,
    QuestionsHeaderComponent,
    QuestionConceptComponent,
    DoneBtnModalComponent,
    QuestionNavigationComponent,
    DefaultComponent,
    TimeTestComponent,
    WorksheetComponent,
    SparkiesComponent,
    QuestionsFooterComponent,
    QuestionTypeComponent,
    QuestionExplanationComponent,
    QuestionHintComponent,
    QuestionAlertsComponent,
    QuestionTimerComponent,
    QuestionSidebarBtnComponent,
    WorsheetModalComponent,
    SessionReportModalComponent,
    MinutesSecondsPipe,
    OrdinalNamePipe,
    MinuteSecondPipe,
    SanitizeCodePipe,
    MathsDirective,
    MathButtonComponent,
    VernacularBtnComponent,
    ProgressModalComponent,
    SparkieAlertsComponent,
    RevisionAlertComponent,
    ContentPreviewComponent,
    CpQuestionsStructureComponent,
    CpQuestionsFooterComponent
  ],
  declarations: [
    QuestionsComponent,
    QuestionsStructureComponent,
    QuestionsHeaderComponent,
    QuestionConceptComponent,
    DoneBtnModalComponent,
    QuestionNavigationComponent,
    DefaultComponent,
    TimeTestComponent,
    WorksheetComponent,
    SparkiesComponent,
    QuestionsFooterComponent,
    QuestionTypeComponent,
    QuestionExplanationComponent,
    QuestionHintComponent,
    QuestionAlertsComponent,
    QuestionTimerComponent,
    QuestionSidebarBtnComponent,
    WorsheetModalComponent,
    SessionReportModalComponent,
    MinutesSecondsPipe,
    OrdinalNamePipe,
    MinuteSecondPipe,
    SanitizeCodePipe,
    MathsDirective,
    MathButtonComponent,
    VernacularBtnComponent,
    ProgressModalComponent,
    SparkieAlertsComponent,
    RevisionAlertComponent,
    ContentPreviewComponent,
    CpQuestionsStructureComponent,
    CpQuestionsFooterComponent
  ],
  providers: [
    QuestionsService,
    SessionReportService,
    MathsService,
    DoAPICallService,
    MathQuillService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    WorsheetModalComponent,
    SessionReportModalComponent,
    ProgressModalComponent,
    SparkieAlertsComponent,
    RevisionAlertComponent
  ]
})
export class QuestionsModule { }
