import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DOBValidator } from '../../../validators/dob/dob.validator';
import { LoginSettings } from '../../../../settings/login.settings';
import * as _ from 'lodash';
import { AuthService } from '../../../../modules/auth/services/auth/auth.service';

@Component({
  selector: 'ms-secret-question-dob',
  templateUrl: './secret-question-dob.component.html',
  styleUrls: ['./secret-question-dob.component.scss']
})
export class SecretQuestionDobComponent implements OnInit {
  secretQuestionsSelectedStatus: boolean;
  secretAnswerStatus: any;

  secretQuestion: any;
  private items: any[] = [];
  verifyForm: FormGroup;
  currentDOB: any;
  secretQuestionKeys: any[] = [];
  secretQuestionOptions: any[] = [];

  @Output('secretQuestionDOBEmitter') secretQuestionDOBEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input('firstTimeUserDetails') firstTimeUserDetails;
  @Input('from') from;
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.verifyForm = fb.group({
      'secretAnswer': [null, Validators.required],
      'secretQuestionOptions': [null, ''],
      'dateOfBirth': ['', Validators.required],
      'monthOfBirth': ['', Validators.required],
      'yearOfBirth': ['', Validators.required]
    }, {
        validator: DOBValidator.checkDOB
      });
  }

  ngOnInit() {
    this.secretQuestionsSelectedStatus = false;
    this.secretAnswerStatus = false;
    this.verifyForm.controls.secretQuestionOptions.setValue('');
    this.secretQuestion = 'secret answer';
    if (this.from === 'firstTime') {
      this.currentDOB = _.get(this.firstTimeUserDetails, 'redirectionData.dateOfBirth');
      if (this.currentDOB) {
        let tempDate: number;
        let tempMonth: number;
        let tempYear: number;
        const tempArray = this.currentDOB.split('-');
        tempYear = tempArray[0];
        tempMonth = this.authService.checkZeroPadding(tempArray[1]);
        tempDate = this.authService.checkZeroPadding(tempArray[2]);

        this.verifyForm.controls.dateOfBirth.setValue(tempDate);
        this.verifyForm.controls.yearOfBirth.setValue(tempYear);
        this.verifyForm.controls.monthOfBirth.setValue(tempMonth);
      }
      const tempSecretQuestion = _.toArray(_.get(this.firstTimeUserDetails, 'redirectionData.secretQuestions'));
      tempSecretQuestion.forEach(element => {
        this.secretQuestionOptions.push(element);
        this.secretQuestionKeys.push(element);
      });
    } else if (this.from === 'forgot') {
      const tempSecretQuestion = _.toArray(this.firstTimeUserDetails);
      tempSecretQuestion.forEach(element => {
        this.secretQuestionOptions.push(element);
        this.secretQuestionKeys.push(element);
      });
    }
  }
  captureState(event) {
    if (event) {
      const secretAnswer = this.verifyForm.controls.secretAnswer.value;
      this.secretAnswerStatus = (secretAnswer) ? true : false;
    }
  }
  enableSecretQuestionsSubmit() {
    let flag = false;
    const secretAnswer = this.verifyForm.controls.secretAnswer.value;
    if (secretAnswer) {
      const secretQuestionsSelected = this.verifyForm.controls.secretQuestionOptions.value;
      if (this.secretQuestionsSelectedStatus && this.secretAnswerStatus && !this.verifyForm.errors) {
        flag = true;
      }
    }
    return flag;
  }
  createDateRange(type: string) {
    switch (type) {
      case 'date':
        this.generateDate();
        break;
      case 'month':
        this.generateMonth();
        break;
      case 'year':
        this.generateYear();
        break;
      default:
        this.generateDate();
        break;
    }
    return this.items;
  }
  generateDate() {
    this.items = [];
    for (let i = 1; i < 32; i++) {
      this.items.push(i);
    }
  }

  generateMonth() {
    this.items = [];
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    this.items = months;
  }
  generateYear() {
    const serverDate: any = _.get(this.firstTimeUserDetails, 'today', '');
    const date = new Date();
    const systemYear = date.getFullYear();
    const year: number = (serverDate && (serverDate.split('-'))[0] !== '') ? (serverDate.split('-'))[0] : systemYear;
    this.items = [];
    const max_year = year - 4;
    for (let i = max_year; i >= LoginSettings.DOB_MIN_YEAR; i--) {
      this.items.push(i);
    }
  }
  submitDetails() {
    const emit = {
      secretQuestion: this.secretQuestion,
      secretAnswer: this.verifyForm.controls.secretAnswer.value.toLowerCase(),
      dateOfBirth: this.verifyForm.controls.dateOfBirth.value,
      monthOfBirth: this.verifyForm.controls.monthOfBirth.value,
      yearOfBirth: this.verifyForm.controls.yearOfBirth.value
    };
    this.secretQuestionDOBEmitter.emit(emit);
  }
  selectQuestionOption(event) {
    let secretQ;
    secretQ = event.target.value;
    this.secretQuestion = secretQ;
    this.secretQuestionsSelectedStatus = (secretQ && secretQ !== 'secret answer') ? true : false;
  }

}
