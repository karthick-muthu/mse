import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { SharedService } from '../../shared/shared.service';
import { ContentService } from '../../shared/services/content/content.service';
import { CookieService } from 'ngx-cookie';
import { AppSettings } from '../../settings/app.settings';
import { ApiSettings } from '../../settings/app.api-settings';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';

@Injectable()
export class HomeService {
    jwt: any;
    response: HttpResponse<any>;
    private logoutTypes: any[];
    private subject = new Subject<any>();
    private dashboardServiceResponse: any;
    private baseURL: string;
    private homeSource = new BehaviorSubject<string>('No Data');
    currentSource = this.homeSource.asObservable();

    constructor(private http: HttpClient, private sharedService: SharedService, private contentService: ContentService,
        private cookieService: CookieService) {
        this.baseURL = environment.apiBaseURL;
        this.logoutTypes = AppSettings.LOGOUT_TYPES;
        this.sharedService.getJWT().subscribe(result => { this.jwt = _.get(result, 'jwt'); });
    }

    getHomeDetails(): Observable<any> {
        const data = {};
        const url = this.baseURL + ApiSettings.API.homeDetails;
        return this.http.post(url, data)
            .map((res: HttpResponse<any>) => {
                this.dashboardServiceResponse = res;
                this.sharedService.setUserInformation(this.dashboardServiceResponse.userInformation);
                return this.dashboardServiceResponse;
            })
            .catch(this.sharedService.errorHandler);
    }

    getNotifications(): Observable<any> {
        const data = {};
        const url = this.baseURL + ApiSettings.API.getNotifications;
        return this.http.post(url, data).map((res: HttpResponse<any>) => {
            this.dashboardServiceResponse = res;
            return this.dashboardServiceResponse;
        });
    }

    toggleProfileSelector(isProfileVisible: boolean) {
        this.subject.next(isProfileVisible);
    }

    clearMessage() {
        this.subject.next();
    }

    getProfileToggle(): Observable<any> {
        return this.subject.asObservable();
    }

    logout(type?) {
        if (this.jwt !== null || this.jwt !== '' || this.jwt !== undefined) {

            let hiddenField, logoutType, logoutURL, externalLink, form;
            type = (type) ? type : 0;
            externalLink = this.baseURL + ApiSettings.API.auth.logout;

            this.sharedService.showLoader();

            this.contentService.setLogoutSession(null);
            logoutType = _.get(this.logoutTypes, '[' + type + '].type', 'regular');
            logoutURL = _.get(this.logoutTypes, '[' + type + '].url', '/');
            logoutURL = (logoutURL === '') ? logoutURL : environment.appBaseURL + logoutURL;
            if (logoutType === AppSettings.LOGOUT_TYPES[1].type) {
                this.sharedService.setReloadRestrict('blockReload');
            } else if (logoutType === AppSettings.LOGOUT_TYPES[2].type) {
                this.cookieService.put('errorType', 'pageRefresh');
            }

            form = document.createElement('form');
            form.setAttribute('method', 'post');
            form.setAttribute('action', externalLink);
            hiddenField = this.generateHiddenField('token', this.jwt);
            form.appendChild(hiddenField);
            hiddenField = this.generateHiddenField('logoutType', logoutType);
            form.appendChild(hiddenField);
            hiddenField = this.generateHiddenField('redirect', logoutURL);
            form.appendChild(hiddenField);
            document.body.appendChild(form);
            form.submit();

            this.sharedService.clearAllSharedService();
            this.contentService.clearAllContentService();

            this.sharedService.hideLoader();
        } else {
            window.location.href = environment.loginBaseURL;
        }
    }

    private generateHiddenField(name, value) {
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', name);
        hiddenField.setAttribute('value', value);
        return hiddenField;
    }

    errorHandler(error: Response) {
        console.error('Error on HTTP Call', error);
        return Observable.throw(error || 'Server Error');
    }
    // getRestAngularData(): Observable<any> {
    //     return this.restangular.all('accounts').getList();
    // }
}
