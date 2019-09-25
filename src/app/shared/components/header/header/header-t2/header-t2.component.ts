import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { CommentModalComponent } from '../../../comments/comment-modal/comment-modal.component';
import { SharedService } from '../../../../shared.service';
import { ContentService } from '../../../../services/content/content.service';
import { Router } from '@angular/router';
import { NotificationModalT2Component } from '../../../notification-modal/notification-modal-t2/notification-modal-t2.component';
import { HeaderComponent } from '../header.component';
import * as _ from 'lodash';
import { HomeService } from '../../../../../modules/home/home.service';
import { Subscription } from 'rxjs/Subscription';
import { AppSettings } from '../../../../../settings/app.settings';


@Component({
  selector: 'ms-header-t2',
  templateUrl: './header-t2.component.html',
  styleUrls: ['./header-t2.component.scss']
})

export class HeaderT2Component implements OnInit, OnChanges, OnDestroy {

  count: number;
  @Input('formValue') formValue: any;
  notificationPermitted: any;
  permittedNavs: any;
  notifications: any;
  getNotificationsSubscription: Subscription;
  basicDataSubscription: Subscription;
  unreadNotifications: boolean;
  navs: any = {};
  isHeight: any;
  moreNotifications: boolean;
  notificationImage: any;
  isProfileVisible = false;

  constructor(private router: Router, private sharedService: SharedService, private contentService: ContentService,
    private headerComponent: HeaderComponent, private homeService: HomeService) {
    this.isProfileVisible = !this.isProfileVisible;
    this.basicDataSubscription = this.contentService.getBasicData().subscribe(result => {
      this.permittedNavs = _.get(result, 'permittedNavs', {});
      this.notificationPermitted = _.get(result, 'permittedNavs.notification', false);
    });
    if (this.notificationPermitted) {

      this.getNotificationsSubscription = this.contentService.getNotificationData().subscribe(result => {
        this.notifications = _.get(result, 'notifications', []);
        this.count = _.get(result, 'count', 0);
      });
    }
  }

  ngOnInit() {
    this.moreNotifications = true;
    this.isHeight = true;
  }

  ngOnChanges(changes: any): void { }


  imagePicker(category) {
    return this.sharedService.notificationImagePicker(category);
  }

  logout() {
    this.sharedService.setReloadRestrict('blockReload');
    this.headerComponent.logout();
  }

  readNotification(notification) {
    this.contentService.readNotification(notification);
  }
  showAllNotification() {
    this.router.navigate(['./my-mindspark/mailbox']);
  }

  open() {
    setTimeout(() => {
      const modalRef = this.sharedService.open(CommentModalComponent);
    }, 200);
  }
  champNotify() {
    const modalRef = this.sharedService.open(NotificationModalT2Component);
  }

  ngOnDestroy() {
    if (this.getNotificationsSubscription) {
      this.getNotificationsSubscription.unsubscribe();
    }
    if (this.basicDataSubscription) {
      this.basicDataSubscription.unsubscribe();
    }
  }
}
