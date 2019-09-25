import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { AppSettings } from '../../../../settings/app.settings';
import { CommentModalComponent } from '../../../../shared/components/comments/comment-modal/comment-modal.component';
import { ContentService } from '../../../../shared/services/content/content.service';
import { SharedService } from '../../../../shared/shared.service';
import { MailboxService } from './mailbox.service';

@Component({
  selector: 'ms-mailbox',
  templateUrl: './mailbox.component.html',
  styleUrls: ['./mailbox.component.scss']
})
export class MailboxComponent implements OnInit, OnDestroy {
  template: string;
  templateClass: string;
  textlimit: number;
  mailBox: any;
  mailCount: number;
  errorInfo: any;

  private getTemplateService: Subscription;
  private getNewCommentService: Subscription;

  constructor(private router: Router, private mailBoxService: MailboxService,
    private sharedService: SharedService, private contentService: ContentService) {
    this.sharedService.setSiteTitle('Mailbox');
    this.textlimit = AppSettings.TEXT_LIMIT;
    this.getTemplateService = this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.templateClass = this.sharedService.getClassName();
      },
      responseError => this.errorInfo = responseError
    );
    this.getNewCommentService = this.contentService.getNewComment().subscribe(
      result => {
        if (result.added) {
          this.getmailBoxData();
        }
      }
    );
  }

  ngOnInit() {
    // this.questionDisplayReformService.loadJS();
    this.getmailBoxData();
  }

  ngOnDestroy(): void {
    this.getTemplateService.unsubscribe();
    this.getNewCommentService.unsubscribe();
  }

  getmailBoxData() {
    this.sharedService.showLoader();
    this.mailBoxService.getMailboxData().subscribe(
      result => {
        const status = this.contentService.validateResponse(result, {});
        this.sharedService.handleUnexpectedResponse(status);
        if (status === 'success') {
          this.mailBox = result;
          this.mailCount = _.get(this.mailBox, 'mails', []).length;
          this.contentService.setTemplate(result);
          this.contentService.setBasicData(result);
        }
        this.sharedService.hideLoader();
      },
      responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
    );
  }
  imagePicker(category) {
    let image = 'assets/common/images/mindspark.png';
    if (category) {
      image = this.sharedService.notificationImagePicker(category);
    }
    return image;
  }
  open() {
    setTimeout(() => {
      this.sharedService.open(CommentModalComponent);
    }, 200);
  }

  readMail(mail) {
    this.contentService.setReadMailData(mail);
    this.router.navigate(['my-mindspark/mailbox/' + mail.messageID]);
  }
}
