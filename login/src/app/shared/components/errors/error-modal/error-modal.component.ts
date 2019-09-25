import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../modules/auth/services/auth/auth.service';
import { LoginService } from '../../../../modules/auth/services/login/login.service';

@Component({
  selector: 'ms-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']

})
export class ErrorModalComponent implements OnInit, AfterViewInit {
  jwt: any;

  parentRestrictedPageData: any;
  closeResult: string;
  data: string;
  apiCall: string;
  username: any;
  error: any;
  private baseURL: string;

  constructor(private loginService: LoginService, private authService: AuthService,
    private activeModal: NgbActiveModal, private router: Router) {
    this.baseURL = environment.apiBaseURL;
    this.authService.getParentRestrictedPageData().subscribe(result => {
      this.parentRestrictedPageData = result.data;
    });
  }

  ngAfterViewInit() {
    this.addClassForClose();
  }
  ngOnInit() {
    this.authService.getUsername().subscribe(result => {
      this.username = result.username;
    });
    this.authService.getAPICall().subscribe(result => {
      this.apiCall = result.apiName,
        this.data = result.data;
    });
    this.authService.getErrorType().subscribe(result => {
      this.error = result.errorType;
    });
    this.authService.getJWT().subscribe(result => {
      this.jwt = result.jwt;
    });

  }

  addClassForClose() {
    const modalDialog = document.querySelector('.modal-dialog');
    if (modalDialog !== undefined && modalDialog !== null && modalDialog !== undefined && modalDialog !== null) {
      modalDialog.classList.add('custom-width');
    } else {
      setTimeout(() => { this.addClassForClose(); }, 10);
    }
  }


  logoutOfOtherSessions() {
    const userDetails = {
      username: this.username
    };
    this.loginService.logoutAllSession(userDetails).subscribe(result => {
      if (this.authService.validateResponse(result, {}) === 'success') {
        const api = this.apiCall.toLowerCase();
        const data = this.data;
        this.authService.setAPICall(api, this.data);
      }
    });
    this.activeModal.close('Close click');
  }

  closeWindow() {
    this.activeModal.close('Close click');
  }



}
