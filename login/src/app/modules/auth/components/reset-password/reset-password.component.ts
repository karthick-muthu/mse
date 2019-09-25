import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidators } from '../../../../shared/validators/password/password.validator';
import { LoginService } from '../../services/login/login.service';
import { AuthService } from '../../services/auth/auth.service';
import { LoginSettings } from '../../../../settings/login.settings';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ms-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  topTitleHeaderRemember: string;
  topTitleHeaderGreat: string;
  language: any;
  page: any;
  passwordResetSuccess: boolean;
  errorInfo: any;
  doneProcess: boolean;
  username: any;
  description: string;
  title: string;
  isPicturePassword: boolean;
  resetForm: boolean;
  isTextPassword: boolean;
  passwordType: any;
  animalPassword: any;
  animalPasswordPics: any;
  foodPassword: any;
  foodPasswordPics: any;
  passwordFormName: string;
  selectedCurrentPassword: any;
  selectedNewPassword: any;
  picturePassword: string;
  newPassword: string;
  passwordToSet: string;
  passwordForm: FormGroup;
  newPasswordA: string;
  newPasswordB: string;
  constructor(private fb: FormBuilder, private authService: AuthService, private loginService: LoginService, private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.authService.setSiteTitle('Reset Password');
    this.passwordForm = fb.group({
      'password': [null, [Validators.required, Validators.minLength(4), Validators.pattern(LoginSettings.PASSWORD_REGEX)]],
      'confirmPassword': [{ value: '', disabled: true }, Validators.required]
    }, {
        validator: PasswordValidators.matchPassword
      });
    this.authService.setPopState('otherPages');
    this.language = _.get(this.activatedRoute, 'params.value.lang', 'en').toLowerCase();
    this.authService.setRouteLang(this.language);
    this.authService.changeLanguageRoute(this.language);
    this.authService.getReloadRestrict().subscribe(result => {
      this.page = result.page;
      if (this.page !== 'login') {
        const url = this.language + '/error/reload';
        this.router.navigate([url]);
      }
    });
    this.authService.setBeforeUnloadRestrict('canreload');
  }

  ngOnInit() {
    this.authService.getPasswordType().subscribe(
      result => this.passwordType = result.type
    );
    this.authService.getUsername().subscribe(
      result => this.username = result.username
    );
    if (this.passwordType === LoginSettings.PASSWORD_TYPES[0]) {
      this.isTextPassword = true;
      this.resetForm = true;
      this.title = 'reset password';
      this.description = 'enter the field below to proceed';
    } else if (this.passwordType === LoginSettings.PASSWORD_TYPES[1]) {
      this.isPicturePassword = true;
      this.title = 'reset password';
      this.description = 'click next to start your lessons';
    }
  }
  picturePasswordEmitter(event) {
    const data = {
      'newPasswordType': 'picture',
      'newPassword': event.password,
      'username': this.username
    };
    this.authService.showLoader();
    this.loginService.setPasswordAfterReset(data).subscribe(
      setPasswordResult => {
        const response = this.authService.validateResponse(setPasswordResult, {});
        if (response === 'success') {
          this.topTitleHeaderGreat = 'great';
          this.topTitleHeaderRemember = 'remember your picture password';
          this.title = '';
          this.description = '';
          const password = event.indeces;
          this.newPasswordA = 'img' + (parseInt(password.a, 10) + 1);
          this.newPasswordB = 'img' + (parseInt(password.b, 10) + 1);
          this.authService.setReloadRestrict('login');
          this.showPasswordResetSuccess();
        }
        this.authService.hideLoader();
      },
      responseError => {
        this.errorInfo = this.authService.errorHandler(responseError);
      }
    );
  }
  showPasswordResetSuccess() {
    this.passwordResetSuccess = true;
    this.doneProcess = true;
  }
  passwordEmitter(password) {
    const data = {
      'newPasswordType': 'text',
      'newPassword': password,
      'username': this.username
    };
    this.authService.showLoader();
    this.loginService.setPasswordAfterReset(data).subscribe(result => {
      const response = this.authService.validateResponse(result, {});
      if (response === 'success') {
        this.title = 'success';
        this.description = '';
        this.doneProcess = true;
        this.resetForm = false;
      }
      this.authService.hideLoader();
    },
      responseError => {
        this.errorInfo = this.authService.errorHandler(responseError);
      });
  }
  handleConfirmPasswordDisable(event) {
    const control = this.passwordForm.controls['password'];
    if (control.value !== null) {
      if (control.valid && !control.hasError('pattern') && !control.hasError('minlength')) {
        this.passwordForm.controls['confirmPassword'].enable();
      } else {
        this.passwordForm.controls.confirmPassword.setValue(null);
        this.passwordForm.controls['confirmPassword'].disable();
      }
    } else {
      this.passwordForm.controls['confirmPassword'].disable();
    }
  }
  endProcess() {
    this.authService.setBeforeUnloadRestrict('blockReload');
    this.loginService.getLandingPage(null);
  }
}
