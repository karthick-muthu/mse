import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { SharedService } from '../../../shared.service';
import * as _ from 'lodash';

@Component({
  selector: 'ms-profile-t2',
  templateUrl: './profile-t2.component.html',
  styleUrls: ['./profile-t2.component.scss']
})
export class ProfileT2Component implements OnInit, OnChanges {
  @Input() profileInfo: any;
  @Input() questionDetail: any;
  @Input() rewardsList: any;
  profilePic: string;
  progressValue: any;
  goldenAchivement: boolean;
  userProfileBlock = true;

  goldenSheild = 'assets/common/images/golden-achivement.png';
  silverSheild = 'assets/common/images/silver-achivement.png';

  constructor(private sharedService: SharedService) { }

  ngOnInit() { }

  ngOnChanges(changes: any): void {
    const profileInfoChange = _.get(changes, 'profileInfo.currentValue', null);
    const questionDetailChange = _.get(changes, 'questionDetail.currentValue', null);
    const rewardsListChange = _.get(changes, 'rewardsList.currentValue', null);
    if (profileInfoChange !== undefined && profileInfoChange !== null) {
      this.profileInfo = profileInfoChange;
      this.getProfileImage();
    }
    if (questionDetailChange !== undefined && questionDetailChange !== null) {
      this.questionDetail = questionDetailChange;
      this.setProgress(questionDetailChange);
      if (this.progressValue >= 100) {
        this.goldenAchivement = true;
      }
    }
    if (rewardsListChange !== undefined && rewardsListChange !== null) {
      this.rewardsList = rewardsListChange;
    }
  }

  getProfileImage() {
    let image: string;
    const profilePic = _.get(this.profileInfo, 'avatar', null);
    if (profilePic !== null && profilePic !== undefined) {
      image = profilePic;
    } else {
      image = this.sharedService.setDefaultProfilePic(this.profileInfo);
    }
    this.profilePic = image;
  }

  imageError() {
    const image: string = this.sharedService.setDefaultProfilePic(this.profileInfo);
    this.profilePic = image;
  }

  setProgress(progressValue) {
    this.progressValue = (progressValue.correctAttempt / progressValue.weeklyTarget) * 100;
  }

}
