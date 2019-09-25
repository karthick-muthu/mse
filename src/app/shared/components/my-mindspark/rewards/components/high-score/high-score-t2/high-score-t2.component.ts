import { Component, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { SharedService } from '../../../../../../shared.service';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';

@Component({
  selector: 'ms-high-score-t2',
  templateUrl: './high-score-t2.component.html',
  styleUrls: ['./high-score-t2.component.scss']
})
export class HighScoreT2Component implements OnChanges {
  @Input('groupSparkieData') groupSparkieData: any;
  @Input('groupShieldData') groupShieldData: any;
  @Input('groupAchivementData') groupAchivementData: any;
  @Input('currentMonth') currentMonth: any;
  displaySize = 4;

  constructor(private sharedService: SharedService) {
  }

  ngOnChanges(changes: any): void {
    const tempGroupSparkieData = _.get(changes, 'groupSparkieData.currentValue', null);
    if (tempGroupSparkieData !== null && tempGroupSparkieData !== undefined) {
      this.groupSparkieData = tempGroupSparkieData;
    }
    const tempGroupShieldData = _.get(changes, 'groupShieldData.currentValue', null);
    if (tempGroupShieldData !== null && tempGroupShieldData !== undefined) {
      this.groupShieldData = tempGroupShieldData;
    }
    const tempGroupAchivementData = _.get(changes, 'groupAchivementData.currentValue', null);
    if (tempGroupAchivementData !== null && tempGroupAchivementData !== undefined) {
      this.groupAchivementData = tempGroupAchivementData;
    }
    const tempCurrentMonth = _.get(changes, 'currentMonth.currentValue', null);
    if (tempCurrentMonth !== null && tempCurrentMonth !== undefined) {
      this.currentMonth = tempCurrentMonth;
    }
  }

}
