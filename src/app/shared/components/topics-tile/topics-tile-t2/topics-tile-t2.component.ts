import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AppSettings } from '../../../../settings/app.settings';
import { SearchFilterPipe } from '../../../../modules/topics/filters/search-filter.pipe';
import { SlugifyPipe } from 'ngx-pipes';
import { TopicsTileComponent } from '../topics-tile.component';
import { WorksheetTileComponent } from '../../worksheet-tile/worksheet-tile.component';
import * as _ from 'lodash';

@Component({
  selector: 'ms-topics-tile-t2',
  templateUrl: './topics-tile-t2.component.html',
  styleUrls: ['./topics-tile-t2.component.scss'],
  providers: [SearchFilterPipe, SlugifyPipe, TopicsTileComponent, WorksheetTileComponent]
})
export class TopicsTileT2Component implements OnInit, OnChanges {

  showLockedOverlayText: boolean;
  @Input('for') for: string;
  @Input('topicList') topicList: any;
  @Input('template') template: string;
  @Input('search') search: any;
  @Input('endDate') endDate: any;
  @Input('isProfileVisible') isProfileVisible: boolean;
  @Input('grade') grade: boolean;
  @Input('showHigherGrades') showHigherGrades: boolean;
  @Input('priorityContents') priorityContents: any;

  overlayButton: boolean;
  isClassVisible: boolean;
  moreOptions: boolean[] = [];
  lockedTopicsOptions: boolean[] = [];
  topicImageDefault: string = AppSettings.TOPIC_DEFAULT_IMAGE;
  hasLockedTopic: boolean;

  constructor(private topicsTileComponent: TopicsTileComponent, private worksheetTileComponent: WorksheetTileComponent) {

    this.overlayButton = false;
  }

  ngOnInit() {
    this.hasLockedTopic = false;
    this.isClassVisible = false;
    if (this.topicList) {
      this.addMoreOptions(this.topicList);
    }
  }

  ngOnChanges(changes: any) { }

  startTopic(topic, button) {
    this.topicsTileComponent.startTopic(topic, button);
  }


  addMoreOptions(topicsList) {
    this.moreOptions = this.topicsTileComponent.addMoreOptions(topicsList);
    this.lockedTopicsOptions = this.topicsTileComponent.addMoreLockedOptions(topicsList);
    for (let i = 0; i < topicsList.length; i++) {
      if (this.topicList[i].lock) {
        this.hasLockedTopic = true;
      }
    }
  }


  setTopicsClearedProgress(progressValue) {
    return this.topicsTileComponent.setTopicsClearedProgress(progressValue);
  }

  triggerOverlayForLockedTopics(topic, index) {
    const lockedStatus = _.get(topic, 'lock', false);
    if (lockedStatus) {
      this.moreOptions[index] = false;
      this.lockedTopicsOptions[index] = !this.lockedTopicsOptions[index];
    }
  }

  showOverlay(contentID, index) {
    this.overlayButton = this.topicsTileComponent.showOverlay(contentID, index);
  }

  goToDetailsPage(topic) {
    this.topicsTileComponent.goToDetailsPage(topic);
  }
  getTopicProgress(cleared, overall) {
    return this.topicsTileComponent.getTopicProgress(cleared, overall);
  }
  worksheetTileActions(worksheet, type) {
    if (type === 'report') {
      this.worksheetTileComponent.worksheetReport(worksheet);
    } else if (type === 'learn') {
      this.worksheetTileComponent.startWorksheets(worksheet);
    }
  }
  openTopicTrails(topicId) {
    this.topicsTileComponent.openTopicTrails(topicId);
  }
}
