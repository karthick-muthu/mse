import { Component, Input, OnChanges } from '@angular/core';
import { SharedService } from '../../../../../../shared.service';
import * as _ from 'lodash';
import { RewardsComponent } from '../../../../../../../modules/my-mindspark/components/rewards/rewards.component';

@Component({
  selector: 'ms-champions-t2',
  templateUrl: './champions-t2.component.html',
  styleUrls: ['./champions-t2.component.scss']
})
export class ChampionsT2Component implements OnChanges {

  @Input('championsInfo') championsInfo: any;
  championsForEachMonth = [];
  moreExplanation: boolean[] = [];
  leaderData: any = [];
  displaySize = 4;

  constructor(private sharedService: SharedService, private rewardsComponent: RewardsComponent) { }

  ngOnChanges(changes: any): void {
    const championsInfoChanges = _.get(changes, 'championsInfo.currentValue', null);
    if (championsInfoChanges !== undefined && championsInfoChanges !== null) {
      this.championsInfo = championsInfoChanges;
      this.generateChampionsList();
    }
  }

  private generateChampionsList() {
    let champion;
    this.championsInfo.forEach((champ) => {
      let sparkie = {}, shield = {}, achievement = {};
      const newChamp = this.getChamp(champ);
      if (newChamp.maxSparkie.length > 0) {
        sparkie = this.generateNewChampContent(newChamp, 'maxSparkie');
      }
      if (newChamp.maxShield.length > 0) {
        shield = this.generateNewChampContent(newChamp, 'maxShield');
      }
      if (newChamp.maxAchievements.length > 0) {
        achievement = this.generateNewChampContent(newChamp, 'maxAchievements');
      }
      champion = {
        month: newChamp.month,
        sparkie: sparkie,
        shield: shield,
        achievement: achievement
      };
      this.championsForEachMonth.push(champion);
      this.showMoreExplanation(champion);
    });
  }

  generateNewChampContent(newChamp: any, type: string) {
    newChamp[type] = this.getReorderedChampDetails(newChamp[type]);
    const champ: any = {
      starOftheMonth: this.getStarOftheMonthDetails(newChamp[type]),
      othernames: this.getMoreChamps(newChamp[type]),
      othercount: this.getChampOtherCount(newChamp, type)
    };
    return champ;
  }

  getReorderedChampDetails(newChamp: any) {
    for (let i = 0; i < newChamp.length; i++) {
      if (newChamp[i].thisUser) {
        const thisUserData: any = newChamp.splice(i, 1);
        newChamp.unshift(thisUserData[0]);
      }
    }
    return newChamp;
  }

  getStarOftheMonthDetails(newChamp: any) {
    const starOftheMonth = {
      name: newChamp[0].name,
      count: newChamp[0].count,
      thisUser: newChamp[0].thisUser
    };
    return starOftheMonth;
  }

  getChampOtherCount(newChamp: any, type: string) {
    if (type === 'maxSparkie') {
      return newChamp.otherSparkie;
    } else if (type === 'maxShield') {
      return newChamp.otherShield;
    } else if (type === 'maxAchievements') {
      return newChamp.otherAchievement;
    }
    return null;
  }

  getChamp(champ) {

    if (champ) {

      // Sort data by count - just incase the data returned by the API is not ordered
      const sortedSparkies = champ.maxSparkie.sort((a, b) => {
        if (a.count < b.count) { return 1; }
        if (a.count > b.count) { return -1; }
        return 0;
      });

      const sortedShield = champ.maxShield.sort((a, b) => {
        if (a.count < b.count) { return 1; }
        if (a.count > b.count) { return -1; }
        return 0;
      });

      const sortedAchievement = champ.maxAchievements.sort((a, b) => {
        if (a.count < b.count) { return 1; }
        if (a.count > b.count) { return -1; }
        return 0;
      });
      // Convert count into a string - since groupBy logic requires a key (string)
      const sparkiesString = sortedSparkies.map((item, i) => {
        item.count = item.count + '';
        return item;
      });

      const shieldString = sortedShield.map((item, i) => {
        item.count = item.count + '';
        return item;
      });

      const achievementString = sortedAchievement.map((item, i) => {
        item.count = item.count + '';
        return item;
      });
      // GroupBy based on count - returns a map of keys containing grouped arrays
      const groupedSparkie = this.groupBy(sparkiesString, item => item.count);

      const groupedShield = this.groupBy(shieldString, item => item.count);

      const groupedAchievement = this.groupBy(achievementString, item => item.count);
      // Convert grouped map into a list array

      const sparkieList = [];
      groupedSparkie.forEach((item) => {
        sparkieList.push(item);
      });

      const shieldList = [];
      groupedShield.forEach((item) => {
        shieldList.push(item);
      });

      const achievementList = [];
      groupedAchievement.forEach((item) => {
        achievementList.push(item);
      });

      const finalList = sparkieList.slice(0, 1);
      const finalShieldList = shieldList.slice(0, 1);
      const finalAchievementList = achievementList.slice(0, 1);

      // length minus 1 since we only need to show the ones which have more than 1
      if (finalList.length > 0) {
        champ.otherSparkie = finalList[0].length - 1;
      }
      if (finalShieldList.length > 0) {
        champ.otherShield = finalShieldList[0].length - 1;
      }
      if (finalAchievementList.length > 0) {
        champ.otherAchievement = finalAchievementList[0].length - 1;
      }
      if (champ.maxSparkie.length > 0) {
        champ.maxSparkie = finalList[0];
      }
      if (champ.maxShield.length > 0) {
        champ.maxShield = finalShieldList[0];
      }
      if (champ.maxAchievements.length > 0) {
        champ.maxAchievements = finalAchievementList[0];
      }

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
