import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DoAPICallService } from '../../../../shared/services/doAPICall/doAPICall.service';
import { SharedService } from '../../../../shared/shared.service';
import { ApiSettings } from '../../../../settings/app.api-settings';

@Injectable()
export class MyDetailsService {

    constructor(private http: DoAPICallService, private sharedService: SharedService) { }

    getMyDetailsData(): Observable<any> {
        let response: any;
        const data = {};
        const url = ApiSettings.API.myDetails.get;
        return this.http.post(url, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

    updateMyDetailsData(data): Observable<any> {
        let response: any;
        const url = ApiSettings.API.myDetails.update;
        return this.http.post(url, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

    uploadProfilePic(data): Observable<any> {
        let response: any;
        const url = ApiSettings.API.myDetails.updateProfilePic;
        return this.http.post(url, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

}
