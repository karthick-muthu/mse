import { Component } from '@angular/core';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'ms-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent {

  constructor(private sharedService: SharedService) {
    this.sharedService.getAndClearCookies();
  }

}
