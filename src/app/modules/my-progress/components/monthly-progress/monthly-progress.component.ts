import { Component, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'ms-monthly-progress',
  templateUrl: './monthly-progress.component.html',
  styleUrls: ['./monthly-progress.component.scss']
})
export class MonthlyProgressComponent implements OnChanges {
  @Input('myProgress') myProgress: any;

  constructor() { }

  ngOnChanges(changes: any): void {
    const changeMyProgress = _.get(changes, 'myProgress.currentValue', null);
    if (changeMyProgress !== undefined && changeMyProgress !== null) {
      this.myProgress = changeMyProgress;
    }
  }

}
