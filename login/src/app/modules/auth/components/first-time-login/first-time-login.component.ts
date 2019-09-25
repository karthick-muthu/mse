import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { DOBValidator } from '../../../../shared/validators/dob/dob.validator';
import { LoginService } from '../../services/login/login.service';
import { PasswordValidators } from '../../../../shared/validators/password/password.validator';
import { AuthService } from '../../services/auth/auth.service';
import { LoginSettings } from '../../../../settings/login.settings';

@Component({
  selector: 'ms-first-time-login',
  templateUrl: './first-time-login.component.html',
  styleUrls: ['./first-time-login.component.scss']
})
export class FirstTimeLoginComponent implements OnInit {

  userCategory: any;
  showSecretQ: boolean;
  language: any;
  page: any;
  password: any;
  errorInfo: any;
  textPassword: any;
  passwordType: any;
  doneProcess: boolean;
  hideArrow: boolean;
  passwordResetSuccess: boolean;
  passwordSection: boolean;
  isActiveOne: boolean;
  isSuccessOne: boolean;
  isSuccessTwo: boolean;
  isActiveTwo: boolean;
  private items: any[] = [];
  secretQuestionSection: boolean;
  firstTimeUserDetails: any;
  username: any;
  isPicturePassword: boolean;
  finishedProcess: boolean;
  isTextPassword: boolean;
  newPasswordA: string;
  newPasswordB: string;
  from: string;
  constructor(private fb: FormBuilder, private service: LoginService, private authService: AuthService, private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.authService.setSiteTitle('First Time Login');
    this.authService.getPasswordType().subscribe(
      result => {
        this.passwordType = result.type;
      });
    this.authService.setPopState('otherPages');
    this.language = _.get(this.activatedRoute, 'params.value.lang', 'en').toString().toLowerCase();
    this.authService.setRouteLang(this.language);
    this.authService.changeLanguageRoute(this.language);

    this.authService.getBeforeUnloadRestrict().subscribe(result => {
    });
    this.authService.getReloadRestrict().subscribe(result => {
      this.page = result.page;
      if (this.page !== 'login') {
        const url = this.language + '/error/reload';
        this.router.navigate([url]);
      } else {

      }
    });
    this.authService.setBeforeUnloadRestrict('canreload');
  }

  ngOnInit() {

    this.finishedProcess = false;
    this.from = 'firstTime';
    this.firstTimeUserDetails = this.authService.getFirstTimeUserDetails();
    this.showSecretQ = _.get(this.firstTimeUserDetails, 'redirectionData.getSecretDetails', true);
    this.userCategory = _.get(this.firstTimeUserDetails, 'redirectionData.userCategory', '');
    this.isActiveOne = true;
    this.authService.getUsername().subscribe(result => {
      this.username = result.username;
    });
    this.from = 'firstTime';
    this.initialState();
  }

  initialState() {
    this.finishedProcess = false;
    this.isActiveOne = true;
    this.isActiveTwo = false;
    this.isSuccessOne = false;
    this.isSuccessTwo = false;
    this.secretQuestionSection = false;
    if (this.passwordType === LoginSettings.PASSWORD_TYPES[0]) {
      this.isTextPassword = true;
      this.passwordSection = true;
    } else if (this.passwordType === LoginSettings.PASSWORD_TYPES[1]) {
      this.isPicturePassword = true;
    }
  }
  goToLogin() {
    this.authService.setBeforeUnloadRestrict('blockReload');
    this.service.getLandingPage(null);
  }
  showSecretQuestionSection() {
    this.isSuccessOne = true;
    this.isActiveOne = false;
    this.isActiveTwo = true;
    this.passwordSection = false;
    this.secretQuestionSection = true;
    this.isTextPassword = false;
  }

  picturePasswordEmitter(event) {
    this.password = event.password;
    const password = event.indeces;
    this.passwordType = 'picture';
    this.newPasswordA = 'img' + (parseInt(password.a, 10) + 1);
    this.newPasswordB = 'img' + (parseInt(password.b, 10) + 1);
    this.showPasswordResetSuccess();
  }

  showPasswordResetSuccess() {
    this.isSuccessOne = true;
    this.isActiveOne = false;
    this.passwordResetSuccess = true;
    this.hideArrow = true;
    this.doneProcess = true;
  }
  goToSecrectQuestion() {

    if (this.showSecretQ) {
      this.secretQuestionSection = true;
      this.isActiveTwo = true;
      this.isPicturePassword = false;
      this.isSuccessOne = true;
    } else {
      const data: any = {
        newPassword: this.password,
        newPasswordType: this.passwordType,
      };
      this.submitNewLoginDetails(data);
    }
  }

  goBack() {
    if (this.isActiveTwo) {
      this.isActiveTwo = false;
      this.isActiveOne = true;
      this.isSuccessOne = false;
      this.isPicturePassword = true;
      this.secretQuestionSection = false;
      this.passwordResetSuccess = false;
      if (this.passwordType === LoginSettings.PASSWORD_TYPES[0]) {
        this.isTextPassword = true;
        this.isPicturePassword = false;
      } else if (this.passwordType === LoginSettings.PASSWORD_TYPES[1]) {
        this.isTextPassword = false;
        this.isPicturePassword = true;
      } else {
        this.isTextPassword = false;
        this.isPicturePassword = true;
      }
    } else if (this.isSuccessTwo) {
      this.isSuccessTwo = false;
      this.isActiveTwo = true;
      this.secretQuestionSection = true;
      this.finishedProcess = false;
    }

  }
  passwordEmitter(password) {
    this.password = password;
    this.passwordType = 'text';
    if (this.showSecretQ) {
      this.showSecretQuestionSection();
    } else {
      const data: any = {
        newPassword: this.password,
        newPasswordType: this.passwordType,
      };
      this.submitNewLoginDetails(data);
    }
  }
  secretQuestionDOBEmitter(event) {
    let date: any = event.dateOfBirth;
    let month: any = event.monthOfBirth;
    const year: any = event.yearOfBirth;
    date = this.authService.padPrefix(date, 2, '0');
    month = this.authService.padPrefix(month, 2, '0');
    const data: any = {
      newPassword: this.password,
      newPasswordType: this.passwordType,
      secretAnswer: event.secretAnswer,
      secretQuestionSelected: event.secretQuestion,
      dateOfBirth: year + '-' + month + '-' + date
    };
    if (date && month) {
      this.submitNewLoginDetails(data);
    }
  }

  submitNewLoginDetails(data) {
    this.authService.showLoader();
    this.service.sendNewLoginDetails(data).subscribe(result => {
      const reponse = this.authService.validateResponse(result, {});
      if (reponse === 'success') {
        this.isSuccessTwo = true;
        this.isActiveTwo = false;
        this.finishedProcess = true;
        this.secretQuestionSection = false;
      } else if (reponse === 'same_username_password') {
        this.authService.setTeacherHasSameUsernameAndPassword(true);
        this.initialState();
      }
      this.authService.hideLoader();
    },
      responseError => {
        this.errorInfo = this.authService.errorHandler(responseError);
      });
  }

}
