import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { SharedService } from './shared.service';
import { environment } from '../../environments/environment';

@Injectable()
export class MindsparkInterceptor implements HttpInterceptor {
	jwt: any;

	constructor(private sharedService: SharedService) {
		this.sharedService.getJWT().subscribe(result => {
			if (result) {
				this.jwt = result.jwt;
				return this.jwt;
			}
		});
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		let changedReq = req.clone();
		if (this.jwt) {
			changedReq = req.clone({
				headers: req.headers.set(
					'jwt', this.jwt
				)
			});
		}

		// changedReq = req.clone({
		// 	headers: req.headers.set(
		// 		'jwt', "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cGlkIjoiNWJmM2I3NTU0MjFhYTk2ZjhhNzA5MjE2IiwiY2xzIjoiNCIsImxhbmciOiJlbi1JTiIsImNhdCI6InN0dWRlbnQiLCJzaWQiOiI1ZDc1N2ZiMTQyMWFhOTE2NGM3ZjUyYjAiLCJpblRpbWUiOiIyMDE5LTA5LTA5IDAzOjU0OjQ5Iiwic2Vzc1RpbWUiOjM2MDAsInVuIjoiaGFyZWVzaC5oaWdoZXJfcmVhcmNoIiwiaXMiOmZhbHNlLCJyZXRhaWwiOmZhbHNlLCJnaWQiOiI1YTJhM2MyODQyMWFhOTNlZGQ0ZTU1YmIiLCJvZmZsaW5lVXNlciI6IjEifQ.5IEuQreCaoB-qeI61yaeitPIhSJugc-wjxNjp1df5P0"
		// 	)
		// });

		return next.handle(changedReq).do(event => {
			if (event instanceof HttpResponse) {
				if (!environment.production) {
				}
				this.sharedService.setJWT(event);
				this.sharedService.changeLanguage(event.body);
			}
		});
	}
}
