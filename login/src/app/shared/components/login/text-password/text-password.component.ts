import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, Input } from '@angular/core';
import { LoginService } from '../../../../modules/auth/services/login/login.service';
import { AuthService } from '../../../../modules/auth/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidators } from '../../../validators/password/password.validator';
import { LoginSettings } from '../../../../settings/login.settings';
import { Subscription } from 'rxjs/Subscription';
import { PasswordShowHideDirective } from '../../../directives/password-show-hide/passwordShowHide.directive';
import * as _ from 'lodash';


@Component({
  selector: 'ms-text-password',
  templateUrl: './text-password.component.html',
  styleUrls: ['./text-password.component.scss']
})
export class TextPasswordComponent implements OnInit, OnDestroy {
  teacherHasSameUsernameAndPassword: any;
  firstTimeUserDetails: any;
  userCategory: any;
  confirmPasswordToggleText: string;
  passwordToggleText: string;
  passwordSubscription: Subscription;
  passwordSection: boolean;
  passwordForm: FormGroup;
  passwordShow = false;
  confirmPasswordShow = false;
  username: any;
  passwordNotUnique: boolean;
  isTeacher: boolean;
  @Input('from') from: any;
  @Output() passwordEmitter: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(PasswordShowHideDirective) input: PasswordShowHideDirective;
  @ViewChild(PasswordShowHideDirective) cinput: PasswordShowHideDirective;
  constructor(private fb: FormBuilder, private authService: AuthService, private loginService: LoginService) {

    this.passwordForm = fb.group({
      'password': [null, [Validators.required, Validators.minLength(4), Validators.pattern(LoginSettings.PASSWORD_REGEX)]],
      'confirmPassword': [{ value: '', disabled: true }, Validators.required]
    }, {
        validator: PasswordValidators.matchPassword
      });
    this.teacherHasSameUsernameAndPassword = false;
    this.firstTimeUserDetails = this.authService.getFirstTimeUserDetails();
    this.userCategory = _.get(this.firstTimeUserDetails, 'redirectionData.userCategory', '');
    this.authService.getTeacherHasSameUsernameAndPassword().subscribe(result => {
      this.teacherHasSameUsernameAndPassword = result.hasSameUsernameAndPassword;
    });
  }

  ngOnInit() {
    this.passwordNotUnique = false;
    this.isTeacher = false;
    this.passwordSection = true;
    this.passwordSubscription = this.authService.getTextPassword().subscribe(result => {
      if (result.password) {
        this.passwordForm.controls.password.setValue(result.password);
        this.passwordForm.controls.confirmPassword.enable();
        this.passwordForm.controls.confirmPassword.setValue(result.password);
      }
    });
    this.passwordToggleText = 'show';
    this.confirmPasswordToggleText = 'show';
    this.authService.getUsername().subscribe(result => {
      this.username = result.username;
    });
  }

  handleConfirmPasswordDisable(event) {
    const passwordControl = this.passwordForm.controls['password'];
    const confirmPasswordControl = this.passwordForm.controls['confirmPassword'];
    if (passwordControl.value !== null) {
      if (passwordControl.valid && !passwordControl.hasError('pattern') && !passwordControl.hasError('minlength')) {
        confirmPasswordControl.enable();
      } else {
        this.passwordForm.controls.confirmPassword.setValue(null);
        confirmPasswordControl.disable();
      }
    } else {
      confirmPasswordControl.disable();
    }
  }

  disablePasswordSubmit() {
    return (this.passwordForm.valid &&
      this.passwordForm.controls['password'].value === this.passwordForm.controls['confirmPassword'].value);
  }

  submitPassword() {
    const password = this.passwordForm.controls['password'].value;
    const confirmPassword = this.passwordForm.controls['password'].value;
    this.authService.setTextPassword(password);
    this.passwordEmitter.emit(password);
  }

  togglePasswordShow() {
    this.passwordShow = !this.passwordShow;
    this.passwordToggleText = this.authService.togglePasswordShow(this.passwordShow, 'password');
  }

  toggleConfirmPasswordShow() {
    this.confirmPasswordShow = !this.confirmPasswordShow;
    this.confirmPasswordToggleText = this.authService.togglePasswordShow(this.confirmPasswordShow, 'confirmpassword');
  }

  ngOnDestroy(): void {
    this.passwordSubscription.unsubscribe();
  }

}
