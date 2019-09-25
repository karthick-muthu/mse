import { Injectable, Inject } from '@angular/core';
import { Title, DOCUMENT } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AppSettings } from '../settings/app.settings';
import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie';
import { environment } from '../../environments/environment';

@Injectable()
export class SharedService {
    userInformation: any;
    loaderBS = new BehaviorSubject({ loader: false });
    jwtBS = new BehaviorSubject({ jwt: null });
    stopReloadBS = new BehaviorSubject({ page: null });
    topicIdBS = new BehaviorSubject({ topicId: null });
    topicTrailDataBS = new BehaviorSubject({ startFrom: 0, limit: 0, topicId: null, index: 0 });
    trailFromBS = new BehaviorSubject({ from: null });
    worksheerReportDataBS = new BehaviorSubject({
        startFrom: 0,
        limit: 0,
        worksheetID: null,
        index: 0
    });
    closeResult: string;
    navType: string;

    constructor(private titleService: Title, @Inject(DOCUMENT) private document: Document, private modalService: NgbModal,
        private translate: TranslateService, private router: Router, private _cookieService: CookieService) {
    }

    /* DOM Services Starts */
    setSiteTitle(pageName) {
        this.titleService.setTitle(AppSettings.SITE_NAME + ' | ' + pageName);
    }

    getClassName() {
        const template = localStorage.getItem('template');
        return (template === '' || template === null || template === undefined) ? '' : 'template' + template;
    }
    setBodyClass(clear?: any, extraClass?: string[]) {
        clear = (clear === 'clear') ? true : false;
        const classList: any = Object.assign({}, document.body.classList);
        delete classList['value'];
        _.forEach(classList, function (value, key) {
            if (_.indexOf(['desktop-view', 'mobile-view'], value) === -1 && value.indexOf('-lang') === -1) {
                document.body.classList.remove(value);
            }
        });
        if (!clear) {
            const templateClass = this.getClassName();
            if (templateClass !== '') {
                document.body.classList.add(templateClass);
                _.forEach(extraClass, function (value, key) {
                    document.body.classList.add(value);
                });
            }
        }
    }
    setBodyLanguageClass(lang) {
        const classList: any = Object.assign({}, document.body.classList);
        _.forEach(classList, function (className, key) {
            if (className.indexOf('-lang') > -1) {
                document.body.classList.remove(className);
            }
        });
        document.body.classList.add(lang + '-lang');
    }

    changeLanguage(result: any, from?: string) {
        let lang: string;
        from = (!from) ? '' : from;
        switch (from) {
            case '':
                lang = _.get(result, 'userInformation.language', '').toLowerCase();
                break;
            case 'login':
                lang = _.get(result, 'redirectionData.language', '').toLowerCase();
                break;
        }
        this.useLanguage(lang);
    }

    useLanguage(lang: string) {
        if (lang !== '' && lang !== null && lang !== undefined) {
            lang = lang.split('-')[0];
            this.setBodyLanguageClass(lang);
            this.translate.use(lang);
        }
    }

    translateMessage(message): Observable<any> {
        if (message !== ('' && null && undefined)) {
            return this.translate.get(message, {}).map(res => res);
        } else {
            return Observable.empty<Response>();
        }
    }

    getTranslatedText(keys: any, lang: string): Promise<any> {
        let result, tempThis;
        result = {};
        this.useLanguage(lang);
        tempThis = this;
        _.forEach(keys, function (value: string, key: string) {
            tempThis.translateMessage(key).subscribe(res => {
                result[value] = res;
            });
        });
        this.useLanguage(this.translate.getDefaultLang());
        return Promise.resolve(result);
    }

    showLoader() {
        this.setLoader(true);
    }
    hideLoader() {
        setTimeout(() => this.setLoader(false), 500);
    }
    setLoader(show: boolean) {
        this.loaderBS.next({ loader: show });
    }
    getLoader(): Observable<any> {
        return this.loaderBS.asObservable();
    }
    handleUnexpectedResponse(status: string, goTo?: string) {
        if (status.toLowerCase() === 'unexpected') {
            if (typeof (goTo) !== 'undefined' && goTo !== '') {
                this.showLoader();
                setTimeout(() => {
                    this.router.navigate([AppSettings.REDIRECT_CODE[goTo]]);
                }, 5000);
            } else {
                this.hideLoader();
            }
        }
    }

    setReloadRestrict(page) {
        this.stopReloadBS.next({
            page: page
        });
    }
    getReloadRestrict() {
        return this.stopReloadBS.asObservable();
    }

    setTopicTrailData(topicTrailData) {
        this.topicTrailDataBS.next({
            startFrom: topicTrailData.startFrom,
            limit: topicTrailData.limit,
            topicId: topicTrailData.topicId,
            index: topicTrailData.index
        });
    }
    getTopicTrailData(): Observable<any> {
        return this.topicTrailDataBS.asObservable();
    }
    setTopicId(data) {
        this.topicIdBS.next({
            topicId: data.topicId
        });
    }
    getTopicId(): Observable<any> {
        return this.topicIdBS.asObservable();
    }

