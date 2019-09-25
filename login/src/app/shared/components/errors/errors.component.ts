import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../modules/auth/services/auth/auth.service';
import { LoginSettings } from '../../../settings/login.settings';
import * as _ from 'lodash';
import { AppComponent } from '../../../app.component';
import { LoginApiSettings } from '../../../settings/login.api.settings';
import { environment } from '../../../../environments/environment';
import { LoginService } from '../../../modules/auth/services/login/login.service';

@Component({
  selector: 'ms-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent implements OnInit {
  browserData: any;
  baseURL: string;
  jwt: any;
  error: any;
  browser: any;
  osDetails: any;
  language: any;
  constructor(private authService: AuthService, private appData: AppComponent, private router: Router,
    private activateRoute: ActivatedRoute, private loginService: LoginService) {
    this.baseURL = environment.apiBaseURL;
    this.language = _.get(this.activateRoute, 'params.value.lang', 'en').toLowerCase();
    this.authService.setRouteLang(this.language);
    this.authService.changeLanguageRoute(this.language);
    this.error = _.get(this.activateRoute, 'params.value.type', '').toLowerCase();
    this.authService.getJWT().subscribe(result => {
      this.jwt = result.jwt;
    });
    this.authService.setBeforeUnloadRestrict('error');
  }
  ngOnInit() { }
  continuePage() {
    this.router.navigate(['/']);
  }
  logoutPage() {
    this.authService.setBeforeUnloadRestrict('blockreload');
    this.appData.logout();
  }

  private generateHiddenField(name, value) {
    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', name);
    hiddenField.setAttribute('value', value);
    return hiddenField;
  }

  renewalRedirect() {
    this.authService.showLoader();
    this.loginService.liveSubscriptionPage();
    this.authService.showLoader();

  }

}

