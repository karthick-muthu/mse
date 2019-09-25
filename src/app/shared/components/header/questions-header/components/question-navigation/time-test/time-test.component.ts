import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { SharedService } from '../../../../../../shared.service';
import * as _ from 'lodash';

@Component({
  selector: 'ms-time-test',
  templateUrl: './time-test.component.html',
  styleUrls: ['../question-navigation.component.scss']
})
export class TimeTestComponent implements OnInit, OnChanges {
  @Input('timedTestData') timedTestData: any;
  constructor(private sharedService: SharedService) { }

  ngOnInit() { }

  ngOnChanges(changes: any): void {
    const changeQuestion = _.get(changes, 'timedTestData.currentValue', null);
    if (changeQuestion !== undefined && changeQuestion !== null) {
      this.timedTestData = changeQuestion;
    }
  }

  padZero(value?) {
    value = (value) ? value : '0';
    return this.sharedService.padPrefix(value, 2, '0');
  }

}
