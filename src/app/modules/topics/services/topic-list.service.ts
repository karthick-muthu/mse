import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpResponse } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { TranslateService } from 'ng2-translate';
import { SharedService } from '../../../shared/shared.service';
import { ApiSettings } from '../../../settings/app.api-settings';
import { environment } from '../../../../environments/environment';

@Injectable()
export class TopicListService {
  private baseURL: string;
  serviceResponse: any;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.baseURL = environment.apiBaseURL;
  }

  getDetails(): Observable<any> {
    const data = {};

    const url = this.baseURL + ApiSettings.API.topics.get;
    return this.http.post(url, data)
      .map((res: HttpResponse<any>) => this.serviceResponse = res)
      .catch(this.sharedService.errorHandler);

  }

  getTopicList(): Observable<any> {
    const data = {};

    const url = this.baseURL + ApiSettings.API.topics.get;
    return this.http.post(url, data)
      .map((res: HttpResponse<any>) => this.serviceResponse = res)
      .catch(this.sharedService.errorHandler);
  }

  getHigherGrades(): Observable<any> {
    const data = {};

    const url = this.baseURL + ApiSettings.API.topics.highGrades;
    return this.http.post(url, data)
      .map((res: HttpResponse<any>) => this.serviceResponse = res)
      .catch(this.sharedService.errorHandler);
  }

  startTopic(data): Observable<any> {
    let openTopic: any;

    const url = this.baseURL + ApiSettings.API.topics.open;
    return this.http.post(url, data)
      .map((res: HttpResponse<any>) => openTopic = res)
      .catch(this.sharedService.errorHandler);
  }
  getTopicTrail(data): Observable<any> {
    let openTopic: any;

    const url = this.baseURL + ApiSettings.API.topics.topicTrail;
    return this.http.post(url, data)
      .map((res: HttpResponse<any>) => openTopic = res)
      .catch(this.sharedService.errorHandler);
  }
  getTopicDetails(data): Observable<any> {
    let openTopic: any;

    const url = this.baseURL + ApiSettings.API.topics.topicDetails;
    return this.http.post(url, data)
      .map((res: HttpResponse<any>) => openTopic = res)
      .catch(this.sharedService.errorHandler);
  }
}
