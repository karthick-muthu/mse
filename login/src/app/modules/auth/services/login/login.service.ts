import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { LoginApiSettings } from '../../../../settings/login.api.settings';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import * as _ from 'lodash';
import { LoginSettings } from '../../../../settings/login.settings';

@Injectable()
export class LoginService {
    jwt: any;
    private baseURL: string;
    loginResponse: any;

    constructor(private http: Http, private httpClient: HttpClient, private authService: AuthService) {
        this.baseURL = environment.apiBaseURL;
        this.authService.getJWT().subscribe(result => {
            this.jwt = _.get(result, 'jwt');
        });
    }

    checkUsername(data): Observable<any> {
        let appendStr = "";
        if(data.prefill){
            appendStr = "prefill="+data.prefill;
        }
        if(!appendStr && data.mode){
            appendStr = "mode="+data.mode;
        }else if(appendStr && data.mode){
            appendStr = appendStr + "&mode="+data.mode;
        }
        const url = this.baseURL + LoginApiSettings.API.auth.login.checkUsername+"?"+appendStr;
        return this.makeHttpCall(url, data);
    }

    checkPassword(data): Observable<any> {
        const url = this.baseURL + LoginApiSettings.API.auth.login.validatePassword;
        return this.makeHttpCall(url, data);
    }

    setPasswordAfterReset(data): Observable<any> {
        const url = this.baseURL + LoginApiSettings.API.auth.login.setPasswordAfterReset;
        return this.makeHttpCall(url, data);
    }

    sendNewLoginDetails(data): Observable<any> {
        const url = this.baseURL + LoginApiSettings.API.auth.login.SubmitNewLoginDetails;
        return this.makeHttpCall(url, data);
    }

    forgotPassword(data): Observable<any> {
        const url = this.baseURL + LoginApiSettings.API.auth.forgotPassword;
        return this.makeHttpCall(url, data);
    }

    getSparkieChampForLastWeek() {
        const data="";
        const url = this.baseURL + LoginApiSettings.API.auth.login.getSparkieChampForLastWeek;
        return this.makeHttpCall(url,data);
    }


    validateUserDetailsforPasswordReset(data): Observable<any> {
        const url = this.baseURL + LoginApiSettings.API.auth.login.validateUserDetailsforPasswordReset;
        return this.makeHttpCall(url, data);
    }

    getLandingPage(data) {
        const url = this.baseURL + LoginApiSettings.API.auth.login.getLandingPage;
        const form = document.createElement('form');
        let jwtTokenForm: any;
        jwtTokenForm = this.createFormTokenSubmit(url, form);
        form.appendChild(jwtTokenForm);
        if (data) {
            let hiddenTopicSelectField: any = '';
            hiddenTopicSelectField = document.createElement('input');
            hiddenTopicSelectField.setAttribute('name', 'productSelection');
            hiddenTopicSelectField.setAttribute('value', data);
            hiddenTopicSelectField.setAttribute('type', 'hidden');
            form.appendChild(hiddenTopicSelectField);
        }
        document.body.appendChild(form);
        form.submit();
    }
    
    logoutAllSession(data): Observable<any> {
        const url = this.baseURL + LoginApiSettings.API.auth.logoutAllSession;
        return this.makeHttpCall(url, data);
    }


    liveSubscriptionPage() {
        const url = this.baseURL + LoginApiSettings.API.auth.login.liveSubscriptionPage;
        const form = document.createElement('form');
        let jwtTokenForm: any;
        jwtTokenForm = this.createFormTokenSubmit(url, form);
        form.appendChild(jwtTokenForm);
        document.body.appendChild(form);
        form.submit();
    }

    createFormTokenSubmit(url, form) {
        const externalLink = url;
        form.setAttribute('method', 'post');
        form.setAttribute('action', externalLink);
        const hiddenField = document.createElement('input');
        hiddenField.setAttribute('name', 'token');
        hiddenField.setAttribute('value', this.jwt);
        hiddenField.setAttribute('type', 'hidden');
        return hiddenField;
    }

    /************** Do HTTP CALLS **************/
    requestPasswordReset(data): Observable<any> {
        const url = this.baseURL + LoginApiSettings.API.auth.login.requestPasswordReset;
        return this.makeHttpCall(url, data);
    }
    errorHandler(error: Response) {
        console.error('Error on HTTP Call', error);
        return Observable.throw(error || 'Server Error');
    }
    makeHttpCall(url, data, method?) {

        const useHttpClient = true;
        // Use method default - POST

        // POST
        if (useHttpClient) {
            return this.httpClient.post(url, data, {})
                .map((res: HttpResponse<any>) => {
                    this.loginResponse = res;
                    this.authService.changeLanguage(res, 'login');
                    return this.loginResponse;
                })
                .catch(this.errorHandler);
        } else {
            return this.http.post(url, data)
                .map((res: Response) => {
                    this.loginResponse = res.json();
                    this.authService.setJWT(res);
                    this.authService.changeLanguage(res, 'login');
                    return this.loginResponse;
                })
                .catch(this.errorHandler);
        }


    }
}
