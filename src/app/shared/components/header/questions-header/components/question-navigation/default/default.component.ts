import { Component, OnChanges, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { SharedService } from '../../../../../../shared.service';
import { ContentService } from '../../../../../../services/content/content.service';
import { QuestionsComponent } from '../../../../../questions/questions.component';
import * as _ from 'lodash';

@Component({
  selector: 'ms-default',
  templateUrl: './default.component.html',
  styleUrls: ['../question-navigation.component.scss']
})
export class DefaultComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input('from') from: any;
  @Input('pedagogyContent') pedagogyContent: any;
  pedagogyChild: any;
  template: string;
  templateClass: string;
  circleProgressBgColor: string;
  contentName: string;
  contentSubMode: string;
  unitName: string;
  maxProgressList = 14;
  leftPosition: any = {};
  animationStyle: any[];
  errorInfo: any;
  private contentDetails: any;
  private animateConceptInterval: any;
  private previousPedagogyContent: any;
  private getTemplateService: Subscription;
  private getQuestionContentService: Subscription;

  constructor(private sharedService: SharedService, private contentService: ContentService,
    private questionsComponent: QuestionsComponent) {
    this.getTemplateService = this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
        this.circleProgressBgColor = (this.template === '1') ? '#3BB29E' : '#0079b5';
      },
      responseError => this.errorInfo = responseError
    );
    this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(
      result => {
        this.contentDetails = result;
        this.contentSubMode = _.get(this.contentDetails, 'contentSubMode', '');
        this.setContentName();
      },
      responseError => this.errorInfo = responseError
    );
  }

  ngOnChanges(changes: any): void {
    let current, total, unitList, unit, unitStatus, animationStyle;
    const changePedagogyContent = _.get(changes, 'pedagogyContent.currentValue', null);
    this.previousPedagogyContent = _.get(changes, 'pedagogyContent.previousValue', null);
    const changeFrom = _.get(changes, 'from.currentValue', null);
    if (changePedagogyContent !== undefined && changePedagogyContent !== null) {
      this.animationStyle = [];
      this.pedagogyContent = changePedagogyContent;
      this.pedagogyChild = _.get(changePedagogyContent, 'child', {});
      current = _.get(this.pedagogyContent, 'progress.currentUnitNum', 0);
      total = _.get(this.pedagogyContent, 'progress.totalUnits', 0);
      unitList = _.get(this.pedagogyContent, 'progress.unitList', []);
      this.unitName = _.get(this.pedagogyChild, 'name', '');
      // for (let i = 0; i < unitList.length; i++) {
      //   unit = unitList[i];
      //   unitStatus = _.get(unit, 'unitStatus', '');
      //   if (unitStatus && unitStatus.toLowerCase() === 'in-progress') {
      //   }
      // }
      if (this.showConceptProgress()) {
        const progress = _.get(this.pedagogyChild, 'progress', []);
        for (let i = 0; i < progress.length; i++) {
          if (this.previousPedagogyContent === null || this.previousPedagogyContent === undefined) {
            animationStyle = { 'visibility': 'hidden' };
          } else {
            animationStyle = { 'visibility': 'visible' };
          }
          this.animationStyle.push(animationStyle);
        }
      }
      this.pedagogyContent.progressPercent = (total > 0) ? ((current - 1) / total) * 100 : 0;
      this.setContentName();
      this.setLeftPosition(this.pedagogyChild);
    }
    if (changeFrom !== undefined && changeFrom !== null) {
      this.from = changeFrom;
    }
  }

  ngAfterViewInit() {
    this.loadProgressAnimation();
  }

  ngOnDestroy() {
    this.getTemplateService.unsubscribe();
    this.getQuestionContentService.unsubscribe();
    if (this.animateConceptInterval) { clearInterval(this.animateConceptInterval); }
  }

  setContentName() {
    this.contentName = _.get(this.contentDetails, 'contentName', '');
  }

  loadProgressAnimation() {
    const progress = _.get(this.contentDetails, 'header.pedagogyContentRight.child.progress', null);
    if (this.contentDetails && progress) {
      this.animateConceptProgress(progress);
    } else {
      setTimeout(() => { this.loadProgressAnimation(); }, 100);
    }
  }

  showConceptProgress(): boolean {
    const disallowedTemplate = ['game', 'timedtest', 'enrichment'];
    const templateContent = _.get(this.contentDetails, 'templateContent', '').toLowerCase();
    if (_.indexOf(disallowedTemplate, templateContent) > -1) {
      return false;
    }
    return true;
  }

  animateConceptProgress(progress) {
    let modalConceptCircles: any, conceptCircles: any, conceptCirclesLength: number, initialLoad: number, index = 0;
    const position = this.getCurrentPosition(progress);
    initialLoad = (position > this.maxProgressList) ? (position - (this.maxProgressList - 2)) : 0;
    modalConceptCircles = document.getElementsByClassName('modal-content');
    modalConceptCircles = (modalConceptCircles) ? modalConceptCircles[0] : null;
    modalConceptCircles = (modalConceptCircles) ? modalConceptCircles.getElementsByClassName('circle-nav') : null;
    conceptCircles = document.getElementsByClassName('circle-nav');
    conceptCirclesLength = conceptCircles.length;
    index = this.loadProgressImmediately(initialLoad, index, conceptCircles, modalConceptCircles);
    if (this.animateConceptInterval) { clearInterval(this.animateConceptInterval); }
    this.animateConceptInterval = setInterval(() => {
      if (index < conceptCirclesLength && (index - initialLoad) <= this.maxProgressList &&
        (this.previousPedagogyContent === null || this.previousPedagogyContent === undefined)) {
        this.updateConceptProgress(conceptCircles, modalConceptCircles, index);
      } else {
        clearInterval(this.animateConceptInterval);
        if (conceptCirclesLength > this.maxProgressList) {
          index = this.loadProgressImmediately(conceptCirclesLength, index, conceptCircles, modalConceptCircles);
        }
      }
      index++;
    }, 333);
  }

  private getCurrentPosition(progress: any): number {
    let position = 0;
    _.forEach(progress, function (list: any, key) {
      if (list.state === 'in-progress') {
        position = parseInt(key.toString(), 10);
      }
    });
    return position;
  }

  private loadProgressImmediately(maxLength: number, index: number, conceptCircles: any, modalConceptCircles: any) {
    for (index; index < maxLength; index++) {
      this.updateConceptProgress(conceptCircles, modalConceptCircles, index);
    }
    return index;
  }

  private updateConceptProgress(conceptCircles: HTMLCollectionOf<Element>, modalConceptCircles: NodeListOf<Element>, index: number) {
    const conceptCircle = (conceptCircles && conceptCircles[index]) ? conceptCircles[index] : null;
    const modalConceptCircle = (modalConceptCircles && modalConceptCircles[index]) ? modalConceptCircles[index] : null;
    if (conceptCircle) {
      conceptCircle.removeAttribute('style');
      conceptCircle.classList.add('animate-concept');
    }
    if (modalConceptCircle) {
      modalConceptCircle.removeAttribute('style');
      modalConceptCircle.classList.add('animate-concept');
    }
  }

  setLeftPosition(lists) {
    this.leftPosition = {};
    if (this.showConceptProgress()) {
      const perUnit = 20, minUnit = 40;
      let totalUnits = 0, position: number;
      const progress = _.get(lists, 'progress', []);
      const progressCount = progress.length;
      if (progressCount > this.maxProgressList) {
        // progressCount -= this.maxProgressList;
        position = this.getCurrentPosition(progress);
        position = (position < this.maxProgressList) ? 0 : (position - this.maxProgressList);
        totalUnits = minUnit - (position * perUnit);
        this.leftPosition = {
          'left': totalUnits + 'px',
          'position': 'absolute',
          'top': '-3px'
        };
      }
    }
  }

}
