import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContentService } from '../../shared/services/content/content.service';
import { SharedService } from '../../shared/shared.service';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'ms-my-mindspark',
  templateUrl: './my-mindspark.component.html',
  styleUrls: ['./my-mindspark.component.scss']
})
export class MyMindsparkComponent implements OnInit {
  isProfileVisible = false;
  displayDetailedView = false;
  dashboardData: any;
  errorInfo: string;
  template: string;
  templateClass: string;

  constructor(private homeService: HomeService, private contentService: ContentService, private sharedService: SharedService,
    private router: Router) {
    this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.sharedService.setBodyClass();
        this.setClassName();
      },
      responseError => this.errorInfo = responseError
    );
    this.sharedService.getAndClearCookies();
  }

  ngOnInit() {
  }

  setClassName() {
    this.templateClass = this.sharedService.getClassName();
  }

}
