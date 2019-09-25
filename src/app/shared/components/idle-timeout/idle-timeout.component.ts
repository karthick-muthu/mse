import { Component, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { SharedService } from '../../shared.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { ProgressBarModule } from 'ng2-progress-bar';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ViewChild } from '@angular/core';
import 'rxjs/Rx';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { AppSettings } from '../../../settings/app.settings';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ms-idle-timeout',
  templateUrl: './idle-timeout.component.html',
  styleUrls: ['./idle-timeout.component.scss']
})
export class IdleTimeoutComponent implements AfterViewInit {
  @ViewChild('idleModal') idleModal: ElementRef;
  @ViewChild('timedOutModal') timedOutModal;
  private jwt: any;
  idleState = 'Not started.';
  timedOut = false;
  totaltimeOut: number;
  timeLeft: number;
  takeValue: any;
  scoreSheet: any;
  showLogoutModal = true;
  private getScoreSheetService: Subscription;

  constructor(private sharedService: SharedService, private contentService: ContentService,
    private idle: Idle, private modalService: NgbModal, private router: Router) {
    this.totaltimeOut = AppSettings.IDLE_SESSION.TIMEOUT;
    this.timeLeft = AppSettings.IDLE_SESSION.WARNING_TIMEOUT;
    this.sharedService.getJWT().subscribe(result => {
      this.jwt = _.get(result, 'jwt');
    });
    this.getScoreSheetService = this.contentService.getScoreSheet().subscribe(
      result => {
        this.scoreSheet = result;
        if (this.scoreSheet.open) {
          this.showLogoutModal = false;
        }
      });
  }

  ngAfterViewInit(): void {
    // Set timout untill the popup appears
    this.idle.setIdle(this.totaltimeOut);
    // Set timout for the popup
    this.idle.setTimeout(this.timeLeft);
    // Set interrupts
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleStart.subscribe(() => {
      if (this.jwt !== (null && '' && undefined) && this.showLogoutModal) {
        this.idleState = 'You\'ve gone idle!';
        this.sharedService.open(this.idleModal);
      }
    });

    this.idle.onIdleEnd.subscribe(() => {
      if (this.jwt !== (null && '' && undefined)) {
        const newThis = this;
        this.idleState = 'You are no longer idle.';
        setTimeout(() => { this.sharedService.dismissOpenModal(); }, 500);
      }
    });

    this.idle.onTimeoutWarning.subscribe((countdown) => {
      this.takeValue = countdown,
        this.idleState = 'Logging out of Mindspark in ' + this.takeValue + ' seconds!';
    });

    this.idle.onTimeout.subscribe(() => {
      if (this.jwt !== (null && '' && undefined)) {
        this.idleState = 'Timed out!';
        this.timedOut = true;
        this.sharedService.dismissOpenModal();
        this.contentService.setLogoutSession(1);
      }
    });
    this.reset();
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  openMyModal(whichModal) {
    this.sharedService.open(whichModal);
  }

}
