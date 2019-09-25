import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../shared/services/content/content.service';
import { SharedService } from '../../shared/shared.service';
import { GamesService } from './games.service';

@Component({
  selector: 'ms-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  template: string;
  errorInfo: any;

  constructor(private sharedService: SharedService, private contentService: ContentService, private gameService: GamesService) {
    this.sharedService.setSiteTitle('Games');
    this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.sharedService.setBodyClass();
      },
      responseError => this.errorInfo = responseError
    );
    this.sharedService.getAndClearCookies();
  }

  ngOnInit() {
  }

}
