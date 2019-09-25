import { Component, OnInit, OnDestroy, AfterViewInit, OnChanges } from '@angular/core';
import { NgbActiveModal, NgbCarouselConfig, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ContentService } from '../../../services/content/content.service';
import * as _ from 'lodash';
import { SharedService } from '../../../shared.service';
import { MailboxService } from '../../../../modules/my-mindspark/components/mailbox/mailbox.service';
import { environment } from '../../../../../environments/environment.prod';
import { AppSettings } from '../../../../settings/app.settings';

@Component({
  selector: 'ms-notification-modal-t2',
  templateUrl: './notification-modal-t2.component.html',
  styleUrls: ['./notification-modal-t2.component.scss'],
  providers: [NgbCarouselConfig, NgbCarousel]
})
export class NotificationModalT2Component implements OnInit, OnDestroy, AfterViewInit {
  slideEvent: any;
  notificationAnimation: string;
  notificationImage: string;
  notificationTrigger: string;
  flyNotificationStatusSubscription: Subscription;
  triggerSubscription: Subscription;
  hasUnread: boolean;
  getNotificationsSubscription: Subscription;
  notifications: any;
  promotional: any;
  count: any;
  forPromotional: boolean;
  forNotification: boolean;

  constructor(private ngbActiveModal: NgbActiveModal, private router: Router, private contentService: ContentService,
    private sharedService: SharedService, private mailBoxService: MailboxService
  ) {
    this.hasUnread = false;
    this.forPromotional = false;
    this.forNotification = false;
    this.getNotificationsSubscription = this.contentService.getNotificationData().subscribe(result => {
      this.notifications = _.get(result, 'notifications', []);
      this.count = _.get(result, 'count', 0);
      this.promotional = _.get(result, 'promotional', []);
      this.pickAnimations();
      if (this.promotional.length === 1) {
        const data = {
          nID: _.get(this.promotional[0], 'nID')
        };
        this.markNotificationAsRead(data);
        setTimeout(() => {
          this.ngbActiveModal.close();
        }, 5000);
      }
      this.flyNotificationStatusSubscription = this.contentService.getFlyNotificationStatus().subscribe(flyNotificationResult => {
        this.hasUnread = !(_.get(flyNotificationResult, 'status', false));
      });
    });

    this.triggerSubscription = this.contentService.getNotificationTrigger().subscribe(result => {
      this.notificationTrigger = _.get(result, 'trigger', '');
      this.manageDisplay();
    });
  }

  ngOnInit() { }

  slideChange(event) {
    this.slideEvent = event;
    for (let i = 0; i < this.promotional.length; i++) {
      if (i === event.prev && !this.promotional[i].isRead) {
        const data = {
          nID: _.get(this.promotional, i + '.nID', '')
        };
        this.markNotificationAsRead(data);
        if (i === this.promotional.length - 1) {
          this.ngbActiveModal.close();
        }
      }
    }
  }

  markNotificationAsRead(data) {
    this.mailBoxService.markNotificationAsRead(data).subscribe(result => {
      const response = this.contentService.validateResponse(result, '');
      if (response === 'success') {
        if (!environment.production) {
          console.log('notification marked as read');
        }
      }
    });
  }

  pickAnimations() {
    for (let i = 0; i < this.promotional.length; i++) {
      let headerText: any = _.get(this.promotional[i], 'templateHeader', '');
      headerText = headerText.toLowerCase();
      let image = '';
      switch (headerText) {
        case 'birthdaywish_lwr_h': image = AppSettings.PROMOTIONAL_NOTIFICATIONS_ANIMATIONS[0]; break;
        case 'birthdaywish_h': image = AppSettings.PROMOTIONAL_NOTIFICATIONS_ANIMATIONS[1]; break;
        case 'sparkiestar_h': image = AppSettings.PROMOTIONAL_NOTIFICATIONS_ANIMATIONS[2]; break;
        case 'sparkiechamp_h': image = AppSettings.PROMOTIONAL_NOTIFICATIONS_ANIMATIONS[3]; break;
        default: image = AppSettings.PROMOTIONAL_NOTIFICATIONS_ANIMATIONS[0]; break;
      }
      this.promotional[i].asset = image;
    }
  }
  ngAfterViewInit() {
    if (document.querySelector('.modal-content') !== undefined && document.querySelector('.modal-content') !== null) {
      if (this.forNotification) {
        document.querySelector('.modal-content').classList.add('modal-custom-animation-promotional');
      } else if (this.forPromotional) {
        document.querySelector('.modal-content').classList.add('modal-custom-animation');
      }

    }
  }

  imagePicker(category) {
    return this.sharedService.notificationImagePicker(category);
  }


  closeModal() {
    const slideId = _.get(this.slideEvent, 'current', null);
    const nID: any = _.get(this.promotional, slideId + '.nID', '');
    const data: any = {
      nID: nID
    };
    if (nID !== '') {
      this.markNotificationAsRead(data);
    }
    this.ngbActiveModal.close();
  }

  viewAll() {
    this.forNotification = true;
    this.router.navigate(['./my-mindspark/mailbox']);
    this.ngbActiveModal.close();
  }

  readNotification(notification) {
    this.contentService.readNotification(notification);
    this.ngbActiveModal.close();
  }

  manageDisplay() {
    if (this.notificationTrigger === 'click') {
      this.forNotification = true;
      this.forPromotional = false;
    } else if (this.notificationTrigger === 'fly') {
      this.forNotification = false;
      this.forPromotional = true;
    }
  }

  ngOnDestroy() {
    if (this.getNotificationsSubscription) {
      this.getNotificationsSubscription.unsubscribe();
    }
    if (this.flyNotificationStatusSubscription) {
      this.flyNotificationStatusSubscription.unsubscribe();
    }
    if (this.triggerSubscription) {
      this.triggerSubscription.unsubscribe();
    }
  }
}
