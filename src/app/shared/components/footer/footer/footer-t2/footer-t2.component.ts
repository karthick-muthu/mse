import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { AppSettings } from '../../../../../settings/app.settings';
import * as _ from 'lodash';

@Component({
  selector: 'ms-footer-t2',
  templateUrl: './footer-t2.component.html',
  styleUrls: ['./footer-t2.component.scss']
})
export class FooterT2Component implements OnInit, OnChanges {
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
