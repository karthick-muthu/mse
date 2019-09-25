import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SharedService } from '../../shared.service';
import { ApiSettings } from '../../../settings/app.api-settings';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ChangePasswordService {
    private baseURL: string;

    constructor(private http: HttpClient, private sharedService: SharedService) {
        this.baseURL = environment.apiBaseURL;
    }

    changePasswordData(data): Observable<any> {
        let response: any;
        const url = this.baseURL + ApiSettings.API.auth.changePassword;
        return this.http.post(url, data)
            .map((res: HttpResponse<any>) => response = res)
            .catch(this.sharedService.errorHandler);
    }

    getMyPasswordType(): Observable<any> {
        // RESET MY PASSWORD METHOD IS AVAILABLE IN CHANGE PASSWORD COMPONENT.
        // NEED TO MERGE BOTH HTMLS AND MAKE IT DYNAMIC BASED ON API....
        let response: any;
        const data = {};
        const url = this.baseURL + ApiSettings.API.auth.getMyPasswordType;
        return this.http.post(url, data)
            .map((res: HttpResponse<any>) => response = res)
            .catch(this.sharedService.errorHandler);
    }

}