    setTrailFrom(from) {
        this.trailFromBS.next({
            from: from
        });
    }
    getTrailFrom(): Observable<any> {
        return this.trailFromBS.asObservable();
    }

    reformQuestionString(trailList) {
        const reformedList = [];
        for (let i = 0; i < trailList.length; i++) {
            reformedList.push(this.reformDisplayContent(trailList[i]));
        }
        return reformedList;
    }
    setWorksheetReportData(data) {
        this.worksheerReportDataBS.next({
            startFrom: data.startFrom,
            limit: data.limit,
            worksheetID: data.worksheetID,
            index: data.index
        });
    }
    getWorksheetReportData(): Observable<any> {
        return this.worksheerReportDataBS.asObservable();
    }

    notificationImagePicker(category) {
        let notificationImage = '';
        if (category) {
            switch (category.toLowerCase()) {
                case 'information':
                    notificationImage = AppSettings.NOTIFICATION_IMAGE_TYPES[0];
                    break;
                case 'alerts':
                    notificationImage = AppSettings.NOTIFICATION_IMAGE_TYPES[1];
                    break;
                case 'commentresponse':
                    notificationImage = AppSettings.NOTIFICATION_IMAGE_TYPES[2];
                    break;
                default: notificationImage = AppSettings.NOTIFICATION_IMAGE_TYPES[0];
            }
            return notificationImage;
        }
    }

    private reformDisplayContent(displayContent) {
        let outputQuestion = '';
        const questionPattern = new RegExp(/\[[a-zA-Z0-9_]+\]/g);
        const question = _.get(displayContent, 'questionBody', '');
        const templateType = _.get(displayContent, 'template', '');

        const tempArray: any[] = question.split(questionPattern);
        const matches = question.match(questionPattern);

        for (let i = 0; i < tempArray.length; i++) {
            outputQuestion += tempArray[i] + this.generateElement(displayContent, matches, i);
            /* outputQuestion.push({
              type: 'text',
              value: tempArray[i]
            });
            if (matches && matches[i]) {
              const match = matches[i].substr(1, (matches[i].length - 2));
              const ques_resp = _.get(displayContent, 'responseElements.' + match, {});
              const attributes = _.get(ques_resp, 'attributes', {});
              const ques_type = _.get(ques_resp, 'type', '');
              const quesChoices = [];
              if (ques_type.toLowerCase() === 'dropdown') {
                const choices = _.get(ques_resp, 'choices', []);
                for (let j = 0; j < choices.length; j++) {
                  const choice = choices[j];
                  quesChoices.push(choice.value);
                }
              }
              const questionField: any = {
                attributes: attributes,
                type: ques_type.toLowerCase(),
                value: matches[i],
                key: match
              };
              if (quesChoices.length > 0) {
                questionField.choices = quesChoices;
              }
              outputQuestion.push(questionField);
            } */
        }
        outputQuestion = outputQuestion.replace(/<iframe/g, '<div class="block-iframe-parent"><div class="block-iframe"></div><iframe');
        outputQuestion = outputQuestion.replace(/<\/iframe>/g, '</iframe></div>');
        displayContent.questionField = outputQuestion;
        return displayContent;
    }

    private generateElement(displayContent, matches, i) {
        const directAttributes = ['style', 'size', 'maxlength'];
        const elementWrapper = { 'start': '', 'end': '' };
        let param = '';
        let element = '';
        let options = '';
        if (matches && matches[i]) {
            const match = matches[i].substr(1, (matches[i].length - 2));
            const ques_resp = _.get(displayContent, 'response.' + match, {});
            const attributes = _.get(ques_resp, 'attributes', {});
            const correctAnswer = _.get(ques_resp, 'correctAnswer', '');
            const ques_type = _.get(ques_resp, 'type', '');
            param = 'id="' + match + '" name="' + match + '"';
            _.forEach(attributes, function (value, key) {
                switch (key.toLowerCase()) {
                    case 'style':
                    case 'size':
                    case 'maxlength':
                        param += ' ' + key.toLowerCase() + '="' + value + '"';
                        break;
                    case 'texttype':
                        elementWrapper.start = '<' + value + '>';
                        elementWrapper.end = '</' + value + '>';
                        break;
                    case 'numeric':
                        param += ' onkeydown="angularComponent.validateNumeric(' + match + ', event)"';
                        break;
                }
            });



            // UserReponse
            const user_resp = _.get(displayContent, 'userResponse.' + match, {});
            const user_answer = _.get(user_resp, 'userAnswer', '');
            displayContent.userAnswer = user_answer;
            displayContent.correctAnswer = correctAnswer;
            /* Set choices for select */
            const choices = _.get(ques_resp, 'choices', []);
            _.forEach(choices, function (choice, key) {
                options = (options === '') ? '' : options;
                options += '<option value="' + choice.id + '">' + choice.value + '</option>';
            });
            switch (ques_type.toLowerCase()) {
                case 'blank':
                    param += (!_.includes(param, 'size')) ? ' size="9"' : '';
                    element = '<input type="text" ' + param + 'value="' + user_answer + '"' +
                        ' autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" disabled>';
                    break;
                case 'dropdown':
                    const correctAnswerChoices = _.get(ques_resp, 'choices', []);
                    const value = correctAnswerChoices[user_answer].value;
                    element = '<select disabled ' + param + ' value="' + value + '"' +
                        '>' + options + '</select>';
                    break;
            }
        }
        element = elementWrapper.start + element + elementWrapper.end;
        return element;
    }

