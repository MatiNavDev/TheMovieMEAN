import { SessionService } from 'src/app/common/services/session.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionStorageService } from 'src/app/common/services/session.storage.service';
import { Observable } from 'rxjs/internal/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscriber } from 'rxjs/internal/Subscriber';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ErrorHandlerService } from 'src/app/common/services/error-handler.service';



@Injectable()
export class AuthService {

    private host: string;
    private jwt = new JwtHelperService();

    constructor(
        private http: HttpClient, private sessionStrgSrvc: SessionStorageService,
        private errorSrvc: ErrorHandlerService, public sessionsrvc:SessionService
    ) {
    }

    /**
     * Maneja un login exitoso
     */
    private handleSuccessfullLogin(token: string, observer: Subscriber<any>) {
        this.sessionsrvc.decodedToken = this.jwt.decodeToken(token);
        this.sessionStrgSrvc.setDecodedToken(this.sessionsrvc.decodedToken);
        this.sessionStrgSrvc.setToken(token);
        observer.next('ok');
        observer.complete();
        debugger;
    }


    public login(data): Observable<any> {
        return new Observable((observer) => {
            this.http.post('/api/v1/auth/login', data)
                .subscribe(
                (token: string) => {
                    this.handleSuccessfullLogin(token, observer);
                },
                (error: HttpErrorResponse) => {
                    this.errorSrvc.handleUniversalError(error, observer);
                })
        })
    }

    public register(data){
    }

}
