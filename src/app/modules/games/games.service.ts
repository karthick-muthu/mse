import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiSettings } from '../../settings/app.api-settings';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SharedService } from '../../shared/shared.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class GamesService {
    baseURL: any;
    gamesServiceResponse: any;

    constructor(private http: HttpClient, private sharedService: SharedService) {
        this.baseURL = environment.apiBaseURL;
    }
    getListActivity(): Observable<any> {
        const data: any = {};
        const url = this.baseURL + ApiSettings.API.listActivity;
        return this.http.post(url, data)
            .map((res: HttpResponse<any>) => this.gamesServiceResponse = res)
            .catch(this.sharedService.errorHandler);
    }

    openActivity(data): Observable<any> {
        const url = this.baseURL + ApiSettings.API.openActivity;
        return this.http.post(url, data)
            .map((res: HttpResponse<any>) => this.gamesServiceResponse = res)
            .catch(this.sharedService.errorHandler);
    }
}
