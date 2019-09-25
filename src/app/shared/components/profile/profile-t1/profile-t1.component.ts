import { Component, OnChanges, Input } from '@angular/core';
import { SharedService } from '../../../shared.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { ContentService } from '../../../services/content/content.service';

@Component({
  selector: 'ms-profile-t1',
  templateUrl: './profile-t1.component.html',
  styleUrls: ['./profile-t1.component.scss']
})
export class ProfileT1Component implements OnChanges {
  @Input('rewardsList') rewardsList: any;
  @Input('profileInfo') profileInfo: any;
  profilePic: string;
  private errorInfo: any;
  private getBasicDataService: Subscription;

  constructor(private sharedService: SharedService, private contentService: ContentService) {
    this.getBasicDataService = this.contentService.getBasicData().subscribe(
      result => {
        this.profileInfo = _.get(result, 'userInformation', {});
        this.getProfileImage();
      },
      responseError => this.errorInfo = responseError
    );
  }

  ngOnChanges(changes: any): void {
    // const profileInfoChange = _.get(changes, 'profileInfo.currentValue', null);
    // if (profileInfoChange !== undefined && profileInfoChange !== null) {
    //   this.profileInfo = profileInfoChange;
    //   this.getProfileImage();
    // }
    const rewardsListChange = _.get(changes, 'profileInfo.currentValue', null);
    if (rewardsListChange !== undefined && rewardsListChange !== null) {
      this.profileInfo = rewardsListChange;
      this.getProfileImage();
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

}
