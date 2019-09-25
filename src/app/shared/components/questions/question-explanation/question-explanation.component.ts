import { Component, OnInit, OnChanges, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../../../shared.service';
import { ContentService } from '../../../services/content/content.service';
import { QuestionsComponent } from '../questions.component';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

@Component({
  selector: 'ms-question-explanation',
  templateUrl: './question-explanation.component.html',
  styleUrls: ['./question-explanation.component.scss']
})
export class QuestionExplanationComponent implements OnInit, OnChanges, OnDestroy {
  from: any;
  @Output() emitpass = new EventEmitter;
  @Input('questionVoiceOver') questionVoiceOver: string;
  @Input('result') result: any;
  @Input('questionTemplate') questionTemplate: any;
  @Input('viewType') viewType: any;
  @Input('display') display: any;
  @Input('lang') lang: string;
  @Input('isContentPreview') isContentPreview: string;
  private contentMode: any;
  private displayMessages: any;
  answer: string;
  explanationText: any;
  question: any;
  grade: any;
  isDynamic: any;
  private getQuestionContentService: any;
  private getQuestionDisplayContentService: Subscription;

  constructor(private contentService: ContentService, private sharedService: SharedService,
    private questionsComponent: QuestionsComponent) {
    this.answer = '';
    this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(
      result => {
        this.contentMode = _.get(result, 'contentMode', '').toLowerCase();
        this.displayMessages = _.get(result, 'displayMessages', []);
        this.from = _.get(result, 'from', '');
        this.grade = _.get(result, 'grade', '');
        this.isDynamic = _.get(result, 'isDynamic', '');

      }
    );
    this.getQuestionDisplayContentService = this.contentService.getQuestionDisplayContent().subscribe(
      result => {
        this.question = _.get(result, 'content', {});
      });
  }

  ngOnInit() { }

  ngOnChanges(changes: any): void {
    const evaluationResultChange = _.get(changes, 'result.currentValue', null);
    const questionTemplateChange = _.get(changes, 'questionTemplate.currentValue', null);
    const viewTypeChange = _.get(changes, 'viewType.currentValue', null);
    const langChange = _.get(changes, 'lang.currentValue', null);
    if (evaluationResultChange !== null && evaluationResultChange !== undefined) {
      this.result = evaluationResultChange;
      if (this.display === 'translated') {
        this.result.translatedexplanation = this.questionsComponent.getTranslatedExplanation();
      }
      this.setAnswer(this.result);
    }
    if (questionTemplateChange !== null && questionTemplateChange !== undefined) {
      this.questionTemplate = questionTemplateChange;
    }
    if (viewTypeChange !== null && viewTypeChange !== undefined) {
      this.viewType = viewTypeChange;
    }
    if (langChange !== null && langChange !== undefined) {
      this.lang = langChange;
      setTimeout(() => {
        this.getTranslatedText();
      }, 200);
    }
  }

  ngOnDestroy() {
    this.getQuestionContentService.unsubscribe();
  }

  setAnswer(result) {
    const correctAnswer = _.get(this.result, 'correctAnswer', '');
    if (this.questionTemplate !== undefined && this.questionTemplate !== null) {
      if (this.questionTemplate.toLowerCase() === 'mcq') {
        this.answer = this.questionsComponent.getAnswerKey(correctAnswer);
      } else {
        /* const answers = [];
        _.forEach(correctAnswer, function (value, key) {
          answers.push(value);
        });
        this.answer = answers.join(', '); */
        this.answer = null;
      }
    }
  }

  showExplanation() {
    let noMoreAttempts: boolean, explanation: string, hasExplanation: boolean, result: any;
    if (this.from !== 'worksheet') {
      noMoreAttempts = _.get(this.result, 'noMoreAttempts', false);
      explanation = _.get(this.result, 'explanation', null);
      hasExplanation = (explanation !== null && explanation !== undefined && explanation !== '');
      result = _.get(this.result, 'result', '');
      result = (result === 'correct') ? true : result;
      result = (result === 'incorrect') ? false : result;
      if (noMoreAttempts && hasExplanation && (result === true || result === false)) {
        const isFirstAttempt = _.indexOf(this.displayMessages, 'challengeAttempt1') > -1;
        return (this.contentMode === 'challenge' && isFirstAttempt) ? result : true;
      }
    }
    return false;
  }
  private getTranslatedText() {
    const keys = { 'correct answer': 'correctAnswer', 'why you might have gone wrong': 'whyGoneWrong', 'explanation': 'explanation' };
    this.sharedService.getTranslatedText(keys, this.lang).then(
      result => this.explanationText = result
    );
  }
  playQuestionAudio() {
    this.emitpass.emit(this.questionVoiceOver);
  }
}
