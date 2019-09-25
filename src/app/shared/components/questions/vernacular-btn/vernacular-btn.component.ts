import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ContentService } from '../../../services/content/content.service';
import * as _ from 'lodash';

@Component({
  selector: 'ms-vernacular-btn',
  templateUrl: './vernacular-btn.component.html',
  styleUrls: ['./vernacular-btn.component.scss']
})
export class VernacularBtnComponent implements OnDestroy {
  private getTranslationContentService: Subscription;
  translationContent: any;
  showTranslation: boolean;
  translationToggle: string;

  constructor(private contentService: ContentService) {
    this.getTranslationContentService = this.contentService.getTranslationContent().subscribe(
      result => {
        this.translationContent = result;
        this.showTranslation = _.get(this.translationContent, 'showTranslation', false);
        this.translationToggle = (this.showTranslation) ? 'hide translation' : 'show translation';
      }
    );
  }

  ngOnDestroy() {
    this.getTranslationContentService.unsubscribe();
  }

  toggleVernacular() {
    this.translationContent.showTranslation = !this.showTranslation;
    this.contentService.setTranslationContent(this.translationContent);
  }

  getButtonPosition() {
    let contentContainer, positionWidth;
    contentContainer = (<HTMLElement>document.getElementById('contentContainer'));
    if (contentContainer) {
      positionWidth = (window.innerWidth - contentContainer.offsetWidth) / 2;
    }
    return { 'right': positionWidth + 'px' };
  }

}
