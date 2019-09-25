import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidators } from '../../../../shared/validators/password/password.validator';
import * as _ from 'lodash';
import { LoginService } from '../../services/login/login.service';
import { DOBValidator } from '../../../../shared/validators/dob/dob.validator';
import { AuthService } from '../../services/auth/auth.service';
import { LoginSettings } from '../../../../settings/login.settings';
import { ErrorModalComponent } from '../../../../shared/components/errors/error-modal/error-modal.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ms-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],

})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  teacherHasSameUsernameAndPassword: boolean;
  askSomeBody: any;
  canResetYourself: any;
  data: string;
  apiCall: string;
  logoutOfOtherSessionsCalled: boolean;
  confirmPasswordShow: boolean;
  passwordShow: boolean;
  confirmPasswordToggleText: string;
  topTitleHeaderGreat: string;
  topTitleHeaderRemember: string;
  language: any;
  page: any;
  apiSubscription: Subscription;
  apiData: string;
  apiName: string;
  passwordType: string;
  doneProcess: boolean;
  newPasswordA: string;
  newPasswordB: string;
  errorInfo: any;
  passwordFormName: string;
  passwordToSet: string;
  picturePasswordSection: boolean;
  topTitleHeader: string;
  titleDescription: string;
  textPasswordSection: boolean;
  showprogressForm: boolean;
  detailsSection: boolean;
  finishedProcess: boolean;
  passwordSection: boolean;
  secretQuestionSection: boolean;
  mainStepCt: boolean;
  AskTeaherCt: boolean;
  isActiveOne: boolean;
  isActiveTwo: boolean;
  isActiveThree: boolean;
  isSuccessOne: boolean;
  isSuccessTwo: boolean;
  isSuccessThree: boolean;
  private items: any[] = [];
  secretQuestionOptions: any[] = [];
  secretQuestionKeys: any[] = [];
  landingPage: string;
  secretQuestion: string;
  passwordForm: FormGroup;
  verifyForm: FormGroup;
  animals: any;
  foods: any;
  picturePassword: string;
  newPassword: string;
  selectedCurrentPassword: any;
  selectedNewPassword: any;
  animalPassword: any;
  foodPassword: any;
  active: boolean[] = [];
  success: boolean[] = [];
  category: string;
  username: string;
  incorrectDetails: boolean;
  detailsMismatch: boolean;
  finalPassword: string;
  showArrow: boolean;
  passwordToggleText: string;
  apiCalledBlockFlag: boolean;
  constructor(private router: Router, private fb: FormBuilder, private service: LoginService, private authService: AuthService,
    private activatedRoute: ActivatedRoute) {
    this.authService.setSiteTitle('Forgot Password');
    this.passwordForm = fb.group({
      'password': [null, [Validators.required, Validators.minLength(4), Validators.pattern(LoginSettings.PASSWORD_REGEX)]],
      'confirmPassword': [{ value: null, disabled: true }, Validators.required]
    }, {
        validator: PasswordValidators.matchPassword
      });
    this.verifyForm = fb.group({
      'secretAnswer': [null, Validators.required],
      'secretQuestionOptions': [null, Validators.required],
      'dateOfBirth': ['', Validators.required],
      'monthOfBirth': ['', Validators.required]
    }, {
        validator: DOBValidator.checkDateMonth
      });
    // this.apiSubscription = this.authService.getAPICall().subscribe(result => {
    //   if (result.apiName && result.data) {
    //     this.apiName = result.apiName;
    //     this.apiData = result.data;
    //     if (this.apiName === LoginSettings.LOGIN_VARIANTS[2]) {
    //       this.validateUserDetailsforPasswordReset(this.apiData);
    //     }
    //   }
    // });
    this.teacherHasSameUsernameAndPassword = false;
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
    this.authService.getAPICall().subscribe(result => {
      this.apiCall = result.apiName,
        this.data = result.data;
    });
    this.logoutOfOtherSessionsCalled = false;

    this.authService.getResetYourselfStatusForForgotPasswordFlow().subscribe(result => {
      this.canResetYourself = (result.resetYourself === undefined) ? undefined : result.resetYourself;
      this.askSomeBody = (result.askSomeBody === undefined) ? undefined : result.askSomeBody;
    });
  }

  ngOnInit() {
    this.passwordToggleText = 'show';
    this.confirmPasswordToggleText = 'show';
    this.showArrow = true;
    this.finalPassword = '';
    this.mainStepCt = true;
    this.AskTeaherCt = false;
    this.animals = _.values(LoginSettings.ANIMAL_PASSWORD);
    this.foods = _.values(LoginSettings.FOOD_PASSWORD);
    this.foodPassword = LoginSettings.FOOD_PASSWORD;
    this.animalPassword = LoginSettings.ANIMAL_PASSWORD;
    this.showprogressForm = false;
    this.initializeData();
    this.passwordSection = false;
    this.detailsSection = false;
    this.finishedProcess = false;
    this.picturePassword = '';
    this.newPassword = '';
    this.passwordToSet = 'a';
    this.passwordFormName = 'current';
    this.selectedCurrentPassword = {
      'a': '',
      'b': ''
    };
    this.authService.getUsername().subscribe(result => {
      this.username = result.username;
    });
    for (let i = 0; i < 3; i++) {
      this.active[i] = false;
      this.success[i] = false;
    }
    this.authService.getUsername().subscribe(
      result => {
        this.username = result.username;
        this.category = result.category;
      },
      responseError => {
        this.errorInfo = this.authService.errorHandler(responseError);
      });
    this.incorrectDetails = false;
    this.detailsMismatch = false;
    this.authService.getAPICall().subscribe(result => {
      this.apiName = result.apiName;
      this.apiData = result.data;
    });
  }

  initializeData() {
    this.isActiveOne = true;
    this.isActiveTwo = false;
    this.isActiveThree = false;
    this.isSuccessOne = false;
    this.isSuccessTwo = false;
    this.isSuccessThree = false;
    this.topTitleHeader = 'hello there forgot your password';
    this.titleDescription = 'no problem select any of the options';
  }

  navigateToSecretQsForm() {
    this.topTitleHeader = 'reset password';
    this.titleDescription = 'click next to start your lessons';
    this.isActiveOne = false;
    this.isSuccessOne = true;
    this.isActiveTwo = true;
    this.isSuccessTwo = false;
    this.mainStepCt = false;
    this.AskTeaherCt = false;
    this.showprogressForm = true;
    this.secretQuestionSection = true;
    this.authService.getSecretQuestion().subscribe(result => {
      // this.secretQuestionOptions = result.secretQuestion;
      this.secretQuestionOptions = [];
      this.secretQuestionKeys = [];
      result.secretQuestion.forEach(element => {
        this.secretQuestionOptions.push(element);
        this.secretQuestionKeys.push(element);
      });
      this.verifyForm.controls.secretQuestionOptions.setValue('');
    });
  }

  goToLogin() {
    this.authService.setBeforeUnloadRestrict('blockReload');
    this.service.getLandingPage(null);
  }
  goBack() {
    if (this.isActiveOne) {
      this.router.navigate(['/']);
    } else if (this.isActiveTwo) {
      this.initializeData();
      this.showprogressForm = false;
      this.mainStepCt = true;
      this.incorrectDetails = false;
      this.detailsMismatch = false;
    } else if (this.isActiveThree) {
      this.logoutOfOtherSessionsCalled = true;
      this.logoutOfOtherSessions();
      this.isActiveThree = false;
      this.isActiveTwo = true;
      this.isSuccessTwo = false;
      this.showprogressForm = true;
      this.passwordSection = false;
      this.picturePasswordSection = false;
      this.secretQuestionSection = true;
    }
  }
  createDateRange(type: string) {
    switch (type) {
      case 'date':
        this.generateDate();
        break;
      case 'month':
        this.generateMonth();
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

  moveToNextStep() {
    this.isSuccessTwo = true;
    this.isActiveTwo = false;
    this.isActiveThree = true;
    this.showprogressForm = true;
    this.passwordSection = true;
    this.secretQuestionSection = false;
  }
  submitPassword() {

    this.finalPassword = this.passwordForm.controls['password'].value;
    this.passwordType = 'text';
    if (this.finalPassword) {
      this.updatePasswordData();
    }
  }
  enableSecretQuestionsSubmit() {
    return this.verifyForm.valid;
  }
  submitSecretQuestions() {
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    let date = this.verifyForm.controls['dateOfBirth'].value;
    let month = this.verifyForm.controls['monthOfBirth'].value;
    date = this.authService.padPrefix(date, 2, '0');
    month = this.authService.padPrefix(month, 2, '0');
    const detailsForValidation = {
      username: this.username,
      secretQuestionSelected: this.secretQuestion,
      secretAnswer: this.verifyForm.controls['secretAnswer'].value.toLowerCase(),
      dateOfBirth: month + '-' + date
    };
    if (!this.apiCalledBlockFlag) {
      this.apiCalledBlockFlag = true;
      this.validateUserDetailsforPasswordReset(detailsForValidation);
    }
  }
  validateUserDetailsforPasswordReset(detailsForValidation) {
    this.authService.showLoader();
    this.authService.setAPICall('validateUserDetailsforPasswordReset', detailsForValidation);
    this.service.validateUserDetailsforPasswordReset(detailsForValidation).subscribe(result => {
      this.apiCalledBlockFlag = false;
      this.manageDecider(result);
      this.authService.hideLoader();
    }, responseError => {
      this.apiCalledBlockFlag = false;
      this.errorInfo = this.authService.errorHandler(responseError);
    });
  }

  manageDecider(response) {
    this.detailsMismatch = false;
    const validateResponse = this.authService.validateResponse(response, {});
    let responseRedirectionCode = '';
    if (response.redirectionCode) {
      responseRedirectionCode = _.get(response, 'redirectionCode').toString().toLowerCase();
    }
    if (validateResponse === 'password_mismatch') {
      const triesLeft = _.get(response, 'userInformation.triesLeft');
      if (triesLeft <= 1) {
        this.incorrectDetails = true;
      } else {
        this.router.navigate(['account-locked']);
      }
    } else if (validateResponse === 'redirect') {
      if (responseRedirectionCode === 'setnewpassword') {
        this.isSuccessTwo = true;
        this.isActiveThree = true;
        this.isActiveTwo = false;
        this.showprogressForm = true;
        this.passwordSection = true;
        this.secretQuestionSection = false;
        this.passwordType = _.get(response, 'redirectionData.newPasswordType').toString();
        this.authService.setPasswordType(this.passwordType);
        if (this.passwordType === LoginSettings.PASSWORD_TYPES[0]) {
          this.textPasswordSection = true;
          this.picturePasswordSection = false;
          this.secretQuestionSection = false;
          this.passwordType = LoginSettings.PASSWORD_TYPES[0];
        } else {
          this.textPasswordSection = false;
          this.picturePasswordSection = true;
          this.secretQuestionSection = false;
        }
      } else if (responseRedirectionCode === 'requestpasswordreset') {
        let data: any = '';
        this.authService.getUsername().subscribe(result => {
          data = {
            username: result.username
          };
        });
        this.service.requestPasswordReset(data).subscribe(requestPasswordResetResult => {
          const userCategory = _.get(requestPasswordResetResult, 'userInformation.userCategory');
          const username = _.get(requestPasswordResetResult, 'userInformation.username');
          const retailUser = _.get(requestPasswordResetResult, 'userInformation.retailUser');

          if (response === 'success') {
            if (userCategory === 'teacher') {
              this.authService.setUsername(username, 'admin', retailUser);
            } else if (userCategory === 'student' && retailUser) {
              this.authService.setUsername(username, 'parent', retailUser);
            } else {
              this.authService.setUsername(username, 'teacher', retailUser);
            }
          }

          this.authService.hideLoader();
        },
          responseError => {
            this.errorInfo = this.authService.errorHandler(responseError);
          });
        this.router.navigate(['waiting']);
      }
    } else if (validateResponse === 'details_mismatch') {
      this.detailsMismatch = true;
    } else if (validateResponse === 'session_already_exists') {
      this.logoutOfOtherSessionsCalled = true;
      this.logoutOfOtherSessions();
    } else {
    }
  }
  selectQuestionOption(event) {
    let secretQ;
    secretQ = event.target.value;
    this.secretQuestion = secretQ;
  }

  logoutOfOtherSessions() {
    if (this.logoutOfOtherSessionsCalled) {
      const userDetails = {
        username: this.username
      };
      this.service.logoutAllSession(userDetails).subscribe(result => {
        if (this.authService.validateResponse(result, {}) === 'success') {
          const api = this.apiCall.toLowerCase();

          const data = this.data;
          this.authService.setAPICall(api, this.data);
        }
      });
      this.logoutOfOtherSessionsCalled = false;
    }
  }

  picturePasswordEmitter(event) {
    this.titleDescription = '';
    this.topTitleHeaderGreat = 'great';
    this.topTitleHeaderRemember = 'remember your picture password';
    this.topTitleHeader = '';
    this.finalPassword = event.password;
    const password = event.indeces;
    this.newPasswordA = 'img' + (parseInt(password.a, 10) + 1);
    this.newPasswordB = 'img' + (parseInt(password.b, 10) + 1);
    this.updatePasswordData();
  }
  updatePasswordData() {
    const data = {
      'newPasswordType': this.passwordType,
      'newPassword': this.finalPassword,
      'username': this.username
    };
    this.authService.showLoader();
    this.service.setPasswordAfterReset(data).subscribe(
      setPasswordResult => {
        const resultObject = setPasswordResult;
        const response = this.authService.validateResponse(setPasswordResult, {});
        if (response === 'same_username_password') {
          this.teacherHasSameUsernameAndPassword = true;
        } else if (response === 'success') {
          this.showArrow = false;
          this.isActiveThree = false;
          this.isSuccessThree = true;
          if (this.passwordType === 'text') {
            this.textPasswordSection = false;
            this.doneProcess = true;
            this.finishedProcess = false;
          } else if (this.passwordType === 'picture') {
            this.picturePasswordSection = false;
            this.finishedProcess = true;
          }
        }
        this.authService.hideLoader();
      },
      responseError => {
        this.errorInfo = this.authService.errorHandler(responseError);
      }
    );
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
  togglePasswordShow() {
    this.passwordShow = !this.passwordShow;
    this.passwordToggleText = this.authService.togglePasswordShow(this.passwordShow, 'password');
  }

  toggleConfirmPasswordShow() {
    this.confirmPasswordShow = !this.confirmPasswordShow;
    this.confirmPasswordToggleText = this.authService.togglePasswordShow(this.confirmPasswordShow, 'confirmpassword');
  }
  ngOnDestroy(): void {
    //this.apiSubscription.unsubscribe();
  }
}
