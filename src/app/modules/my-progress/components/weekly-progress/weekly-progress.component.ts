import { Component, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'ms-weekly-progress',
  templateUrl: './weekly-progress.component.html',
  styleUrls: ['./weekly-progress.component.scss']
})
export class WeeklyProgressComponent implements OnChanges {
  @Input('weeklyData') weeklyData: any;
  @Input('reportType') reportType: any;

  constructor() { }

  ngOnChanges(changes: any): void {
    const changeWeeklyData = _.get(changes, 'weeklyData.currentValue', null);
    if (changeWeeklyData !== undefined && changeWeeklyData !== null) {
      this.weeklyData = changeWeeklyData;
    }
    const changeReportType = _.get(changes, 'reportType.currentValue', null);
    if (changeReportType !== undefined && changeReportType !== null) {
      this.reportType = changeReportType;
    }
  }

}
