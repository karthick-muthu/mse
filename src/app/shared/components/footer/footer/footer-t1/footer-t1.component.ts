import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { AppSettings } from '../../../../../settings/app.settings';
import * as _ from 'lodash';

@Component({
  selector: 'ms-footer-t1',
  templateUrl: './footer-t1.component.html',
  styleUrls: ['./footer-t1.component.scss']
})
export class FooterT1Component implements OnInit, OnChanges {
  @Input('sessionInformation') sessionInformation: any;
  appSettings: any;

  constructor() {
    this.appSettings = AppSettings;
  }

  ngOnInit() {
  }

  ngOnChanges(changes: any): void {
    const changeValue = _.get(changes, 'sessionInformation.currentValue', null);
    if (changeValue !== undefined && changeValue !== null) {
      this.sessionInformation = changeValue;
    }
  }

}
