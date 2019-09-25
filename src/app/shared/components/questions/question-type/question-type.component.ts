import { Component, OnInit, OnChanges, Input } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'ms-question-type',
  templateUrl: './question-type.component.html',
  styleUrls: ['./question-type.component.scss']
})
export class QuestionTypeComponent implements OnInit, OnChanges {
  @Input('type') type: string;
  private types: any;
  constructor() {
    this.types = {
      'timedtest': 'time-test',
      'challenge': 'challenge-question',
      'wildcard': 'wild-card-question',
      'higherlevel': 'higher-level-question',
      'practice': 'practice-question',
      'test': 'worksheet'
    };
  }

  ngOnInit() { }

  ngOnChanges(changes: any): void {
    const changeValue = _.get(changes, 'type.currentValue', null);
    if (changeValue !== undefined && changeValue !== null) {
      this.type = changeValue.toLowerCase();
    }
  }

  showTypeSection() {
    const types = _.keys(this.types);
    if (this.type) {
      return (_.indexOf(types, this.type) > -1);
    }
    return false;
  }

  getTypeClass() {
    if (this.type) {
      const className: string = _.get(this.types, this.type, 'display-none');
      return className;
    }
    return '';
  }

}
