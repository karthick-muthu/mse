import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from './modules/auth/services/auth/auth.service';
import { Router } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { environment } from '../environments/environment';
import { LoginApiSettings } from './settings/login.api.settings';
import { LoginSettings } from './settings/login.settings';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mindspark-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  compatible: boolean;
  beforeUnloadRestrict: any;
  dragDrop: any;
  sessionStorageDevice: any;
  localStorageDevice: any;
  cookiesEnable: any;
  failedUrl: any;
  browserVersion: boolean;
  browserVersionValue: any;
  fireWallValue: boolean;
  language: string;
  popState: any;
  page: any;
  jwt: any;
  errorInfo: any;
  showLoader: any;
  private baseURL: string;
  deviceInfo = null;

  constructor(private authService: AuthService, private router: Router, location: PlatformLocation) {

    this.authService.getLoader().subscribe(
      result => setTimeout(() => this.showLoader = result, 0),
      responseError => {
        this.errorInfo = this.authService.errorHandler(responseError);
      }
    );
    location.onPopState((event) => this.onBackClick(event));
    this.baseURL = environment.apiBaseURL;

    this.authService.getJWT().subscribe(result => {
      this.jwt = result.jwt;
    });
    this.authService.getReloadRestrict().subscribe(result => {
      this.page = result.page;
    });

    this.authService.getPopState().subscribe(result => {
      this.popState = result.popState;
    });
    this.page = 'otherPages';

    this.authService.getJWT().subscribe(result => {
      this.jwt = result.jwt;
    });
    this.authService.getRouteLang().subscribe(result => {
      this.language = result.routeLang;
    });
    this.authService.getBeforeUnloadRestrict().subscribe(result => {
      this.beforeUnloadRestrict = result.state;
    });

    if(window['localStorage']){
      window.localStorage.clear();
    }
    if(window['sessionStorage']){
      window.sessionStorage.clear();
    }
  }
  ngOnInit() {
  }

  onBackClick(event) {
    if (environment.production) {
      event.preventDefault();
      if (this.popState !== 'login') {
        const url = this.language + '/error/reload';
        this.router.navigate([url]);
        event.preventDefault();
      }
    }
  }
  @HostListener('document:keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    if (environment.production) {
      const key = event.key.toLowerCase();
      if (key === 'f5' || key === 'f12' || (key === 'r' && event.ctrlKey)) {
        if (this.page !== 'login') {
          const url = this.language + '/error/reload';
          this.router.navigate([url]);
          event.preventDefault();
        }
      }
    }

  }

  @HostListener('window:beforeunload', ['$event'])
  public beforeUnload($event) {
    if (environment.production) {
      const tempPage = this.beforeUnloadRestrict.toLowerCase();
      if (tempPage === 'canreload') {
        this.triggerDialogBox($event);
      }
    }
  }
  private triggerDialogBox($event: any) {
    const confirmationMessage = 'You will lose your data';
    $event.returnValue = confirmationMessage;
    return confirmationMessage;
  }

  @HostListener('window:unload', ['$event'])
  public unload($event) {
  }
  logout() {
    let hiddenField, externalLink, form;
    externalLink = this.baseURL + LoginApiSettings.API.auth.logout;

    this.authService.showLoader();

    form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', externalLink);
    hiddenField = this.generateHiddenField('token', this.jwt);
    form.appendChild(hiddenField);
    hiddenField = this.generateHiddenField('logoutType', 'regular');
    form.appendChild(hiddenField);
    hiddenField = this.generateHiddenField('redirect', '');
    form.appendChild(hiddenField);
    document.body.appendChild(form);
    form.submit();

    this.authService.clearSharedServiceBS();
    this.authService.hideLoader();
  }

  private generateHiddenField(name, value) {
    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', name);
    hiddenField.setAttribute('value', value);
    return hiddenField;
  }
  onRightClick(event) {
    event.preventDefault();
  }

}
