import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { AuthService } from '../modules/auth/services/auth/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class MindsparkInterceptor implements HttpInterceptor {
    jwt: any;

    constructor(private authService: AuthService) {
        this.authService.getJWT().subscribe(
            result => {
                if (result) {
                    this.jwt = result.jwt;
                    return this.jwt;
                }
            }

        );
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let changedReq = req.clone();
        if (this.jwt) {
            changedReq = req.clone({ headers: req.headers.set('jwt', this.jwt) });
        }
        return next.handle(changedReq).do(
            event => {
                if (event instanceof HttpResponse) {
                    if (!environment.production) { console.log('interceptor response', event); }
                    this.authService.setJWT(event);
                    this.authService.changeLanguage(event.body);
                }
            });
    }
}

