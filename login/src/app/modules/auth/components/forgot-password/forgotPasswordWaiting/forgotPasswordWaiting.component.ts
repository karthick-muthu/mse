import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import * as _ from 'lodash';

@Component({
  selector: 'ms-forgot-password-waiting',
  templateUrl: './forgotPasswordWaiting.component.html',
  styleUrls: ['../forgot-password.component.scss']
})
export class ForgotPasswordWaitingComponent implements OnInit {
  page: any;
  language: any;
  category: any;
  ham: string;
  username: any;
  errorInfo: any;

  constructor(private router: Router, private authService: AuthService, private activatedRoute: ActivatedRoute) {
    this.authService.setSiteTitle('Waiting');
    this.language = _.get(this.activatedRoute, 'params.value.lang', 'en').toLowerCase();
    this.authService.setRouteLang(this.language);
    this.authService.changeLanguageRoute(this.language);
    this.authService.getReloadRestrict().subscribe(result => {
      this.page = result.page;
      if (this.page !== 'login') {
        const url = this.language + '/error/reload';
        this.router.navigate([url]);
      }
    });
    this.authService.setBeforeUnloadRestrict('canreload');
  }

  ngOnInit() {
    this.authService.getUsername().subscribe(
      result => {
        this.callThis(result.username, result.category);
      },
      responseError => {
        this.errorInfo = this.authService.errorHandler(responseError);
      });
  }

  callThis(username, category) {
    this.username = username;
    this.category = category;
  }
  goToLogin() {

    this.router.navigate(['/']);
  }

}
