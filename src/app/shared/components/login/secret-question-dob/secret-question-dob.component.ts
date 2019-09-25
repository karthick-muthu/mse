import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DOBValidator } from '../../../validators/dob/dob.validator';
import * as _ from 'lodash';
import { AppSettings } from '../../../../settings/app.settings';

@Component({
  selector: 'ms-secret-question-dob',
  templateUrl: './secret-question-dob.component.html',
  styleUrls: ['./secret-question-dob.component.scss']
})
export class SecretQuestionDobComponent implements OnInit {

  secretQuestion: any;
  private items: any[] = [];
  verifyForm: FormGroup;
  currentDOB: any;
  secretQuestionKeys: any[] = [];
  secretQuestionOptions: any[] = [];

  @Output('secretQuestionDOBEmitter') secretQuestionDOBEmitter: EventEmitter<any> = new EventEmitter<any>();
  @Input('firstTimeUserDetails') firstTimeUserDetails;
  @Input('from') from;
  constructor(private fb: FormBuilder) {
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
    this.verifyForm.controls.secretQuestionOptions.setValue('');
    if (this.from === 'firstTime') {
      this.currentDOB = _.get(this.firstTimeUserDetails, 'redirectionData.dateOfBirth');
      let tempDate: number;
      let tempMonth: number;
      let tempYear: number;
      tempDate = this.currentDOB.substring(8, 10);
      tempMonth = this.currentDOB.substring(5, 7);
      tempYear = this.currentDOB.substring(0, 4);
      if (tempDate < 10) {
        tempDate = this.currentDOB.substring(9, 10);
      } else {
        tempDate = this.currentDOB.substring(8, 10);
      }
      if (tempMonth < 10) {
        tempMonth = this.currentDOB.substring(6, 7);
      } else {
        tempMonth = this.currentDOB.substring(5, 7);
      }
      this.verifyForm.controls.dateOfBirth.setValue(tempDate);
      this.verifyForm.controls.monthOfBirth.setValue(tempMonth);
      this.verifyForm.controls.yearOfBirth.setValue(tempYear);
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
  enableSecretQuestionsSubmit() {
    let flag = false;
    const secretAnswer = this.verifyForm.controls.secretAnswer.value;
    const secretQuestionsSelected = this.verifyForm.controls.secretQuestionOptions.value;
    if (secretQuestionsSelected && secretAnswer) {
      flag = true;
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
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    this.items = months;
  }
  generateYear() {
    this.items = [];
    const date: Date = new Date();
    const year: number = date.getFullYear();
    for (let i = year; i >= AppSettings.DOB_MIN_YEAR; i--) {
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
  }
}
