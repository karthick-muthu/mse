import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { RewardsComponent } from '../../../../../../../modules/my-mindspark/components/rewards/rewards.component';
import { SharedService } from '../../../../../../shared.service';
import { ContentService } from '../../../../../../services/content/content.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ms-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit, OnChanges, OnDestroy {
  // Need to pass  input, title, boardtype (for sparkies, sheilds and acheivements) data and size
  private getTemplateService: Subscription;
  @Input('title') title;
  @Input('boardtype') boardtype;
  @Input('data') data;
  @Input('size') size;
  @Input('sparkies') sparkies;
  moreExplanation: boolean[] = [];
  template: any;
  templateClass: any;
  leaderData: any = [];
  leaderboard: any;
  displaySize = 4;

  constructor(private rewardsComponent: RewardsComponent, private sharedService: SharedService, private contentService: ContentService) {
    this.getTemplateService = this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
      });
  }


  ngOnInit() {
    // Get this.leaders from API
    if (this.size !== undefined && this.size !== null) {
      this.displaySize = this.size;
    }
  }

  ngOnChanges(changes: any): void {
    // const currentValue = changes.data.currentValue;
    const leaderInfoChanges = _.get(changes, 'data.currentValue', null);
    if (leaderInfoChanges !== undefined && leaderInfoChanges !== null && leaderInfoChanges.length) {
      this.leaderboard = this.getLeaders(leaderInfoChanges);
      this.showMoreExplanation(this.leaderboard);
    }
    const tempTitle = _.get(changes, 'title.currentValue', null);
    if (tempTitle !== undefined && tempTitle !== null) {
      this.title = tempTitle;
    }
    const tempBoardType = _.get(changes, 'boardtype.currentValue', null);
    if (tempBoardType !== undefined && tempBoardType !== null) {
      this.boardtype = tempBoardType;
    }
    const tempSparkies = _.get(changes, 'sparkies.currentValue', null);
    if (tempSparkies !== undefined && tempSparkies !== null) {
      this.sparkies = tempSparkies;
    }

  }

  ngOnDestroy() {
    this.getTemplateService.unsubscribe();
  }

  showMoreExplanation(leaderboard) {
    for (let i = 0; i < leaderboard.length; i++) {
      this.moreExplanation.push(false);
    }
    return this.moreExplanation;
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
    more.shift();
    this.leaderData = more;
    return more;
  }

  getLeaders(leaders) {
    if (leaders) {
      // Sort data by count - just incase the data returned by the API is not ordered
      const sortedLeaders = leaders.sort((a, b) => {
        if (a.count < b.count) { return 1; }
        if (a.count > b.count) { return -1; }
        return 0;
      });

      // Convert count into a string - since groupBy logic requires a key (string)
      const leadersString = sortedLeaders.map((item, i) => {
        item.count = item.count + '';
        return item;
      });

      // GroupBy based on count - returns a map of keys containing grouped arrays
      const grouped = this.groupBy(leadersString, item => item.count);

      // Convert grouped map into a list array
      const list = [];
      grouped.forEach((item) => {
        list.push(item);
      });

      // Add a rank with ordinal suffix and a hasUser flag
      let storeThisUser;
      list.forEach((item, i) => {
        item.rank = i + 1;

        item.forEach((user) => {
          if (item.hasUser === undefined || item.hasUser === false) {
            item.hasUser = (user.thisUser === true) ? true : false;
            if (user.thisUser) {
              storeThisUser = item;
            }
          }
        });

        // Sort based on thisUser flag to order thisUser to the top of the secondary array
        // So that the user name is displayed
        item = item.sort((a, b) => {
          if (a.thisUser === true) { return -1; }
          if (b.thisUser === true) { return 1; }
          return 0;
        });
      });

      // Get top X based on displaySize
      let slicedList = list.slice(0, this.displaySize);

      // Check if hasUser is missing in slicedList
      let userInList = false;
      slicedList.forEach((item) => {
        if (item.hasUser) {
          userInList = true;
        }
      });

      // If user not in list (i.e top displaySize), then add him at last position
      // Check for storeThisUser undefined  incase api does not send thisUser flag
      if (!userInList && storeThisUser !== undefined) {

        slicedList = slicedList.slice(0, this.displaySize - 1);
        // slicedList[slicedList.length - 1].hasDots = true; //use this if using dot pattern
        storeThisUser.hasDots = true;
        slicedList.push(storeThisUser);
      }
      return slicedList;
    }
  }

  // groupBy Method - returns a map
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

}
