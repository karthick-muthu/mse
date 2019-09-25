import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ContentService } from '../../../../shared/services/content/content.service';
import { SharedService } from '../../../../shared/shared.service';
import { WorksheetsService } from '../../services/worksheets.service';
import * as _ from 'lodash';

@Component({
  selector: 'ms-worksheets-list',
  templateUrl: './worksheets-list.component.html',
  styleUrls: ['./worksheets-list.component.scss']
})

export class WorksheetsListComponent {

  selectedTheme: any;
  liveWorksheetsData: any;
  listSize: any;
  for: string;
  worksheetList: any;
  liveWorksheets: any[];
  olderWorksheets: any[];
  templateClass: string;
  template: any;
  errorInfo: any;
  worksheetResult: any;
  endDate: boolean;

  private getTemplateService: Subscription;

  constructor(private sharedService: SharedService, private contentService: ContentService, private worksheetsService: WorksheetsService,
    private router: Router) {
  }

  ngOnInit() {
    this.liveWorksheets = [];
    this.olderWorksheets = [];
    this.endDate = true;
    this.getWorksheetsList();
    this.sharedService.setSiteTitle('Worksheets');
    this.getTemplateService = this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
        this.sharedService.setBodyClass();
      },
      responseError => this.errorInfo = responseError
    );
    this.for = 'worksheet';
    this.contentService.getBasicData().subscribe(result => {
      this.selectedTheme = _.get(result, 'userInformation.selectedTheme', null);
      this.selectedTheme = (this.selectedTheme) ? this.selectedTheme.toLowerCase() : '';
    });
  }

  ngDestroy() {
    this.getTemplateService.unsubscribe();
  }
  getWorksheetsList() {
    this.sharedService.showLoader();
    this.worksheetsService.getWorksheetsList().subscribe(
      result => {
        const status = this.contentService.validateResponse(result, {});
        this.sharedService.handleUnexpectedResponse(status);
        if (status === 'success') {
          this.worksheetResult = result;
          this.worksheetList = _.get(this.worksheetResult, 'worksheetList', null);
          this.contentService.setTemplate(result);
          this.contentService.setBasicData(result);
          if (this.worksheetList) {
            this.listSize = this.worksheetList.length;
            for (let worksheetTile = 0; worksheetTile < this.listSize; worksheetTile++) {
              this.liveWorksheetsData = this.worksheetList[worksheetTile];
              const contentStatus: any = _.get(this.liveWorksheetsData, 'contentStatus', '');
              if (contentStatus === 'active') {
                this.liveWorksheets.push(this.liveWorksheetsData);
              } else {
                this.olderWorksheets.push(this.liveWorksheetsData);
              }
            }
          }
        }
        this.sharedService.hideLoader();
      },
      error => this.errorInfo = this.sharedService.handleResponseError(error)
    );
  }

}
