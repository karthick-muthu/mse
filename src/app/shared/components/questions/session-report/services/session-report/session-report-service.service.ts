import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ApiSettings } from '../../../../../../settings/app.api-settings';
import { environment } from '../../../../../../../environments/environment';
import { SharedService } from '../../../../../shared.service';

@Injectable()
export class SessionReportService {
    private baseURL: string;
    sessionReportResponse: any;

    constructor(private http: HttpClient, private sharedService: SharedService) {
        this.baseURL = environment.apiBaseURL;
    }

    getTopicSessionReport(data): Observable<any> {
        const url = this.baseURL + ApiSettings.API.question.sessionReport;
        return this.http.post(url, data)
            .map((res: HttpResponse<any>) => this.sessionReportResponse = res)
            .catch(this.sharedService.errorHandler);
    }

    startTopicHigherLevel(data) {
        const url = this.baseURL + ApiSettings.API.question.startTopicHigherLevel;
        return this.http.post(url, data)
            .map((res: HttpResponse<any>) => this.sessionReportResponse = res)
            .catch(this.sharedService.errorHandler);
    }
}
