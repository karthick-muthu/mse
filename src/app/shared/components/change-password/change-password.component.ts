import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms';
import { ChangePasswordService } from './change-password.service';
import { SharedService } from '../../shared.service';
import { ContentService } from '../../services/content/content.service';
import { AppSettings } from '../../../settings/app.settings';
import { PasswordValidators } from '../../validators/password/password.validator';
import * as _ from 'lodash';

@Component({
  selector: 'ms-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @Input('template') template: string;
  @ViewChild('changePswrdModal') changePswrdModal;
  // common
  errorInfo: any;
  currentPasswordIncorrect: string;
  passwordType: any;

  // Picture Password
  passwordFormName: string;
  currentPassword: string;
  newPassword: string;
  animalPassword: any;
  animalPasswordPics: any;
  foodPassword: any;
  foodPasswordPics: any;
  selectedCurrentPassword: any;
  selectedNewPassword: any;
  passwordResetSuccess: boolean;
  hideArrow: boolean;
  passwordToSet: string;
  newPasswordA: string;
  newPasswordB: string;
  isActiveOne: boolean;
  isActiveTwo: boolean;
  isSuccessOne: boolean;
  isSuccessTwo: boolean;

  // Text Password
  changePassword: FormGroup;
  matchPasswordClass: string;
  passwordSuccess: boolean;

  constructor(private changePasswordService: ChangePasswordService, private sharedService: SharedService,
    private contentService: ContentService) {
    this.contentService.getTemplate().subscribe(
      result => {
        this.template = this.contentService.getTemplateId(result);
      },
      responseError => this.errorInfo = responseError
    );
    // lowergrade
    this.animalPassword = AppSettings.ANIMAL_PASSWORD;
    this.animalPasswordPics = _.values(this.animalPassword);
    this.foodPassword = AppSettings.FOOD_PASSWORD;
    this.foodPasswordPics = _.values(this.foodPassword);
    // highergrade
    this.matchPasswordClass = '';
    this.resetPasswordSection();
  }

  ngOnInit() { }

  open(content) {
    this.sharedService.open(content);
    this.resetPasswordSection();
  }

  private resetPasswordSection() {
    switch (this.passwordType) {
      case 'picture':
        this.resetPicturePassword();
        break;
      case 'text':
        this.resetTextPassword();
        break;
    }
  }

  getMyPasswordType() {
    this.sharedService.showLoader();
    this.changePasswordService.getMyPasswordType().subscribe(
      result => {
        this.passwordType = _.get(result, 'passwordType', '').toLowerCase();
        this.open(this.changePswrdModal);
        this.sharedService.hideLoader();
      },
      responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
    );
  }

  updatePassword() {
    let currentPassword, newPassword;
    this.currentPasswordIncorrect = null;
    if (this.passwordType === 'picture') {
      currentPassword = this.currentPassword;
      newPassword = this.newPassword;
    } else if (this.passwordType === 'text') {
      currentPassword = _.get(this.changePassword, 'value.currentPassword', '');
      newPassword = _.get(this.changePassword, 'value.newPassword', '');
    }
    const data = {
      'passwordType': this.passwordType,
      'currentPassword': currentPassword,
      'newPassword': newPassword
    };
    this.updatePasswordData(data);
  }

  updatePasswordData(data) {
    this.sharedService.showLoader();
    this.changePasswordService.changePasswordData(data).subscribe(
      result => {
        const status = this.contentService.validateResponse(result, {});
        this.sharedService.handleUnexpectedResponse(status);
        if (status === 'success') {
          if (this.passwordType === 'picture') {
            const password = this.selectedNewPassword;
            this.newPasswordA = 'img' + (parseInt(password.a, 10) + 1);
            this.newPasswordB = 'img' + (parseInt(password.b, 10) + 1);
            this.showPasswordResetSuccess();
          } else if (this.passwordType === 'text') {
            this.passwordSuccess = true;
          }
        } else if (status === 'password_mismatch') {
          if (this.passwordType === 'picture') {
            this.resetPicturePassword();
            this.goBack('a');
          } else if (this.passwordType === 'text') {
            this.resetTextPassword();
            (<HTMLElement>document.getElementById('currentPassword')).focus();
          }
          this.currentPasswordIncorrect = result.resultMessage;
        }
        this.sharedService.hideLoader();
      },
      responseError => this.errorInfo = this.sharedService.handleResponseError(responseError)
    );
  }

  /* Picture Password Start */
  private resetPicturePassword() {
    this.setMarkerStatus(1);
    this.passwordFormName = 'current';
    this.passwordToSet = 'a';
    this.currentPassword = '';
    this.newPassword = '';
    this.passwordResetSuccess = false;
    this.hideArrow = true;
    this.selectedCurrentPassword = {
      'a': '',
      'b': ''
    };
    this.selectedNewPassword = {
      'a': '',
      'b': ''
    };
  }

  private showPasswordResetSuccess() {
    this.setMarkerStatus(3);
    this.passwordResetSuccess = true;
    this.hideArrow = true;
  }

  goBack(setPassword?) {
    setPassword = (setPassword) ? setPassword : 'b';
    this.setMarkerStatus(1);
    this.hideArrow = true;
    this.passwordFormName = 'current';
    this.passwordToSet = setPassword;
  }

  private setMarkerStatus(status) {
    this.isActiveOne = (status === 1);
    this.isActiveTwo = (status === 2);
    this.isSuccessOne = (status > 1);
    this.isSuccessTwo = (status > 2);
  }

  chooseNewPassword() {
    this.setMarkerStatus(2);
    this.hideArrow = false;
    this.passwordFormName = 'new';
    this.passwordToSet = 'a';
    this.newPassword = '';
    this.selectedNewPassword = {
      'a': '',
      'b': ''
    };
  }

  disableSubmit(type: string) {
    let flag = true;
    let password: any = (type === 'current') ? this.currentPassword : this.newPassword;
    password = password.split('|');
    if (password.length === 2 && password[0] !== '' && password[1] !== '') {
      flag = false;
    }
    return flag;
  }

  selectedPassword(index: number, type: string) {
    this.currentPasswordIncorrect = null;
    const thisPassword = type + 'img' + (index + 1);
    let password = (this.passwordFormName === 'current') ? this.currentPassword : this.newPassword;

    if (password === '') {
      password = (type === 'a') ? thisPassword + '|' : '|' + thisPassword;
    } else {
      const passwords = password.split('|');
      if (type === 'a') {
        passwords[0] = thisPassword;
      } else {
        passwords[1] = thisPassword;
      }
      password = passwords.join('|');
    }
    const passwords = password.split('|');
    this.passwordToSet = (type === 'a' && passwords[1] === '') ? 'b' : 'c';
    this.setSelectedPassword(password, type, index);
  }

  private setSelectedPassword(password: string, type: string, index: number) {
    if (this.passwordFormName === 'current') {
      this.currentPassword = password;
      this.selectedCurrentPassword[type] = index.toString();
    } else {
      this.newPassword = password;
      this.selectedNewPassword[type] = index.toString();
    }
  }

  checkActiveImage(index: number, type: string) {
    const password = (this.passwordFormName === 'current') ? this.selectedCurrentPassword : this.selectedNewPassword;
    if (password[type] === index.toString()) {
      return true;
    }
    return false;
  }
  /* Picture Password End */

  /* Text Password Start */
  private resetTextPassword() {
    this.currentPasswordIncorrect = null;
    this.passwordSuccess = false;
    const passwordRegex = AppSettings.PASSWORD_REGEX;
    this.changePassword = new FormGroup({
      currentPassword: new FormControl('', [Validators.required, Validators.pattern(passwordRegex), Validators.minLength(4)]),
      newPassword: new FormControl('', [Validators.required, Validators.pattern(passwordRegex), Validators.minLength(4)]),
      confirmNewPassword: new FormControl({ value: '', disabled: true }, [Validators.required])
    }, PasswordValidators.matchPassword);
    this.changePassword.reset();
  }

  getFormElement(elem) {
    return this.changePassword.get(elem);
  }

  checkChangePasswordFormInvalid() {
    return this.changePassword.invalid;
  }

  handleConfirmPasswordDisable(event) {
    const control = this.changePassword.controls.newPassword;
    if (control.value !== null) {
      if (control.valid && !control.hasError('pattern') && !control.hasError('minlength')) {
        this.changePassword.controls.confirmNewPassword.enable();
      } else {
        this.changePassword.controls.confirmNewPassword.setValue(null);
        this.changePassword.controls.confirmNewPassword.disable();
      }
    } else {
      this.changePassword.controls.confirmNewPassword.disable();
    }
  }

  clearPasswordIncorrect() {
    if (this.changePassword.controls.currentPassword.value !== null && this.currentPasswordIncorrect !== null) {
      this.currentPasswordIncorrect = null;
    }
  }
  /* Text Password End */

}
