import { AppSettings } from '../../../settings/app.settings';
import { AbstractControl, ValidationErrors } from '@angular/forms';

export class DOBValidator {

    static checkDOB(c: AbstractControl): ValidationErrors | null {
        const date = parseInt(c.get('dateOfBirth').value, 10);
        const month = parseInt(c.get('monthOfBirth').value, 10);
        const year = parseInt(c.get('yearOfBirth').value, 10);

        if (DOBValidator.validateYear(year)) {
            if (DOBValidator.validateMonth(month)) {
                if (DOBValidator.validateDate(date, month, year)) {
                    if (DOBValidator.validateCurrentDate(date, month, year)) {
                        return null;
                    } else {
                        return { dob: { greater: true } };
                    }
                }
            }
        }

        return { dob: { invalid: true } };
    }

    static checkDateMonth(c: AbstractControl): ValidationErrors | null {
        const date = parseInt(c.get('dateOfBirth').value, 10);
        const month = parseInt(c.get('monthOfBirth').value, 10);

        if (DOBValidator.validateMonth(month)) {
            if (DOBValidator.validateDate(date, month, 2000)) {
                return null;
            }
        }

        return { dob: true };
    }

    private static validateYear(year: number) {
        const minYear = AppSettings.DOB_MIN_YEAR;
        const maxYear = new Date().getFullYear();
        return (year >= minYear && year <= maxYear);
    }

    private static validateMonth(month: number) {
        return (month >= 1 && month <= 12);
    }

    private static validateDate(date: number, month: number, year: number) {
        const daysOfMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let maxDate = daysOfMonths[(month - 1)];
        maxDate = DOBValidator.checkFebMaxDate(date, month, year, maxDate);
        return (date >= 1 && date <= maxDate);
    }

    private static validateCurrentDate(date: number, month: number, year: number) {
        const dob = new Date(year, month, date);
        const today = new Date();
        return (dob <= today);
    }

    private static checkFebMaxDate(date: number, month: number, year: number, maxDate: number): number {
        let centurialYear = false;
        let leapYear = false;
        if (month === 2) {
            leapYear = (year % 4 === 0);
            if (leapYear && (year % 100 === 0)) {
                centurialYear = (year % 400 === 0);
            } else {
                centurialYear = true;
            }
        }
        return (leapYear && centurialYear) ? ++maxDate : maxDate;
    }
}
