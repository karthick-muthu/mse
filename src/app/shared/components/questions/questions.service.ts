import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DoAPICallService } from '../../services/doAPICall/doAPICall.service';
import { ApiSettings } from '../../../settings/app.api-settings';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class QuestionsService {

    constructor(private http: DoAPICallService) { }

    fetchFirstContent(data): Observable<any> {
        const url = ApiSettings.API.question.firstContent;
        let response: any;
        return this.http.post(url, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
        //return this.http.get('FetchWorksheetContent');
    }

    fetchContentPreview(data): Observable<any> {
        const url = ApiSettings.API.question.previewFetchFirstContent;
        let response: any;
        return this.http.post(url, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

    submitAnswer(data): Observable<any> {
        const url = ApiSettings.API.question.submitAnswer;
        let response: any;
        return this.http.post(url, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }
    submitWorksheetQuestion(data): Observable<any> {
        const url = ApiSettings.API.worksheets.submitWorksheetQuestion;
        let response: any;
        return this.http.post(url, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
        //     return this.http.get('SubmitWorksheetQuestion');
    }
    updateAnswer(data): Observable<any> {
        const url = ApiSettings.API.question.updateAnswer;
        let response: any;
        return this.http.post(url, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

    submitActivity(data): Observable<any> {
        const url = ApiSettings.API.question.submitActivity;
        let response: any;
        return this.http.post(url, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

    saveActivity(data): Observable<any> {
        const url = ApiSettings.API.question.saveActivity;
        let response: any;
        return this.http.post(url, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

    closeContent(data): Observable<any> {
        const url = ApiSettings.API.question.closeContent;
        let response: any;
        return this.http.post(url, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

    quitTopicHigherLevel(): Observable<any> {
        const data = {};
        const url = ApiSettings.API.question.quitTopicHigherLevel;
        let response: any;
        return this.http.post(url, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

    addToFavourities(data): Observable<any> {
        const url = ApiSettings.API.question.addToFavourities;
        let response: any;
        return this.http.post(url, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

    contentErrorLog(data): Observable<any> {
        const url = ApiSettings.API.question.contentErrorLog;
        let response: any;
        return this.http.post(url, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

}
