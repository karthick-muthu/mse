import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { AppSettings } from '../../../settings/app.settings';
import * as _ from 'lodash';

@Component({
  selector: 'ms-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit, OnChanges {
  @Input('trans') trans: any;
  logo: any;
  tinylogo: any;
  appSettings: any = AppSettings;

  constructor() { }

  ngOnInit() {
    if (this.trans) {
      this.logo = this.appSettings.LOGO_URL_TRANS; // LOGO_URL_TRANS
    } else {
      this.logo = this.appSettings.LOGO_URL; // LOGO_URL
    }
    this.tinylogo = this.appSettings.LOGOTINY_URL; // LOGO_URL
  }

  ngOnChanges(changes: any): void {
    const changeValue = _.get(changes, 'trans.currentValue', null);
    if (changeValue !== undefined && changeValue !== null) {
      this.trans = changeValue;
    }
  }

}
