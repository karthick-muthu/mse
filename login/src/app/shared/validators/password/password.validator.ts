import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import * as _ from 'lodash';

export class PasswordValidators {

    static matchPassword(c: AbstractControl): ValidationErrors | null {
        const newPassword: any = c.get('newPassword');
        const confirmNewPassword: any = c.get('confirmNewPassword');
        const newPasswordValue = _.get(newPassword, 'value', '');
        const confirmNewPasswordValue = _.get(confirmNewPassword, 'value', '');
        if (c.touched && newPassword && confirmNewPassword &&
            !_.isEmpty(newPasswordValue) && !_.isEmpty(confirmNewPasswordValue)) {
            if (newPasswordValue === confirmNewPasswordValue) {
                return null;
            }
            return { matchPassword: true };
        }
        return null;
    }
}
