import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SharedService } from '../../../shared.service';
import { TranslateService } from 'ng2-translate';
import { ApiSettings } from '../../../../settings/app.api-settings';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class CommentModalService {
    private baseURL: string;

    constructor(private http: HttpClient, private translate: TranslateService, private sharedService: SharedService) {
        this.baseURL = environment.apiBaseURL;
    }

    createComment(data): Observable<any> {
        const url = this.baseURL + ApiSettings.API.mailBox.writeToMindspark;
        let createCommentResponse: any;
        return this.http.post(url, data)
            .map((res: HttpResponse<any>) => createCommentResponse = res)
            .catch(this.sharedService.errorHandler);
    }

    replyToMessage(data): Observable<any> {
        const url = this.baseURL + ApiSettings.API.mailBox.replyToMessage;
        let replyToMessageResponse: any;
        return this.http.post(url, data)
            .map((res: HttpResponse<any>) => replyToMessageResponse = res)
            .catch(this.sharedService.errorHandler);
    }

}
