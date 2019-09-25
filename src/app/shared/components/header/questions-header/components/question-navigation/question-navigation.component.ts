import { Component, OnChanges, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'ms-question-navigation',
  templateUrl: './question-navigation.component.html',
  styleUrls: ['./question-navigation.component.scss']
})
export class QuestionNavigationComponent implements OnChanges {
  @Input('pedagogyContent') pedagogyContent: any;
  @Input('toDisplay') toDisplay: any;
  @Input('from') from: any;

  constructor() { }

  ngOnChanges(changes: any): void {
    const changePedagogyContent = _.get(changes, 'pedagogyContent.currentValue', null);
    const changeToDisplay = _.get(changes, 'toDisplay.currentValue', null);
    const changeFrom = _.get(changes, 'from.currentValue', null);
    if (changePedagogyContent !== undefined && changePedagogyContent !== null) {
      this.pedagogyContent = changePedagogyContent;
    }
    if (changeToDisplay !== undefined && changeToDisplay !== null) {
      this.toDisplay = changeToDisplay;
    }
    if (changeFrom !== undefined && changeFrom !== null) {
      this.from = changeFrom;
    }
  }

}
