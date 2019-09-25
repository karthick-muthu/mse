import { Component, OnDestroy, Input } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContentService } from '../../../services/content/content.service';
import { Subscription } from 'rxjs/Subscription';
import { SharedService } from '../../../shared.service';
import * as _ from 'lodash';

@Component({
  selector: 'ms-sparkie-alerts',
  templateUrl: './sparkie-alerts.component.html',
  styleUrls: ['./sparkie-alerts.component.scss']
})
export class SparkieAlertsComponent implements OnDestroy {
  @Input('timed') timed: any;
  questionContent: any;
  attemptNumber;
  template;
  getQuestionContentService: Subscription;

  constructor(private modalService: NgbModal, private sharedService: SharedService, public activeModal: NgbActiveModal, private contentService: ContentService) {
    this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(
      result => {
        this.attemptNumber = _.get(result, 'attemptNumber', 1);
      }
    );
    this.contentService.getTemplate().subscribe(
      result => {
        this.template = _.get(result, 'template', 1);
      });
  }

  ngOnDestroy() {
    this.getQuestionContentService.unsubscribe();
  }

  closeSparkieAlertModal() {
    const closeSparkieAlert = document.getElementById('closeWorksheetModal');
    if (closeSparkieAlert) {
      closeSparkieAlert.click();
    }
    this.activeModal.dismiss();
    this.sharedService.dismissOpenModal();
  }

}
