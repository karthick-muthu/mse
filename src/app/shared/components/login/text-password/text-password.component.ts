import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidators } from '../../../validators/password/password.validator';
import { AppSettings } from '../../../../settings/app.settings';

@Component({
  selector: 'ms-text-password',
  templateUrl: './text-password.component.html',
  styleUrls: ['./text-password.component.scss']
})
export class TextPasswordComponent implements OnInit {
  passwordSection: boolean;
  passwordForm: FormGroup;
  @Output() passwordEmitter: EventEmitter<any> = new EventEmitter<any>();
  constructor(private fb: FormBuilder) {

    this.passwordForm = fb.group({
      'password': [null, [Validators.required, Validators.minLength(4), Validators.pattern(AppSettings.PASSWORD_REGEX)]],
      'confirmPassword': [{ value: '', disabled: true }, Validators.required]
    }, {
        validator: PasswordValidators.matchPassword
      });
  }

  ngOnInit() {
    this.passwordSection = true;
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
    this.passwordEmitter.emit(password);
  }
}
