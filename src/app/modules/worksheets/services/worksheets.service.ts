import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiSettings } from '../../../settings/app.api-settings';
import { SharedService } from '../../../shared/shared.service';
import { environment } from '../../../../environments/environment';
import { DoAPICallService } from '../../../shared/services/doAPICall/doAPICall.service';

@Injectable()
export class WorksheetsService {
	private baseURL: string;
	serviceResponse: any;
	worksheet: any;

	constructor(private http: DoAPICallService, private sharedService: SharedService) {
		this.baseURL = environment.apiBaseURL;
	}

	getWorksheetsList(): Observable<any> {
		const data = {};
		const url = ApiSettings.API.worksheets.get;
		let response: any;
		return this.http
			.post(url, data)
			.map(res => (response = res))
			.catch(this.sharedService.errorHandler);
		//return this.http.get('GetMyWorksheets');
	}

	getWorksheetReport(data): Observable<any> {
		const url = ApiSettings.API.getWorksheetReport;
		let response: any;
		return this.http
			.post(url, data)
			.map(res => (response = res))
			.catch(this.sharedService.errorHandler);
		//        return this.http.get('GetWorksheetReport');
	}

	startWorksheet(data): Observable<any> {
		const url = ApiSettings.API.worksheets.open;
		let response: any;
		return this.http
			.post(url, data)
			.map(res => (response = res))
			.catch(this.sharedService.errorHandler);
		//return this.http.get('OpenWorksheet');
	}
	quitWorksheet(worksheetID?): Observable<any> {
		const url = ApiSettings.API.worksheets.quitWorksheet;
		let response: any;
		const data = { worksheetID: worksheetID };
		//return this.http.get('QuitWorksheet');
		return this.http
			.post(url, data)
			.map(res => (response = res))
			.catch(this.sharedService.errorHandler);
	}
	setWorksheet(worksheet) {
		this.worksheet = worksheet;
	}
	getWorksheet() {
		return this.worksheet;
	}
}
