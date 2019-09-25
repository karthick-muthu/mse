import { Component, OnInit, OnDestroy, ContentChild, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../../../modules/auth/services/login/login.service';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../../../modules/auth/services/auth/auth.service';
import { LoginSettings } from '../../../../settings/login.settings';
import { PasswordShowHideDirective } from '../../../../shared/directives/password-show-hide/passwordShowHide.directive';
import { ErrorModalComponent } from '../../../../shared/components/errors/error-modal/error-modal.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ms-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit, OnDestroy {
  logoutOfOtherSessionsCalled: boolean;
  user_name: any;
  invalidUsernameCharacter: any;
  language: any;
  private apiSubscription: Subscription;
  apiData: string;
  apiName: string;
  passwordIncorrectMessage: string;
  textPassword: any;
  newPassword: string;
  selectedNewPassword: any;
  selectedCurrentPassword: any;
  passwordFormName: string;
  triesLeft: any;
  incorrectPassword: boolean;
  passwordType: any;
  incorrectUsername: boolean;
  isGrade4to6: boolean;
  userLogin = true;
  picturePasswordSection = false;
  textPasswordSection = false;
  isLoginBg;
  isParentLogin = false;
  isLogin = false;
  pictureSelected = true;
  passwordShow = false;
  onboardingModulesURl: any;


  /* form validation using validator */
  userLoginForm: FormGroup;
  userpassword: string;
  errorInfo: Response;
  loginUsernameDetails: any;
  passwordDetails: any;
  animals: any;
  foods: any;
  picturePassword: string;
  lockedAccountDetails: any;
  passwordToSet: string;
  incorrectUsernameMessage: string;
  username: string;
  passwordIndex = 0;
  private currentPicturePassword: string[];
  passwordToggleText: string;
  data: string;
  apiCall: string;
  @ViewChild(PasswordShowHideDirective) input: PasswordShowHideDirective;
  invalidUsernameCharacters: string;
  prefill: string;
  mode: string;
  apiCalledBlockFlag: boolean;


  
  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder, private router: Router, private loginService: LoginService, private authService: AuthService) {
    this.apiCalledBlockFlag = false;

    this.activatedRoute.queryParams.subscribe(params => {
      this.prefill=params['prefill'];
      this.mode=params['mode'];
    });

    this.userLoginForm = fb.group({
      'username': [null, [Validators.required, Validators.pattern(LoginSettings.USERNAME_REGEX)]],
      'userpassword': [null, [Validators.required, Validators.minLength(4), Validators.pattern(LoginSettings.PASSWORD_REGEX)]]
    });
    this.onboardingModulesURl = LoginSettings.ONBOARDING_MODULES;


    // this.apiSubscription = this.authService.getAPICall().subscribe(result => {
    //   if (result.apiName && result.data) {
    //     this.apiName = result.apiName;
    //     this.apiData = result.data;
    //     console.log("getAPICall");
    //     if (this.apiName === LoginSettings.LOGIN_VARIANTS[3]) {
    //       console.log("usernameCall");this.checkUsername(this.apiData);
    //     } else if (this.apiName === LoginSettings.LOGIN_VARIANTS[4]) {
    //       console.log("passwordCall");this.validatePasswordAPICall(this.apiData);
    //     }
    //   }
    // });

    this.authService.setReloadRestrict('login');
    this.authService.getRouteLang().subscribe(result => {
      this.language = result.routeLang;
    });
    this.authService.setPopState('login');
    this.authService.getAPICall().subscribe(result => {

        this.apiCall = result.apiName;
        this.data = result.data;
        //console.log("usernameCall");
    });
    this.logoutOfOtherSessionsCalled = false;
  }

  validateUsername(event) {
    const invalidUsernameCharactersMatcher = event.key.toString().match(LoginSettings.USERNAME_REGEX);
    const capitals = new RegExp(/[A-Z]/);

    const specialChars = new RegExp(/[^A-Za-z0-9@\_\-]+/);
    let helperKeys = '';
    if (invalidUsernameCharactersMatcher) {
      helperKeys = invalidUsernameCharactersMatcher.input.toLowerCase();
    }
    if (this.user_name !== null || helperKeys !== 'shift') {
      if (this.user_name.match(' ')) {
        this.invalidUsernameCharacter = 'Spaces';
      } else if (this.user_name.match(capitals)) {
        this.invalidUsernameCharacter = 'Capitals ';
      } else if (this.user_name.match(specialChars)) {
        const tempInput = this.user_name.match(specialChars)[0];
        const lastSpecailChar = tempInput.charAt(tempInput.length - 1);
        this.invalidUsernameCharacter = '" ' + lastSpecailChar + ' "';
      }
    }
    if (this.incorrectUsername) {
      if (this.userLoginForm.controls.username.value !== this.username) {
        this.incorrectUsername = false;
      }
    }
  }

  ngOnInit() {
    this.user_name = '';
    this.invalidUsernameCharacter = '';
    this.authService.setBeforeUnloadRestrict('blockReload');
    this.passwordToggleText = 'show';
    this.incorrectPassword = false;
    this.username = '';
    this.animals = _.values(LoginSettings.ANIMAL_PASSWORD);
    this.foods = _.values(LoginSettings.FOOD_PASSWORD);
    this.passwordToSet = 'a';
    this.passwordFormName = 'current';
    this.selectedCurrentPassword = {
      'a': '',
      'b': ''
    };
    this.selectedNewPassword = {
      'a': '',
      'b': ''
    };
    this.picturePassword = '';
    this.newPassword = '';
  }


  goToPasswordSection() {
    this.username = this.userLoginForm.controls.username.value;
    this.formUsernameDetailsObject(this.username);
  }

  formUsernameDetailsObject(username) {

    this.loginUsernameDetails = {
      username: this.username,
      mode: this.mode,
      prefill: this.prefill,
      browserInfo: {
        userAgent: window.navigator.userAgent,
        windowDimension: {
          width: window.screen.width,
          height: window.screen.height
        },
        viewPortSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        touchEnabled: false,
        OS: this.authService.getOS(),
        compatibilityCheck: {
          angularSupported: true,
          javascriptEnabled: true
        }
      },
      contentUrlAccess: true
    };
    this.checkUsername(this.loginUsernameDetails);

  }

  checkUsername(loginUsernameDetails) {

    this.authService.showLoader();
    this.authService.setUsername(this.username);
    this.authService.setAPICall('checkUsername', loginUsernameDetails);
    if(!this.apiCalledBlockFlag){
      this.apiCalledBlockFlag = true;
      this.loginService.checkUsername(loginUsernameDetails).subscribe(
        result => {
          this.apiCalledBlockFlag = false;
          this.manageUsernameResponse(result);
          this.authService.hideLoader();
        },
        responseError => {
          this.apiCalledBlockFlag = false;
          this.errorInfo = this.authService.errorHandler(responseError);
        }
      );
    }

  }
  showPicturePasswordSection() {
    this.picturePasswordSection = true;
    this.isLogin = true;
    this.isParentLogin = false;
    this.userLogin = false;
    this.isLoginBg = true;
    this.isLoginBg = true;
    this.isGrade4to6 = true;
  }
  showTextPasswordSection() {
    this.textPasswordSection = true;
    this.isLogin = true;
    this.isParentLogin = false;
    this.userLogin = false;
    this.isLoginBg = true;
    this.isLoginBg = true;
    this.isGrade4to6 = true;
  }

  goToUserLogin() {
    this.passwordToSet = 'a';
    this.isLogin = false;
    this.isParentLogin = false;
    this.userLogin = true;
    this.isLoginBg = false;
    this.isLoginBg = false;
    this.isGrade4to6 = false;
    this.textPasswordSection = false;
    this.picturePasswordSection = false;
    this.picturePassword = '';
    this.selectedCurrentPassword = {
      'a': '',
      'b': ''
    };
    this.textPassword = '';
    this.userLoginForm.controls.userpassword.reset();
    this.passwordIncorrectMessage = '';
    this.incorrectPassword = false;
    this.passwordToggleText = 'show';
  }

  checkActiveImage(index: number, type: string) {
    const password = (this.passwordFormName === 'current') ? this.selectedCurrentPassword : this.selectedNewPassword;
    if (password[type] === index.toString()) {
      return true;
    }
    return false;
  }

  selectedPassword(index: number, type: string) {
    this.incorrectPassword = false;
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
    const passwords = password.split('|');
    this.passwordToSet = (type === 'a' && passwords[1] === '') ? 'b' : 'c';
    this.setSelectedPassword(password, type, index);
  }

  setSelectedPassword(password: string, type: string, index: number) {
    if (this.passwordFormName === 'current') {
      this.picturePassword = password;
      this.selectedCurrentPassword[type] = index.toString();

    }
  }

  disableSubmit(type: string) {
    let flag = true;
    let password: any = (type === 'current') ? this.picturePassword : this.newPassword;
    password = password.split('|');
    if (password.length === 2 && password[0] !== '' && password[1] !== '') {
      flag = false;
    }
    if (this.incorrectPassword && (password[0] !== '' || password[1] !== '')) {
      flag = true;
    }
    return flag;
  }

  manageUsernameResponse(result) {

    const resultObject = result;
    this.passwordType = _.get(resultObject, 'userInformation.passwordType', '');
    this.incorrectUsername = false;
    const response = this.authService.validateResponse(result, {});

    if (response === 'success') {
      if (this.passwordType === LoginSettings.PASSWORD_TYPES[0]) {
        this.showTextPasswordSection();
      } else if (this.passwordType === LoginSettings.PASSWORD_TYPES[1]) {
        this.showPicturePasswordSection();
      } else {
        this.showTextPasswordSection();
      }
    } else if (response === 'username_not_found') {
      this.incorrectUsername = true;
      this.incorrectUsernameMessage = _.get(resultObject, 'resultMessage', '');

    } else if (response === 'session_already_exists') {
      this.logoutOfOtherSessionsCalled = true;
      this.logoutOfOtherSessions();
    } else if (response === 'redirect') {
      let url: string;
      const redirectionCode = _.get(result, 'redirectionCode', {}).toLowerCase();
      if (redirectionCode === LoginSettings.LOGIN_VARIANTS[1]) {
        const data = {
          username: _.get(result, 'redirectionData.username', '')
        };
        this.loginService.requestPasswordReset(data).subscribe(requestResult => {
          this.setUserRank(requestResult);
          url = this.language + '/waiting';
          this.router.navigate([url]);
        },
          responseError => {
            this.errorInfo = this.authService.errorHandler(responseError);

          });
      }
    } else if (response === 'page_redirect') {
      const url: string = _.get(result, 'redirectionData.url', null);
      window.location.href = url;
    }
  }

  private setUserRank(requestResult: any) {
    const userCategory = _.get(requestResult, 'userInformation.userCategory', '');
    const retailUser = _.get(requestResult, 'userInformation.retailUser', false);
    if (userCategory === 'teacher') {
      this.authService.setUsername(this.username, 'admin', retailUser);
    } else if (userCategory === 'student' && retailUser) {
      this.authService.setUsername(this.username, 'parent', retailUser);
    } else {
      this.authService.setUsername(this.username, 'teacher', retailUser);
    }
  }

  forgotPassword() {
    const data = {
      username: this.username
    };
    this.authService.showLoader();
    this.loginService.forgotPassword(data).subscribe(result => {
      this.authService.validateResponse(result, data);
      const redirectioncode = _.get(result, 'redirectionCode', '').toLowerCase();
      if (redirectioncode === 'showpasswordresetoptions') {
        const canResetYourself = _.get(result, 'resetYourself', undefined);
        const askSomeBody = _.get(result, 'askSomebody', undefined);

        this.authService.setResetYourselfStatusForForgotPasswordFlow(canResetYourself, askSomeBody);
      }
      this.authService.hideLoader();
    },
      responseError => {
        this.errorInfo = this.authService.errorHandler(responseError);
      });
  }

  submitPassword() {
    let tempPassword;
    if (this.passwordType === LoginSettings.PASSWORD_TYPES[1]) {
      tempPassword = this.picturePassword;
    } else {
      tempPassword = this.userLoginForm.controls.userpassword.value;
    }
    this.passwordDetails = {
      username: this.username,
      passwordType: this.passwordType,
      password: tempPassword
    };
    if(!this.apiCalledBlockFlag){
      this.apiCalledBlockFlag = true;
      this.authService.setAPICall('validatePassword', this.passwordDetails);
      this.validatePasswordAPICall(this.passwordDetails);
    }
  }

  validatePasswordAPICall(passwordDetails) {
    this.authService.showLoader();
    this.loginService.checkPassword(passwordDetails).subscribe(result => {
      {
        this.apiCalledBlockFlag = false;
        this.managePasswordResponse(result);
        this.authService.hideLoader();
      }
    },
      responseError => {
        this.apiCalledBlockFlag = false;
        this.errorInfo = this.authService.errorHandler(responseError);
      });
  }

  managePasswordResponse(result) {
    this.incorrectPassword = false;
    const resultObject = result;
    this.textPassword = this.userLoginForm.controls.userpassword.value;
    this.triesLeft = resultObject.triesLeft;
    const response = this.authService.validateResponse(result, {});
    if (response === 'success') {
      if (_.get(result, 'userInformation.passwordCheckStatus') === true) {
        this.authService.setBeforeUnloadRestrict('blockReload');
        this.loginService.getLandingPage(result);
      }
    } else if (response === 'password_mismatch') {
      this.incorrectPasswordHandler(resultObject);
    } else if (response === 'session_already_exists') {
      this.logoutOfOtherSessionsCalled = true;
      this.logoutOfOtherSessions();
    } else if (response === 'redirect') {
      let url: string;
      const redirectionCode = _.get(result, 'redirectionCode', {}).toLowerCase();
      if (redirectionCode === LoginSettings.LOGIN_VARIANTS[0]) {
        this.authService.setBeforeUnloadRestrict('blockReload');
        this.loginService.getLandingPage(null);
      } else if (redirectionCode === LoginSettings.LOGIN_VARIANTS[1]) {
        const data = {
          username: _.get(result, 'redirectionData.username', '')
        };
        this.loginService.requestPasswordReset(data).subscribe(requestResult => {
          this.setUserRank(requestResult);
          url = this.language + '/waiting';
          this.router.navigate([url]);
        },
          responseError => {
            this.errorInfo = this.authService.errorHandler(responseError);
          });
      }
    } else if (response === 'parent_restricted_page') {
      const data = _.get(result, 'redirectionData', null);
      if (data) {
        this.authService.setParentRestrictedPageData(data);
        this.authService.setErrorType('parentrestrictedpage');
        this.authService.open(ErrorModalComponent);
      }
    }
  }

  disablePasswordSubmit() {
    const passwordValue = this.userLoginForm.controls.userpassword.value;
    return this.userLoginForm.invalid;
  }

  logoutOfOtherSessions() {
    if (this.logoutOfOtherSessionsCalled) {
      const userDetails = {
        username: this.username
      };
      this.loginService.logoutAllSession(userDetails).subscribe(result => {
        if (this.authService.validateResponse(result, {}) === 'success') {
          const api = this.apiCall.toLowerCase();
          const data = this.data;
          this.authService.setAPICall(api, this.data);
        }
      });
      this.logoutOfOtherSessionsCalled = false;
    }
  }

  togglePasswordShow() {
    this.passwordShow = !this.passwordShow;
    if (this.passwordShow) {
      this.passwordToggleText = 'hide';
      this.input.changeType('text');
    } else {
      this.passwordToggleText = 'show';
      this.input.changeType('password');
    }
  }

  private incorrectPasswordHandler(resultObject: any) {
    this.triesLeft = _.get(resultObject, 'userInformation.triesLeft', false);
    this.setUserRank(resultObject);
    if (this.triesLeft <= 0) {
      const lang = (this.language) ? this.language : 'en';
      const url = lang + '/account-locked';
      this.router.navigate([url]);
    } else {
      this.userLoginForm.controls.userpassword.setValue('');
      this.passwordIncorrectMessage = resultObject.resultMessage;
      this.incorrectPassword = true;
    }
  }

  ngOnDestroy(): void {
    //this.apiSubscription.unsubscribe();
  }
}
