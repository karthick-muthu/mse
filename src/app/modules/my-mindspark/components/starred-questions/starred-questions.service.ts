import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiSettings } from '../../../../settings/app.api-settings';
import { DoAPICallService } from '../../../../shared/services/doAPICall/doAPICall.service';

@Injectable()
export class StarredQuestionsService {

    constructor(private http: DoAPICallService) { }

    getFavouritesList(data): Observable<any> {
        let response: any;
        const getUrl = ApiSettings.API.favouritesQuestion.get;
        return this.http.post(getUrl, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }
    removeFromFavourites(data): Observable<any> {
        let response: any;
        const getUrl = ApiSettings.API.favouritesQuestion.remove;
        return this.http.post(getUrl, data)
            .map((res) => response = res)
            .catch(this.http.errorHandler);
    }

}
