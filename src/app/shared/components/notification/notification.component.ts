import { Component, OnInit, Inject, Input, OnChanges } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { SharedService } from '../../shared.service';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ContentService } from '../../services/content/content.service';
import { Subscription } from 'rxjs/Subscription';
import { NgbCarousel, NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NotificationModalT2Component } from '../notification-modal/notification-modal-t2/notification-modal-t2.component';


@Component({
  selector: 'ms-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  providers: [NgbCarouselConfig]


})
export class NotificationComponent implements OnInit, OnChanges {

  showPopup = true;
  constructor(private sharedService: SharedService, @Inject(DOCUMENT) private document: Document, config: NgbCarouselConfig,
    private router: Router, private contentService: ContentService) {
    config.interval = 0;
  }

  ngOnInit() {

  }
  open() {
    this.sharedService.open(NotificationModalT2Component, ['backDropStop']);
    this.contentService.setNotificationTrigger('click');
  }

  ngOnChanges(changes: any) {

  }

}
