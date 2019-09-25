import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ContentService } from '../../../../shared/services/content/content.service';
import { SharedService } from '../../../../shared/shared.service';
import { RewardsService } from './rewards.service';

@Component({
  selector: 'ms-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss']
})
export class RewardsComponent implements OnInit, OnDestroy {
  private getTemplateService: Subscription;
  template: string;
  errorInfo: any;
  rewards: any;

  constructor(private sharedService: SharedService, private contentService: ContentService, private rewardsService: RewardsService) {
    this.sharedService.setSiteTitle('Rewards');
    this.getTemplateService = this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
      },
      responseError => this.errorInfo = responseError
    );
  }

  ngOnInit() {
    this.getRewards();
  }

  getRewards() {
    this.sharedService.showLoader();
    this.rewardsService.getRewardData().subscribe(
      result => {
        const status = this.contentService.validateResponse(result, {});
        this.sharedService.handleUnexpectedResponse(status);
        if (status === 'success') {
          this.rewards = result;
          this.contentService.setTemplate(result);
          this.contentService.setBasicData(result);
        }
        this.sharedService.hideLoader();
      },
      responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
    );
  }

  toggleExplanation(y, showOptions) {
    for (let i = 0; i < showOptions.length; i++) {
      if (i === y) {
        showOptions[i] = !showOptions[i];
      } else {
        showOptions[i] = false;
      }
    }
  }

  ngOnDestroy() {
    this.getTemplateService.unsubscribe();
  }

}
