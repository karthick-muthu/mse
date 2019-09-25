import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { SharedService } from '../../shared.service';
import { ApiSettings } from '../../../settings/app.api-settings';
import { environment } from '../../../../environments/environment';

@Injectable()
export class DoAPICallService {
    private baseURL: string;
    private jwt: string;

    constructor(private http: Http, private httpClient: HttpClient, private sharedService: SharedService) {
        this.baseURL = environment.apiBaseURL;
        this.sharedService.getJWT().subscribe(
            result => this.jwt = result.jwt
        );
    }

    get(url, data): Observable<any> {
        let response: any;
        url = this.baseURL + url;
        return this.httpClient.get(url, { params: data })
            .map((res: HttpResponse<any>) => response = res)
            .catch(this.errorHandler);
    }

    post(url, data): Observable<any> {
        let response: any;
        url = this.baseURL + url;
        const options = this.setHeaders();
        /* Http Way */
        // return this.http.post(url, data, options)
        //     .map((res: Response) => response = res.json())
        //     .catch(this.errorHandler);
        /* HttpClient Way */
        return this.httpClient.post(url, data)
            .map((res: HttpResponse<any>) => response = res)
            .catch(this.errorHandler);
    }

    setHeaders() {
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('jwt', this.jwt);
        return new RequestOptions({ headers: headers });
    }

    errorHandler(error: Response) {
        console.error('Error on HTTP Call', error);
        return Observable.throw(error || 'Server Error');
    }

}
