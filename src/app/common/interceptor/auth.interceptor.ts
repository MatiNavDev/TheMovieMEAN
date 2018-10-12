import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { SessionStorageService } from 'src/app/common/services/session.storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private sessionStrgSrvc: SessionStorageService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.sessionStrgSrvc.getToken();
        if(token){
            req = req.clone({
                setHeaders: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        }

        return next.handle(req);
    }
}