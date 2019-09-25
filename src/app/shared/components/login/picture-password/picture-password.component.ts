import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { AppSettings } from '../../../../settings/app.settings';

@Component({
  selector: 'ms-picture-password',
  templateUrl: './picture-password.component.html',
  styleUrls: ['./picture-password.component.scss']
})
export class PicturePasswordComponent implements OnInit {
  newPassword: string;
  picturePassword: string;
  passwordToSet: string;
  passwordResetSuccess: boolean;
  animalPassword: any;
  animalPasswordPics: any;
  foodPassword: any;
  foodPasswordPics: any;
  passwordFormName: string;
  selectedCurrentPassword: any;
  selectedNewPassword: any;
  @Output() picturePasswordEmitter: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
    this.passwordResetSuccess = false;
    this.animalPassword = AppSettings.ANIMAL_PASSWORD;
    this.animalPasswordPics = _.values(this.animalPassword);
    this.foodPassword = AppSettings.FOOD_PASSWORD;
    this.foodPasswordPics = _.values(this.foodPassword);
    this.passwordFormName = 'current';
    this.passwordToSet = 'a';
    this.picturePassword = '';
    this.newPassword = '';
    this.selectedCurrentPassword = {
      'a': '',
      'b': ''
    };
    this.selectedNewPassword = {
      'a': '',
      'b': ''
    };
  }
  checkActiveImage(index: number, type: string) {
    const password = (this.passwordFormName === 'current') ? this.selectedCurrentPassword : this.selectedNewPassword;
    if (password[type] === index.toString()) {
      return true;
    }
    return false;
  }
  disableSubmit(type: string) {
    let flag = true;
    let password: any = (type === 'current') ? this.picturePassword : this.newPassword;

    password = password.split('|');
    if (password.length === 2 && password[0] !== '' && password[1] !== '') {
      flag = false;
    }
    return flag;
  }
  selectedPassword(index: number, type: string) {
    const thisPassword = type + 'img' + (index + 1);
    let password = (this.passwordFormName === 'current') ? this.picturePassword : thisPassword;
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
    this.passwordToSet = (type === 'a') ? 'b' : 'c';
    this.setSelectedPassword(password, type, index);
  }

  setSelectedPassword(password: string, type: string, index: number) {
    if (this.passwordFormName === 'current') {
      this.picturePassword = password;
      this.selectedCurrentPassword[type] = index.toString();
    }
  }
  updateMyPassword() {
    const eventObject = {
      password: this.picturePassword,
      indeces: this.selectedCurrentPassword
    };
    this.picturePasswordEmitter.emit(eventObject);
  }
}
