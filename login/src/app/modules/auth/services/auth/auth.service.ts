import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { LoginApiSettings } from '../../../../settings/login.api.settings';
import { environment } from '../../../../../environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router } from '@angular/router';
import { Title, DOCUMENT } from '@angular/platform-browser';
import { LoginSettings } from '../../../../settings/login.settings';
import { TranslateService } from 'ng2-translate';
import { NgbModalOptions, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Injectable()
export class AuthService {
    lang: any;
    closeResult: string;
    errorInfo: any;

    private baseURL: string;
    authResponse: any;
    firstTimeUserDetails: any;

    parentRestrictedPageData = new BehaviorSubject({ data: null });
    productListBS = new BehaviorSubject({ productList: null, firstName: null });
    passwordTypeBS = new BehaviorSubject({ type: null });
    usernameBehaviorSubject = new BehaviorSubject({ username: 'Student', category: 'teacher', retailUser: false });
    secretQuestionsBehaviorSubject = new BehaviorSubject({ secretQuestion: [''] });
    setAPICallBS = new BehaviorSubject({ apiName: '', data: '' });
    templateBS = new BehaviorSubject({ template: '1' });
    loaderBS = new BehaviorSubject({ loader: false });
    jwtBS = new BehaviorSubject({ jwt: null });
    errorBS = new BehaviorSubject({ errorType: null });
    textPasswordBS = new BehaviorSubject({ password: null });
    stopReloadBS = new BehaviorSubject({ page: null });
    popState = new BehaviorSubject({ popState: null });
    routeLangParam = new BehaviorSubject({ routeLang: null });
    beforeUnloadRestrict = new BehaviorSubject({ state: null });
    compatibleBrowserBS = new BehaviorSubject({
        cookies: null, localStorage: null, sessionStorage: null,
        dragDrop: null, firewall: null, compatible: null
    });

    resetYourselfStatusBS = new BehaviorSubject({
        resetYourself: undefined,
        askSomeBody: undefined
    });
    hasSameUsernameAndPasswordBS = new BehaviorSubject({
        hasSameUsernameAndPassword: false
    });
    constructor(private router: Router, @Inject(DOCUMENT) private document: Document, private titleService: Title,
        private modalService: NgbModal, private translate: TranslateService) {
        this.baseURL = environment.apiBaseURL;
        this.getRouteLang().subscribe(result => {
            this.lang = result.routeLang;
        });
    }
    getOS() {
        const userAgent = window.navigator.userAgent;
        const platform = window.navigator.platform;
        const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
        const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
        const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
        let os = null;
        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }
        return os;
    }
    showLoader() {
        this.setLoader(true);
    }
    hideLoader() {
        setTimeout(() => this.setLoader(false), 1000);
    }
    setLoader(show: boolean) {
        this.loaderBS.next({ loader: show });
    }
    getLoader(): Observable<any> {
        return this.loaderBS.asObservable();
    }
    setPasswordType(type) {
        this.passwordTypeBS.next({
            type: type
        });
    }
    getPasswordType(): Observable<any> {
        return this.passwordTypeBS.asObservable();
    }

    setProductList(productList, firstName) {
        this.productListBS.next({
            productList: productList,
            firstName: firstName
        });
    }
    getProductList() {
        return this.productListBS.asObservable();
    }
    setAPICall(apiName, data) {
        this.setAPICallBS.next({
            apiName: apiName,
            data: data
        });
    }
    getAPICall() {
        return this.setAPICallBS.asObservable();
    }
    setUsername(username: any, category?: any, retailUser?: any) {
        this.usernameBehaviorSubject.next({
            username: username,
            category: category,
            retailUser: retailUser
        });
    }
    getUsername(): Observable<any> {
        return this.usernameBehaviorSubject.asObservable();
    }


    setFirstTimeUserDetails(details) {
        this.firstTimeUserDetails = details;
    }
    getFirstTimeUserDetails() {
        return this.firstTimeUserDetails;
    }


    setParentRestrictedPageData(data) {
        this.parentRestrictedPageData.next({
            data: data
        });
    }

    getParentRestrictedPageData(): Observable<any> {
        return this.parentRestrictedPageData.asObservable();
    }

    setSecretQuestion(questions) {
        this.secretQuestionsBehaviorSubject.next({
            secretQuestion: questions
        });
    }
    getSecretQuestion(): Observable<any> {
        return this.secretQuestionsBehaviorSubject.asObservable();
    }
    setTemplate(result, type?: string, reset?: boolean) {
        let templateId = null;
        reset = (!reset) ? false : reset;
        if (!reset) {
            type = (type) ? type : '';
            let selectedTheme = '';
            if (type === 'login') {
                selectedTheme = _.get(result, 'selectedTheme', 'lowergrade').toLowerCase();
            } else {
                selectedTheme = _.get(result, 'userInformation.selectedTheme', 'lowergrade').toLowerCase();
            }
            templateId = _.get(LoginSettings, 'GRADES_FOR_THEME.' + selectedTheme, '1');
            localStorage.setItem('template', templateId);
        } else {
            localStorage.removeItem('template');
        }
        this.templateBS.next({
            template: templateId
        });
    }
    getTemplate(): Observable<any> {
        return this.templateBS.asObservable();
    }
    getTemplateId(result) {
        return _.get(result, 'template', '1');
    }
    setSiteTitle(pageName) {
        this.titleService.setTitle(LoginSettings.SITE_NAME + ' | ' + pageName);
    }
    setTextPassword(password) {
        this.textPasswordBS.next({
            password: password
        });
    }
    getTextPassword(): Observable<any> {
        return this.textPasswordBS.asObservable();
    }
    setErrorType(error) {
        this.errorBS.next({
            errorType: error
        });
    }
    getErrorType(): Observable<any> {
        return this.errorBS.asObservable();
    }
    setReloadRestrict(page) {
        this.stopReloadBS.next({
            page: page
        });
    }
    getReloadRestrict() {
        return this.stopReloadBS.asObservable();
    }
    setPopState(page) {
        this.popState.next({
            popState: page
        });
    }
    getPopState() {
        return this.popState.asObservable();
    }

    setResetYourselfStatusForForgotPasswordFlow(permisson, askSomeBody) {
        this.resetYourselfStatusBS.next({
            resetYourself: permisson,
            askSomeBody: askSomeBody
        });
    }

    getResetYourselfStatusForForgotPasswordFlow(): Observable<any> {
        return this.resetYourselfStatusBS.asObservable();
    }
    setRouterDetails(property: any) {
        this.compatibleBrowserBS.next({
            cookies: _.get(property, 'cookies', false),
            localStorage: _.get(property, 'localStorage', false),
            sessionStorage: _.get(property, 'sessionStorage', false),
            dragDrop: _.get(property, 'dragDrop', false),
            firewall: _.get(property, 'firewall', false),
            compatible: _.get(property, 'compatible', false)
        });
    }
    getRouterDetails(): Observable<any> {
        return this.compatibleBrowserBS.asObservable();
    }

    togglePasswordShow(passwordShow, from) {
        let passwordToggleText;
        if (passwordShow) {
            passwordToggleText = 'hide';
            if (from === 'password') {
                document.getElementById('password').setAttribute('type', 'text');
            } else {
                document.getElementById('confirmPassword').setAttribute('type', 'text');
            }
        } else {
            passwordToggleText = 'show';
            if (from === 'password') {
                document.getElementById('password').setAttribute('type', 'password');
            } else {
                document.getElementById('confirmPassword').setAttribute('type', 'password');
            }
        }
        return passwordToggleText;
    }

    open(modalName) {
        const modalCount = _.get(this.modalService, '_modalStack._applicationRef.viewCount', 1);
        if (modalCount > 1) {
            const closeButton = (<HTMLElement>document.getElementsByClassName('fa-times')[0]);
            if (closeButton) {
                closeButton.click();
            }
        }
        const ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false
        };
        this.modalService.open(modalName, ngbModalOptions).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
    checkZeroPadding(number) {
        if (number < 10) {
            number = number.toString().substring(1);
        }
        return number;
    }
    validateResponse(response: any, request: any) {
        const resultCode = _.get(response, 'resultCode', '').toLowerCase();
        let status = 'false';
        switch (resultCode) {
            case 'c001': status = 'success';
                break;
            case 'c002': status = 'unknown';
                break;
            case 'c004': status = 'redirect';
                this.redirectToLocation(response, request);
                break;
            case 'cl001': status = 'password_mismatch';
                break;
            case 'cl002': status = 'username_not_found';
                break;
            case 'cl010': status = 'session_creation_failed';
                break;
            case 'cl011': status = 'no_product_access';
                break;
            case 'cl018': status = 'details_mismatch';
                break;
            case 'cl019': status = 'session_already_exists';
                break;
            case 'c007': status = 'upload_failure';
                break;
            case 'cl020': status = 'same_username_password';
                break;
            case 'c010': status = 'parent_restricted_page';
                break;
            case 'c011': status = 'page_redirect';
                break;
        }
        return status;
    }
    private redirectToLocation(response, request) {
        const redirectionCode = _.get(response, 'redirectionCode', '').toLowerCase();
        let url: string = _.get(LoginSettings, 'REDIRECT_CODE[' + redirectionCode + ']', '');
        switch (redirectionCode) {
            case 'newlogin':
                url = this.newLoginRedirect(response, url);
                break;
            case 'requestpasswordreset':
                url = '';
                break;
            case 'setnewpassword':
                if (_.get(response, 'redirectionData.username')) {
                    url = this.setNewPassword(response, url);
                } else {
                    return;
                }
                break;
            case 'getlandingpage':
                url = '';
                break;
            case 'showpasswordresetoptions':
                url = this.showPasswordResetOptions(response, url);
                break;
            case 'accountlocked':
                url = this.accountLocked(response, url);
                break;
            case 'waitforpassword':
                url = this.waitForPassword(response, url);
                break;
            case 'setpasswordafterreset':
                url = this.setNewPassword(response, url);
                break;
            case 'productselectionpage':
                url = this.productselectionpage(response, url);
                break;
            case 'subscriptionended':
                url = 'error/subscriptionexpired';
                break;
            default:
                break;
        }
        if (url !== '') {
            url = this.lang + '/' + url;
            this.router.navigate([url]);

        }
    }
    private newLoginRedirect(response, url) {
        if (_.get(response, 'redirectionData.newPasswordType') === LoginSettings.PASSWORD_TYPES[0]) {
            this.setPasswordType('text');
        } else if (_.get(response, 'redirectionData.newPasswordType') === LoginSettings.PASSWORD_TYPES[1]) {
            this.setPasswordType('picture');
        }
        this.setFirstTimeUserDetails(response);
        url = 'first-time-login';
        return url;
    }

    private setNewPassword(response, url) {
        if (_.get(response, 'redirectionData.newPasswordType') === LoginSettings.PASSWORD_TYPES[0]) {
            this.setPasswordType('text');
        } else if (_.get(response, 'redirectionData.newPasswordType') === LoginSettings.PASSWORD_TYPES[1]) {
            this.setPasswordType('picture');
        }
        url = 'reset-password';
        return url;
    }

    private productselectionpage(response, url) {
        const productList = _.get(response, 'redirectionData.productList', []);
        const firstName = _.get(response, 'redirectionData.firstName', '');
        this.setProductList(productList, firstName);
        url = 'product-selection';
        return url;
    }

    private showPasswordResetOptions(response, url) {
        const username = _.get(response, 'redirectionData.username');
        const category = _.get(response, 'redirectionData.userCategory');
        const retailUser = _.get(response, 'redirectionData.retailUser');
        const secretQuestions = _.toArray(_.get(response, 'redirectionData.secretQuestions'));
        this.setSecretQuestion(secretQuestions);
        if (category === 'teacher') {
            this.setUsername(username, 'admin', retailUser);
        } else if (category === 'student' && retailUser) {
            this.setUsername(username, 'parent', retailUser);
        } else {
            this.setUsername(username, 'teacher', retailUser);
        }
        url = 'forgot-password';
        return url;
    }
    private accountLocked(response, url) {
        url = 'account-locked';
        const username = _.get(response, 'redirectionData.username');
        const category = _.get(response, 'redirectionData.userCategory');
        const retailUser = _.get(response, 'redirectionData.retailUser');

        if (category === 'teacher') {
            this.setUsername(username, 'admin', retailUser);
        } else if (category === 'student' && retailUser) {
            this.setUsername(username, 'parent', retailUser);
        } else {
            this.setUsername(username, 'teacher', retailUser);
        }
        return url;
    }
    private waitForPassword(response, url) {
        const username = _.get(response, 'redirectionData.username');
        const category = _.get(response, 'redirectionData.userCategory');
        const retailUser = _.get(response, 'userInformation.retailUser');
        if (category === 'teacher') {
            this.setUsername(username, 'admin', retailUser);
        } else if (category === 'student' && retailUser) {
            this.setUsername(username, 'parent', retailUser);
        } else {
            this.setUsername(username, 'teacher', retailUser);
        }
        url = this.lang + '/waiting';
        return url;
    }
    padPrefix(value: any, length: number, prefix: string) {
        value = value.toString();
        if (value.length < length) {
            const diff = length - value.length;
            for (let index = 0; index < diff; index++) {
                value = prefix + value;
            }
        }
        return value;
    }
    setBodyClass(clear?: any, extraClass?: string[]) {
        clear = (clear === 'clear') ? true : false;
        const classList: any = Object.assign({}, document.body.classList);
        delete classList['value'];
        _.forEach(classList, function (value, key) {
            if (_.indexOf(['desktop-view', 'mobile-view'], value) === -1) {
                document.body.classList.remove(value);
            }
        });
        if (!clear) {
            const templateClass = this.getClassName();
            document.body.classList.add(templateClass);
            _.forEach(extraClass, function (value, key) {
                document.body.classList.add(value);
            });
        }
    }
    getClassName() {
        let template = localStorage.getItem('template');
        if (_.isEmpty(template)) {
            template = '1';
        }
        return 'template' + template;
    }
    errorHandler(response: Response) {
        this.hideLoader();
        switch (response.status) {
            case 400:
                break;
            case 401:
                const url = this.lang + '/' + 'error/unauthorized';
                this.router.navigate([url]);
                break;
        }
        return response;
    }
    setJWT(response: any, reset?: boolean) {
        const jwtValue = (!reset) ? response.headers.get('jwt') : null;
        this.jwtBS.next({
            jwt: jwtValue
        });
    }
    getJWT(): Observable<any> {
        return this.jwtBS.asObservable();
    }

    changeLanguageRoute(language) {
        this.translate.use(language);
    }
    setRouteLang(lang) {
        this.routeLangParam.next({
            routeLang: lang
        });
    }

    getRouteLang(): Observable<any> {
        return this.routeLangParam.asObservable();
    }
    setBeforeUnloadRestrict(state) {
        this.beforeUnloadRestrict.next({
            state: state
        });
    }
    getBeforeUnloadRestrict(): Observable<any> {
        return this.beforeUnloadRestrict.asObservable();
    }
    setTeacherHasSameUsernameAndPassword(status) {
        this.hasSameUsernameAndPasswordBS.next({
            hasSameUsernameAndPassword: status
        });
    }

    getTeacherHasSameUsernameAndPassword(): Observable<any> {
        return this.hasSameUsernameAndPasswordBS.asObservable();
    }
    changeLanguage(result: any, from?: string) {
        let lang: any;
        from = (!from) ? '' : from;
        switch (from) {
            case '':
                lang = _.get(result, 'userInformation.language', '');
                break;
            case 'login':
                lang = _.get(result, 'redirectionData.language', '');
                break;
        }
        if (lang === '') {
            lang = this.lang;
        }
        lang = lang.split('-')[0];
        this.setRouteLang(lang);
        this.translate.use(lang);
    }
    clearSharedServiceBS() {
        this.setPasswordType(null);
        this.setUsername(null, null, null);
        this.setSecretQuestion([]);
        this.setTemplate(null);
        this.setLoader(null);
    }
}

