import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'ms-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements OnInit {
  language: any;
  errorInfo: any;
  wallofSparkies = true;
  showAdsSpace = false;

  constructor(private router: ActivatedRoute, private authService: AuthService) {
    this.authService.setSiteTitle('Login');
  }

  ngOnInit() {
    this.language = _.get(this.router, 'params.value.lang', 'en').toLowerCase();
    this.authService.setRouteLang(this.language);
    this.authService.changeLanguageRoute(this.language);
  }
}
