import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DoAPICallService } from '../../../../shared/services/doAPICall/doAPICall.service';
import { SharedService } from '../../../../shared/shared.service';
import { ApiSettings } from '../../../../settings/app.api-settings';


@Injectable()
export class MailboxService {

    constructor(private http: DoAPICallService, private sharedService: SharedService) { }

    getMailboxData(): Observable<any> {
        let response: any;
        const data = {};
        const getUrl = ApiSettings.API.mailBox.getMailbox;
        return this.http.post(getUrl, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

    markNotificationAsRead(data): Observable<any> {
        let response: any;
        const getUrl = ApiSettings.API.mailBox.markNotificationAsRead;
        return this.http.post(getUrl, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }
    getMessageTrailData(data): Observable<any> {
        let response: any;
        const getUrl = ApiSettings.API.mailBox.getMessageTrail;
        return this.http.post(getUrl, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

    saveRating(data): Observable<any> {
        let response: any;
        const getUrl = ApiSettings.API.mailBox.saveRating;
        return this.http.post(getUrl, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

}
