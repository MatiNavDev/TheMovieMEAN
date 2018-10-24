import { DecodedToken } from '../../common/models/decodedToken.model';
import { SessionService } from 'src/app/common/services/session.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionStorageService } from 'src/app/common/services/session.storage.service';
import { Observable } from 'rxjs/internal/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscriber } from 'rxjs/internal/Subscriber';
import { ErrorHandlerService } from 'src/app/common/services/error-handler.service';
import { mergeMap, catchError } from 'rxjs/operators';



@Injectable()
export class AuthRequestService {

    private host: string;
    private jwt = new JwtHelperService();

    constructor(
        private http: HttpClient, private sessionStrgSrvc: SessionStorageService,
        private errorSrvc: ErrorHandlerService, public sessionsrvc: SessionService
    ) {
    }

    /**
     * Maneja un login exitoso
     */
    private handleSuccessfullLogin(token: string, observer: Subscriber<any>) {
        this.sessionsrvc.setSessionMode(true);
        const decodedToken = this.jwt.decodeToken(token);
        this.sessionsrvc.setDecodedToken(decodedToken);
        this.sessionStrgSrvc.setDecodedToken(decodedToken);
        this.sessionStrgSrvc.setToken(token);

    }


    /**
     * Maneja un registro exitoso
     * @param user 
     */
    private handleSuccessfullRegister(user: any, observer: Subscriber<any>) {
        observer.next('ok');
        observer.complete();
    }

    /**
     * Guarda el token para que el back nos identifique 
     * @param token 
     */
    private setToken(token:string){
        const decodedtoken:DecodedToken = this.jwt.decodeToken(token);
        this.sessionStrgSrvc.setToken(token);
        this.sessionStrgSrvc.setDecodedToken(decodedtoken);
    }


    /**
     * Hace el post de la img del usuario
     * @param image 
     */
    private uploadImage(image: File): Observable<any> {
        let formData: FormData = new FormData();

        formData.append('image', image);

        return this.http.post('/api/v1/image-upload', formData)
        
    }


    /**
     * Loguea un usuario
     * @param data 
     */
    public userLogin(data): Observable<any> {
        return new Observable((observer) => {
            this.http.post('/api/v1/auth/login', data)
                .subscribe(
                    (token: string) => {
                        this.handleSuccessfullLogin(token, observer);
                    },
                    (error: any) => {
                        this.errorSrvc.handleUniversalError(error, observer);
                    })
        })
    }


    /**
     * Registra un usuario
     */
    public userRegister(data) {
        let user;
        return new Observable((observer) => {
        this.http.post('/api/v1/auth/register', data)
        .pipe(
            mergeMap((response: any)=>{
                user = response.user;
                this.setToken(response.token);
                return this.uploadImage(data.img)
            })
        )
                .subscribe(
                    res => {
                        this.handleSuccessfullRegister(user, observer);
                    },
                    (error: any) => {
                        this.errorSrvc.handleUniversalError(error, observer);
                    })
        })
    }

}
