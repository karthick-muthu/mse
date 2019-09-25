import { Component, OnInit, OnChanges, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'ms-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnChanges {
  @Input() template: any;
  @Input() profileInfo: any;
  @Input() questionDetail: any;
  @Input() rewardsList: any;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: any): void {
    const changeValue = _.get(changes, 'profileInfo.currentValue', null);
    const changeValueQ = _.get(changes, 'questionDetail.currentValue', null);
    const changeValueR = _.get(changes, 'rewardsList.currentValue', null);
    if (changeValue !== undefined && changeValue !== null) {
      this.profileInfo = changeValue;
    }
    if (changeValueQ !== undefined && changeValueQ !== null) {
      this.questionDetail = changeValueQ;
    }
    if (changeValueR !== undefined && changeValueR !== null) {
      this.rewardsList = changeValueR;
    }
  }

}
