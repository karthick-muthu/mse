import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DoAPICallService } from '../../shared/services/doAPICall/doAPICall.service';
import { SharedService } from '../../shared/shared.service';
import { ApiSettings } from '../../settings/app.api-settings';

@Injectable()
export class MyProgressService {

    constructor(private http: DoAPICallService, private sharedService: SharedService) { }

    getMyProgressData(): Observable<any> {
        let response: any;
        const data = {};
        const url = ApiSettings.API.getMyProgress;
        return this.http.post(url, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

}
