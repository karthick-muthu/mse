import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { SharedService } from '../../../../../../shared.service';
import * as _ from 'lodash';
import { environment } from '../../../../../../../../environments/environment';

@Component({
  selector: 'ms-achievements-t2',
  templateUrl: './achievements-t2.component.html',
  styleUrls: ['./achievements-t2.component.scss']
})
export class AchievementsT2Component implements OnChanges {
  @Input('userRewardInfo') userRewardInfo: any;
  @Input('userInformation') userInformation: any;
  otherRewardsKeys: any = [];
  otherRewards: any = [];
  achivementCompletionImage: any = [];
  profilePic: string;

  constructor(private sharedService: SharedService) { }

  ngOnChanges(changes: any): void {
    const userRewardInfoChanges = _.get(changes, 'userRewardInfo.currentValue', null);
    if (userRewardInfoChanges !== undefined && userRewardInfoChanges !== null) {
      this.userRewardInfo = userRewardInfoChanges;
      this.otherRewards = _.get(this.userRewardInfo, 'otherRewards', null);
      this.otherRewardsKeys = _.keys(this.otherRewards);
      for (let i = 0; i < this.otherRewardsKeys.length; i++) {
        this.translateImageText(this.otherRewardsKeys[i]);
      }
    }
    const userInformationChanges = _.get(changes, 'userInformation.currentValue', null);
    if (userInformationChanges !== undefined && userInformationChanges !== null) {
      this.userInformation = userInformationChanges;
      this.getProfileImage();
    }
  }

  translateImageText(otherRewardsKey) {
    let rewardKey: string, rewardImageKey: string;
    rewardKey = otherRewardsKey;
    rewardImageKey = otherRewardsKey + 'ImageURL';
    this.sharedService.translateMessage(rewardImageKey).subscribe(res => {
      this.achivementCompletionImage[rewardKey] = environment.appBaseURL + res;
    });
  }

  getProfileImage() {
    let image: string;
    const profilePicture = _.get(this.userInformation, 'avatar', null);
    if (profilePicture !== null && profilePicture !== undefined) {
      image = profilePicture;
    } else {
      image = this.sharedService.setDefaultProfilePic(this.userInformation);
    }
    this.profilePic = image;
  }

  imageError() {
    const image: string = this.sharedService.setDefaultProfilePic(this.userInformation);
    this.profilePic = image;
  }

}
