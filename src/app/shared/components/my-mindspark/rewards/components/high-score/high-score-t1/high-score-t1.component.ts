import { Component, Input, OnChanges } from '@angular/core';
import { SharedService } from '../../../../../../shared.service';
import * as _ from 'lodash';
import { RewardsComponent } from '../../../../../../../modules/my-mindspark/components/rewards/rewards.component';

@Component({
  selector: 'ms-high-score-t1',
  templateUrl: './high-score-t1.component.html',
  styleUrls: ['./high-score-t1.component.scss']
})
export class HighScoreT1Component implements OnChanges {

  @Input('currentMonth') currentMonth: any;
  @Input('groupSparkieData') groupSparkieData: any;
  @Input('championsInfo') championsInfo: any;
  sparkiesStarsMonth = [];
  moreExplanation: boolean[] = [];
  leaderData: any = [];
  displaySize = 4;

  constructor(private sharedService: SharedService, private rewardsComponent: RewardsComponent) {
  }

  ngOnChanges(changes: any): void {
    const currentMonthChanges = _.get(changes, 'currentMonth.currentValue', null);
    if (currentMonthChanges !== undefined && currentMonthChanges !== null) {
      this.currentMonth = currentMonthChanges;
    }
    const groupSparkieDataChanges = _.get(changes, 'groupSparkieData.currentValue', null);
    if (groupSparkieDataChanges !== undefined && groupSparkieDataChanges !== null) {
      this.groupSparkieData = groupSparkieDataChanges;
    }
    const championsInfoChanges = _.get(changes, 'championsInfo.currentValue', null);
    if (championsInfoChanges !== undefined && championsInfoChanges !== null) {
      this.championsInfo = championsInfoChanges;
      this.championsInfo.forEach((champ) => {
        const newChamp = this.getChamp(champ);
        const maxSparkie = newChamp.maxSparkie;
        for (let i = 0; i < maxSparkie.length; i++) {
          if (maxSparkie[i].thisUser) {
            const thisUserData: any = maxSparkie.splice(i, 1);
            maxSparkie.unshift(thisUserData[0]);
          }
        }
        newChamp.maxSparkie = maxSparkie;
        if (newChamp.maxSparkie.length > 0) {
          const sparkie = {
            month: newChamp.month,
            starOftheMonth: {
              name: newChamp.maxSparkie[0].name,
              count: newChamp.maxSparkie[0].count,
              thisUser: newChamp.maxSparkie[0].thisUser,
            },
            othernames: this.getMoreChamps(newChamp.maxSparkie),
            othercount: newChamp.others
          };
          this.sparkiesStarsMonth.push(sparkie);
          this.showMoreExplanation(sparkie);
        }
      });
    }

  }

  getChamp(champ) {

    if (champ) {

      // Sort data by count - just incase the data returned by the API is not ordered
      const sortedSparkies = champ.maxSparkie.sort((a, b) => {
        if (a.count < b.count) { return 1; }
        if (a.count > b.count) { return -1; }
        return 0;
      });

      // Convert count into a string - since groupBy logic requires a key (string)
      const sparkiesString = sortedSparkies.map((item, i) => {
        item.count = item.count + '';
        return item;
      });

      // GroupBy based on count - returns a map of keys containing grouped arrays
      const grouped = this.groupBy(sparkiesString, item => item.count);

      // Convert grouped map into a list array
      const list = [];
      grouped.forEach((item) => {
        list.push(item);
      });

      const finalList = list.slice(0, 1);
      // length minus 1 since we only need to show the ones which have more than 1
      champ.others = (finalList[0]) ? finalList[0].length - 1 : 0;
      champ.maxSparkie = (finalList[0]) ? finalList[0] : [];

      return champ;
    }
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      if (!map.has(key)) {
        map.set(key, [item]);
      } else {
        map.get(key).push(item);
      }
    });
    return map;
  }

  getMoreChamps(otherChamps) {
    if (otherChamps.length > 1) {
      const tempChamps = otherChamps.slice(0);
      const moreChamps = tempChamps.slice(1, tempChamps.length);
      return moreChamps;
    } else {
      return [];
    }
  }

  toggleMorePopover(i, leaders) {
    this.showMore(leaders);
    this.rewardsComponent.toggleExplanation(i, this.moreExplanation);
  }

  showMore(leaders) {
    const more = [];
    leaders.forEach((leader) => {
      more.push(leader.name);
    });
    // Remove first item - since its already displayed
    // more.shift();
    this.leaderData = more;
    return more;
  }

  showMoreExplanation(leaderboard) {
    for (let i = 0; i < leaderboard.length; i++) {
      this.moreExplanation.push(false);
    }
    return this.moreExplanation;
  }
}
