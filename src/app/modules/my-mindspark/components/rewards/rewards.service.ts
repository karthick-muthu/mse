import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiSettings } from '../../../../settings/app.api-settings';
import { DoAPICallService } from '../../../../shared/services/doAPICall/doAPICall.service';

@Injectable()
export class RewardsService {

    constructor(private http: DoAPICallService) { }

    getRewardData(): Observable<any> {
        let response: any;
        const data = {};
        const getUrl = ApiSettings.API.getRewardInfo;
        return this.http.post(getUrl, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }
}
