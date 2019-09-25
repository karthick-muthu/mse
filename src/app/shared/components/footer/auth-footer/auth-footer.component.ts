import { Component, OnInit, Input } from '@angular/core';
import { AppSettings } from '../../../../settings/app.settings';

@Component({
  selector: 'ms-auth-footer',
  templateUrl: './auth-footer.component.html',
  styleUrls: ['./auth-footer.component.scss']
})
export class AuthFooterComponent implements OnInit {
  @Input('template') template;
  copyright: string;

  constructor() {
    this.copyright = AppSettings.COPYRIGHT;
  }

  ngOnInit() { }

}
