import { Component, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { RewardsT1Component } from '../rewards-t1/rewards-t1.component';

@Component({
  selector: 'ms-rewards-t2',
  templateUrl: './rewards-t2.component.html',
  styleUrls: ['./rewards-t2.component.scss']
})
export class RewardsT2Component implements OnChanges {
  @Input('rewardsInfo') rewardsInfo: any;
  userInformation: any;
  championsInfo: any;
  groupAchivementData: any;
  groupShieldData: any;
  groupSparkieData: any;
  currentMonth: any;
  userRewardInfo: any;

  ngOnChanges(changes: any): void {
    const changesRewardsInfo = _.get(changes, 'rewardsInfo.currentValue', null);
    if (changesRewardsInfo !== undefined && changesRewardsInfo !== null) {
      this.rewardsInfo = changesRewardsInfo;
      this.userRewardInfo = _.get(this.rewardsInfo, 'userRewardInfo', null);
      this.currentMonth = _.get(this.rewardsInfo, 'currentMonth', null);
      this.groupSparkieData = _.get(this.rewardsInfo, 'groupSparkieData', null);
      this.groupShieldData = _.get(this.rewardsInfo, 'groupShieldData', null);
      this.groupAchivementData = _.get(this.rewardsInfo, 'groupAchivementData', null);
      this.championsInfo = _.get(this.rewardsInfo, 'championsInfo', null);
      this.userInformation = _.get(this.rewardsInfo, 'userInformation', null);
    }
  }

}