    handleResponseError(response, from?: string, goTo?: string) {
        switch (response.status) {
            case 401:
                this.hideLoader();
                this.router.navigate(['error/unauthorized']);
                break;
            default:
                this.handleUnexpectedResponse('unexpected', goTo);
        }
        return response;
    }
    errorHandler(error: Response) {
        console.error('Error on HTTP Call', error);
        return Observable.throw(error || 'Server Error');
    }

    setDefaultProfilePic(profileInfo) {
        let image: string;
        const gender = _.get(profileInfo, 'gender', '').toLowerCase();
        if (gender === 'female') {
            image = AppSettings.ERROR_PROFILE_IMAGE[0];
        } else {
            image = AppSettings.ERROR_PROFILE_IMAGE[1];
        }
        return image;
    }
    /* DOM Services Ends */

    /* String Services Starts */
    checkFileExtension(fileFormat: string, fileType: string) {
        let acceptedTypes: string[];
        let isValidImageType = false;
        switch (fileType) {
            case 'image':
                acceptedTypes = AppSettings.IMAGE_FORMAT;
                break;
            default:
                acceptedTypes = AppSettings.IMAGE_FORMAT;
        }
        _.forEach(acceptedTypes, (type) => {
            if (_.endsWith(fileFormat.toLowerCase(), type.toLowerCase())) {
                isValidImageType = true;
            }
        });
        return isValidImageType;
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
    /* String Services Ends */

    /* Modal Services Starts */
    open(modalName, options?: any) {
        let ngbModalOptions: NgbModalOptions = {};
        const modalCount = _.get(this.modalService, '_modalStack._applicationRef.viewCount', 1);
        if (modalCount > 1) {
            this.dismissOpenModal();
        }
        if (_.indexOf(options, 'backDropStop') > -1) {
            ngbModalOptions = {
                backdrop: 'static',
                keyboard: false
            };
        }
        setTimeout(() => {
            let backdrop = (document.getElementsByTagName('ngb-modal-backdrop'));
            let backdropWindow = (document.getElementsByTagName('ngb-modal-window'));
            if (backdrop.length == 1 && backdropWindow.length == 1) {
                backdrop[0].parentElement.removeChild(backdrop[0]);
                backdropWindow[0].parentElement.removeChild(backdropWindow[0]);
            }
            this.modalService.open(modalName, ngbModalOptions).result.then((result) => {
                this.closeResult = `Closed with: ${result}`;
            }, (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
        });
    }
    dismissOpenModal() {
        const closeButton = (<HTMLElement>document.getElementsByClassName('fa-times')[0]);
        if (closeButton) {
            closeButton.click();
        }
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
    /* Modal Services Ends */

    /* BehaviorSubject Observable Service Starts */
    setUserInformation(userInformation) {
        this.userInformation = userInformation;
    }
    getUserInformation() {
        return this.userInformation;
    }

    setJWT(response: any, reset?: boolean, isJWT?: boolean) {
        let jwtValue = null;
        if (!isJWT) {
            jwtValue = (!reset) ? response.headers.get('jwt') : null;
        } else {
            jwtValue = response;
        }
        if (reset || (!reset && jwtValue !== null)) {
            this.jwtBS.next({
                jwt: jwtValue
            });
        }
    }
    getJWT(): Observable<any> {
        return this.jwtBS.asObservable();
    }

    clearAllSharedService() {
        this.setLoader(false);
        this.setJWT(null, true);
    }
    getAndClearCookies() {
        let tempCookie = '';

        let tempJWT = '';
        this.getJWT().subscribe(result => {
            tempJWT = result.jwt;
        });
        if (tempJWT === null || tempJWT === undefined || tempJWT === '') {
            tempJWT = this._cookieService.get('jwt');
        }

        if (tempJWT) {
            this.setJWT(tempJWT, null, true);
            if (environment.production) { this._cookieService.remove('jwt'); }
        }

        if (tempCookie !== undefined || tempCookie !== null || tempCookie === '') {
            tempCookie = this._cookieService.get('errorType');
            if (environment.production) {
                this._cookieService.remove('errorType');
            }
        }

        if (tempCookie) {
            if (tempCookie === 'pageRefresh') {
                this.router.navigate(['error/pageRefresh']);
            } else {
                this.router.navigate(['error/unauthorized']);
            }
        }

    }
    /* BehaviorSubject Observable Service Ends */
}
