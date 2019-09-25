import { Component, OnInit, Input } from '@angular/core';
import { LoginSettings } from '../../../../settings/login.settings';

@Component({
  selector: 'ms-auth-footer',
  templateUrl: './auth-footer.component.html',
  styleUrls: ['./auth-footer.component.scss']
})
export class AuthFooterComponent implements OnInit {
  copyright: string;
  @Input('template') template;

  constructor() { }

  ngOnInit() {
    this.copyright = LoginSettings.COPYRIGHT;
  }

}
