import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { PlatformLocation, Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { CookieService } from 'ngx-cookie';
import { Ng2DeviceService } from 'ng2-device-detector';
import { SharedService } from './shared/shared.service';
import { ContentService } from './shared/services/content/content.service';
import { HomeService } from './modules/home/home.service';
import { environment } from '../environments/environment';
import { AppSettings } from './settings/app.settings';
import { MathsService } from './shared/services/maths/maths.service';
import { MathsDirective } from './shared/directives/maths/maths.directive';
import * as _ from 'lodash';
import { NotificationModalT2Component } from './shared/components/notification-modal/notification-modal-t2/notification-modal-t2.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mindspark-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  contentRoutes: RegExpMatchArray;
  tempEnvironment: any;
  routeMatchesForNotifications: any;
  worksheetChildRoutes: RegExpMatchArray;
  currentRoute: string;
  navType: any;
  compatible: any;

  jwt: any;
  private getLoaderService: Subscription;
  private getLogoutSessionService: Subscription;
  private getUnexpectedErrorService: Subscription;
  private loadURL: string;
  errorInfo: any;
  showLoader: any;
  deviceInfo = null;
  browserVersion: boolean;
  browserVersionValue: any;
  result: any;
  code: any;
  scripts: any;
  cookiesEnable: any;
  localStorageDevice: any;
  sessionStorageDevice: any;
  dragDrop: any;
  fireWallValue: any;
  failedUrl: any;
  page: any;
  responseError: string;
  notificationInterval: any;
  topicChildRoutes: any;

  constructor(private sharedService: SharedService, private contentService: ContentService, location: PlatformLocation,
    private homeService: HomeService, private deviceService: Ng2DeviceService, private router: Router, private mathsService: MathsService,
    private cookieService: CookieService, private ngbActiveModal: NgbActiveModal, private currentLocation: Location) {
    // console.log('%cDo not mess with the Developer Tools! ', 'color: #ff0000; font-size: 40px');
    this.fireWallValue = true;
    // this.epicFunction();
    this.getLoaderService = this.sharedService.getLoader().subscribe(
      result => setTimeout(() => this.showLoader = result, 0),
      responseError => this.errorInfo = responseError
    );
    location.onPopState((event) => this.onBackClick(event));
    this.getLogoutSessionService = this.contentService.getLogoutSession().subscribe(
      result => {
        if (result.type !== '' && result.type !== null && result.type !== undefined) {
          this.logout(result.type);
        }
      }
    );

    this.getUnexpectedErrorService = this.contentService.getUnexpectedError().subscribe(
      result => {
        this.responseError = result.error;
        let url: any = _.get(this.router, 'url', '/');
        url = url.split('/');
        url = url[(url.length - 1)];
        if (url === 'content') {
          this.loadURL = 'questions';
        }
      }
    );
    this.mathsService.load('mathJax').then(data => { }).catch(error => console.log(error));
    // this.mathsService.load('jsMathNoImage').then(data => { }).catch(error => console.log(error));
    // this.mathsService.load('jsMathLoad').then(data => { }).catch(error => console.log(error));
    // this.mathsService.load('jsMath').then(data => { }).catch(error => console.log(error));
    // this.mathsService.load('jsMathEasy').then(data => { }).catch(error => console.log(error));

    this.page = 'otherPages';
    this.tempEnvironment = environment;
    // Do Check for prerequisites
    /* this.DoCheckPrerequisites().then(data => {
      data.forEach((d) => {
        if (d.loaded === false) {
          this.fireWallValue = false;
          this.failedUrl.firewall = this.fireWallValue;
          this.contentService.setRouterDetails(this.failedUrl);
          this.router.navigate(['/error/incompatiblebrowser']);
        } else {
          // do nothing
        }
      });
    }).catch(error => console.log(error)); */

    // to check cookies
    this.cookiesEnable = navigator.cookieEnabled;

    // to check localStorage of the device
    this.localStorageDevice = (function () {
      try {
        localStorage.setItem('name', 'mindspark');
        localStorage.removeItem(name);
        return true;
      } catch (exception) {
        return false;
      }
    }());

    // to check session storage of the device
    this.sessionStorageDevice = (function () {
      try {
        sessionStorage.setItem('name', 'mindspark');
        sessionStorage.removeItem(name);
        return true;
      } catch (exception) {
        return false;
      }
    }());

    // to check drag and drop enability

    if ('draggable' in document.createElement('span')) {
      this.dragDrop = true;
    }

    this.sharedService.getJWT().subscribe(result => {
      this.jwt = result.jwt;
    });
    this.contentService.getBasicData().subscribe(result => {
      const notificationPermission = _.get(result, 'permittedNavs.notification', false);
      if (notificationPermission) {
        const routeName = this.currentLocation.path().toString();
        this.topicChildRoutes = routeName.match('topics/');
        this.worksheetChildRoutes = routeName.match('worksheets/');
        this.contentRoutes = routeName.match('content');
        if (this.topicChildRoutes === null && this.worksheetChildRoutes === null && this.contentRoutes === null) {
          this.callGetNotifications();
        }
        this.setNotificationTimer();
      }
    });
  }

  setNotificationTimer() {
    clearInterval(this.notificationInterval);

    if (environment.production) {
      this.notificationInterval = setInterval(() => {
        this.routeMatchesForNotifications = '';
        if (this.topicChildRoutes !== null) {
          this.routeMatchesForNotifications = this.topicChildRoutes.input;
        } else if (this.worksheetChildRoutes !== null) {
          this.routeMatchesForNotifications = this.worksheetChildRoutes.input;
        } else if (this.contentRoutes !== null) {
          this.routeMatchesForNotifications = this.contentRoutes.input;
        }
        if (this.routeMatchesForNotifications === '') {
          this.callGetNotifications();
        }
      }, 30000);
    }
  }


  callGetNotifications() {
    this.homeService.getNotifications().subscribe(notificationResult => {
      this.contentService.setNotificationData(notificationResult);
      this.setFlyNotificationStatus(notificationResult);
    });
  }

  setFlyNotificationStatus(notificationResult) {
    const promotionalData = _.get(notificationResult, 'promotional', []);
    if (promotionalData.length > 0) {
      this.contentService.setNotificationTrigger('fly');
      for (let i = 0; i < promotionalData.length; i++) {
        const isRead = _.get(promotionalData[i], 'isRead', true);
        if (!isRead) {
          this.contentService.setFlyNotificationStatus(isRead);
          this.sharedService.open(NotificationModalT2Component, ['backDropStop']);
          break;
        }
      }
    }
  }
  ngOnInit() {
    this.navType = '';
    this.failedUrl = {
      firewall: this.fireWallValue,
      cookies: this.cookiesEnable,
      localStorage: this.localStorageDevice,
      sessionStorage: this.sessionStorageDevice,
      dragDrop: this.dragDrop,
      compatible: this.compatible
    };
    this.sharedService.getReloadRestrict().subscribe(result => {
      this.page = result.page;
    });

    this.contentService.setRouterDetails(this.failedUrl);
  }

  ngOnDestroy() {
    this.getLoaderService.unsubscribe();
    this.getLogoutSessionService.unsubscribe();
  }

  @HostListener('document:keydown', ['$event'])
  keydown(event: KeyboardEvent) {
    if (environment.production) {
      const keyCode = _.get(event, 'keyCode', null);
      const key = _.get(event, 'key', '').toString().toLowerCase();
      if (
        (key === 'f5' || keyCode === 116)
        || ((key === 'r' || keyCode === 82) && event.ctrlKey)
        || (key === 'f12' || keyCode === 123)
        // || ((key === 'i' || keyCode === 73) && event.ctrlKey && event.shiftKey)
      ) {
        event.preventDefault();
      }
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  public beforeUnload($event) {
    if (environment.production) {
      switch (this.page) {
        case 'blockReload': this.navType = 'refresh';
          break;
        default:
          this.triggerDialogBox($event);

      }
    }
  }

  private triggerDialogBox($event: any) {
    if (this.navType === 'back') {
      this.cookieService.put('errorType', 'pageBack');
    } else if (this.navType === 'refresh') {
      this.cookieService.put('errorType', 'pageRefresh');
    }
    const confirmationMessage = 'You will lose your data';
    $event.returnValue = confirmationMessage;
    return confirmationMessage;
  }

  @HostListener('window:unload', ['$event'])
  public unload(event) {
    if (environment.production) {
      if (this.jwt) {
        event.preventDefault();
        this.logout(2);
      }
    }
  }

  onBackClick(event) {
    if (environment.production) {
      event.preventDefault();
      this.sharedService.setReloadRestrict('reload');
      this.navType = 'back';
      this.contentService.setLogoutSession(3);
    }
  }

  onRightClick(event) {
    if (!environment.production) { console.log('Right Click', 'Detected'); }
    if (environment.production) {
      event.preventDefault();
    }
  }

  logout(type?: number) {
    type = (type) ? type : 0;
    this.homeService.logout(type);
  }

  // to detect browser
  epicFunction() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    let browser_version: any = this.deviceInfo.browser_version;
    browser_version = parseInt(browser_version.split('.')[0], 10);
    if (this.deviceInfo.browser === 'chrome') {
      this.browserVersionValue = AppSettings.BROWSER_VERSIONS.CHROME;
    } else if (this.deviceInfo.browser === 'firefox') {
      this.browserVersionValue = AppSettings.BROWSER_VERSIONS.FIREFOX;
    } else if (this.deviceInfo.browser === 'edge') {
      this.browserVersionValue = AppSettings.BROWSER_VERSIONS.EDGE;
    } else if (this.deviceInfo.browser === 'ie') {
      this.browserVersionValue = AppSettings.BROWSER_VERSIONS.IE;
    } else if (this.deviceInfo.browser === 'safari') {
      this.browserVersionValue = AppSettings.BROWSER_VERSIONS.SAFARI;
    }
    if (browser_version < this.browserVersionValue) {
      this.compatible = false;
      this.router.navigate(['/error/incompatiblebrowser']);
    } else {
      this.compatible = true;
    }
  }

  DoCheckPrerequisites() {
    const promises: any[] = [];
    const preRequisites = environment.prerequisites;
    preRequisites.forEach((prerequisite: any) => {
      promises.push(this.checkUsingImage(prerequisite));
    });
    return Promise.all(promises);
  }

  checkUsingImage(prerequisite: any) {
    return new Promise((resolve, reject) => {
      const img = document.createElement('img');
      // img.style.display = 'none';
      img.src = prerequisite.url;
      img.onload = () => {
        resolve({ name: prerequisite.name, loaded: true, status: 'Loaded' });
      };
      img.onerror = (error: any) => {
        resolve({ name: prerequisite.name, loaded: false, status: 'Failed to load' });
      };
      // document.getElementsByTagName('body')[0].appendChild(img);
    }
    );
  }

  responseErrorclose() {
    this.contentService.setUnexpectedError('close');
  }
  showResponseErrorClose() {
    let flag = true;
    switch (this.responseError) {
      case 'loaderror': flag = false; break;
      case 'unexpected':
        let url: any = _.get(this.router, 'url', '/');
        url = url.split('/');
        url = url[(url.length - 1)];
        if (this.loadURL === 'questions' && url === 'content') { flag = false; }
        break;
      default: flag = true; break;
    }
    return flag;
  }
}
