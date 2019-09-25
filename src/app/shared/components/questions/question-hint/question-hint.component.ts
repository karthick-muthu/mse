import { Component, OnChanges, Input, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from 'ng2-translate';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../../../shared.service';
import { ContentService } from '../../../services/content/content.service';
import { QuestionsComponent } from '../questions.component';
import * as _ from 'lodash';

@Component({
  selector: 'ms-question-hint',
  templateUrl: './question-hint.component.html',
  styleUrls: ['./question-hint.component.scss'],
  providers: [NgbCarouselConfig]
})
export class QuestionHintComponent implements OnDestroy, OnChanges {
  @Input('showHint') showHint: any;
  @Input('hints') hints: any = [];
  @Input('viewType') viewType: any;
  @Input('result') result: any;
  @Input('display') display: string;
  @Input('lang') lang: string;
  private getTranslationContentService: Subscription;
  private translationContent;
  private toggleHintCount: number;
  private toggleHintTimeout: any;
  private scrollDownInterval: any;
  showHintPopUp: boolean;
  hintText: any;
  translatedHints: any;

  constructor(@Inject(DOCUMENT) private document: Document, config: NgbCarouselConfig, private translate: TranslateService,
    private questionsComponent: QuestionsComponent, private contentService: ContentService, private sharedService: SharedService) {
    this.toggleHintCount = 0;
    config.interval = 0;
    this.showHintPopUp = false;
    this.getTranslationContentService = this.contentService.getTranslationContent().subscribe(
      result => {
        // this.translationContent = result;
        const element = this.document.getElementById('hint-close-original');
        if (element && this.display === 'original') {
          clearTimeout(this.toggleHintTimeout);
          this.toggleOtherHint(this.showHintPopUp);
        }
      }
    );
  }


  ngOnChanges(changes: any): void {
    const showHintChange = _.get(changes, 'showHint.currentValue', null);
    const hintChange = _.get(changes, 'hints.currentValue', null);
    const viewTypeChange = _.get(changes, 'viewType.currentValue', null);
    const resultChange = _.get(changes, 'result.currentValue', null);
    const langChange = _.get(changes, 'lang.currentValue', null);
    if (showHintChange !== null && showHintChange !== undefined) {
      this.showHint = showHintChange;
      this.showHintPopUp = false;
    }
    if (hintChange !== null && hintChange !== undefined) {
      this.hints = hintChange;
      if (this.display === 'translated') {
        this.translatedHints = this.questionsComponent.getTranslatedHints();
      }
      this.showHintPopUp = false;
    }
    if (viewTypeChange !== null && viewTypeChange !== undefined) {
      this.viewType = viewTypeChange;
    }
    if (resultChange !== null && resultChange !== undefined) {
      this.result = resultChange;
    }
    if (langChange !== null && langChange !== undefined) {
      this.lang = langChange;
      setTimeout(() => {
        this.getTranslatedText();
      }, 200);
    }
  }

  ngOnDestroy() {
    this.getTranslationContentService.unsubscribe();
    if (this.scrollDownInterval) { clearInterval(this.scrollDownInterval); }
  }

  toggleHintPopup() {
    this.questionsComponent.useHint();
    this.showHintPopUp = !this.showHintPopUp;
    this.toggleOtherHint(this.showHintPopUp);
    if (this.showHintPopUp) {
      setTimeout(() => { this.scrollToHint(); }, 500);
    }
  }
  private toggleOtherHint(showHint) {
    const elementId = (showHint) ? 'hint-translated' : 'hint-close-translated';
    const element = this.document.getElementById(elementId);
    if (element) {
      this.clickElement(element);
    } else {
      if (this.toggleHintCount < 51) {
        this.toggleHintTimeout = setTimeout(() => { this.toggleOtherHint(showHint); }, 100);
        this.toggleHintCount++;
      } else {
        clearTimeout(this.toggleHintTimeout);
      }
    }
  }
  private scrollToHint() {
    let questionForm, questionHeader, heightCheck, eachScroll, height;
    heightCheck = window.scrollY;
    eachScroll = 10;
    questionForm = document.getElementById('questionForm');
    questionHeader = document.getElementById('questionHeader');
    if (questionForm && questionHeader) {
      height = questionForm.offsetHeight + questionHeader.offsetHeight;
      this.scrollDownInterval = setInterval(() => {
        window.scrollTo(0, heightCheck);
        heightCheck += eachScroll;
        if (heightCheck >= height) { clearInterval(this.scrollDownInterval); }
      }, 20);
    }
  }

  slide(type, display) {
    let element: any, otherElement: any;
    element = this.document.querySelectorAll('.original .carousel-control-' + type);
    otherElement = this.document.querySelectorAll('.translated .carousel-control-' + type);
    this.clickZerothElement(element);
    this.clickZerothElement(otherElement);
  }

  clickZerothElement(element) {
    if (element && element.length > 0) {
      element = element[0] as HTMLElement;
      this.clickElement(element);
    }
  }
  private clickElement(element: any) {
    if (element) {
      element.click();
    }
  }

  private getTranslatedText() {
    const hintKeys = { 'show hint': 'showHint', 'hint': 'hint', 'previous hint': 'previousHint', 'next hint': 'nextHint' };
    this.sharedService.getTranslatedText(hintKeys, this.lang).then(
      result => this.hintText = result
    );
  }

}
