import { Component, OnDestroy, ViewChild, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommentModalService } from './comment-modal.service';
import { SharedService } from '../../../shared.service';
import { ContentService } from '../../../services/content/content.service';
import { AppSettings } from '../../../../settings/app.settings';
import * as _ from 'lodash';

@Component({
  selector: 'ms-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss'],
})
export class CommentModalComponent implements OnDestroy {
  @ViewChild('uploadFile') attachFile;
  template: string;
  commentForm: FormGroup;
  fileName: any;
  files: any[] = [];
  errorInfo: any;
  uploadFileError: string;
  templateClass: string;
  commentStatus: string;

  private contentDetails: any;
  private getTemplateService: any;
  private getQuestionContentService: any;

  constructor(private router: Router, public activeModal: NgbActiveModal, private commentModalService: CommentModalService,
    private contentService: ContentService, private sharedService: SharedService, @Inject(DOCUMENT) private document: Document) {
    this.commentStatus = '';
    this.getTemplateService = this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
        this.setClassName();
      },
      responseError => this.errorInfo = responseError
    );
    this.getQuestionContentService = this.contentService.getQuestionContent().subscribe(
      result => this.contentDetails = result,
      responseError => this.errorInfo = responseError
    );
    this.commentForm = new FormGroup({
      messageBody: new FormControl('', Validators.required)
    });
    this.removeFile();
  }

  ngOnDestroy() {
    this.getTemplateService.unsubscribe();
    this.getQuestionContentService.unsubscribe();
  }

  upload() {
    document.getElementById('upload-file').click();
  }

  writeComment() {
    this.sharedService.showLoader();
    let uploadFileState = '';
    const maxFileUpload = AppSettings.MAX_IMAGE_SIZE;
    const formData = new FormData();
    if (this.attachFile) {
      const file = this.attachFile.nativeElement;
      if (file.files && file.files[0]) {
        const uploadFile = file.files;
        for (let i = 0; i < uploadFile.length; i++) {
          const thisFile = uploadFile[i];
          if (!this.sharedService.checkFileExtension(thisFile.type, 'image')) {
            uploadFileState = 'invalidType';
          } else {
            const fileSize = thisFile.size / 1024;
            if (fileSize > maxFileUpload * 1024) {
              uploadFileState = 'fileSize';
            }
          }
        }
        if (uploadFileState === '') {
          for (let i = 0; i < uploadFile.length; i++) {
            formData.append('attachments[]', uploadFile[i]);
          }
        } else if (uploadFileState === 'invalidType') {
          const acceptedTypes = AppSettings.IMAGE_FORMAT.join(' or ');
          this.uploadFileError = 'Upload only files of type ' + acceptedTypes + '.';
        } else if (uploadFileState === 'fileSize') {
          this.uploadFileError = 'File size should not be greater than ' + maxFileUpload + 'MB.';
        }
        if (this.uploadFileError !== '') {
          setTimeout(() => this.uploadFileError = '', 3000);
        }
      } else {
        console.log('No file selected.');
      }
      if (uploadFileState === '') {
        this.commentStatus = 'sending';
        formData.append('messageBody', this.commentForm.value.messageBody);
        let pageId = this.router.url.substr(1);
        if (pageId === 'content') {
          pageId = 'contentPage';
          const contentDetails: any = {
            'contentType': this.contentDetails.contentType,
            'context': this.contentDetails.context,
            'revisionNo': this.contentDetails.revisionNo,
            'contentSeqNum': this.contentDetails.contentSeqNum,
            'contentAttempted': this.contentDetails.contentAttempted,
            'dynamicParameters': this.contentDetails.dynamicParameters,
          };
          formData.append('contentID', this.contentDetails.contentId);
          formData.append('contentDetails', JSON.stringify(contentDetails));
        }
        formData.append('pageID', pageId);
        this.commentModalService.createComment(formData).subscribe(
          result => {
            const status = this.contentService.validateResponse(result, {});
            this.sharedService.handleUnexpectedResponse(status);
            if (status === 'success') {
              this.commentStatus = 'success';
              setTimeout(() => this.activeModal.close('Close click'), 5000);
              const url = this.router.url;
              if (_.endsWith(url, 'mailbox')) {
                this.contentService.setNewComment(true);
              }
            }
            this.sharedService.hideLoader();
          },
          responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
        );
      } else {
        this.sharedService.hideLoader();
      }
    }
  }

  onChange() {
    this.files = [];
    if (this.attachFile) {
      const file = this.attachFile.nativeElement;
      if (file.files && file.files[0]) {
        const uploadFile = file.files;
        for (let i = 0; i < uploadFile.length; i++) {
          const oneFile = uploadFile[i];
          this.files.push({ fileName: oneFile.name });
        }
      } else {
        console.log('No file selected.');
      }
    }
  }

  removeFile() {
    if (this.attachFile) {
      this.attachFile.nativeElement.value = '';
      this.files = [];
    }
  }

  setClassName() {
    this.templateClass = this.sharedService.getClassName();
  }

  disableSend() {
    return this.commentForm.invalid;
  }

}
