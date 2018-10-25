import { DecodedToken } from '../../common/models/decodedToken.model';
import { SessionService } from 'src/app/common/services/session.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionStorageService } from 'src/app/common/services/session.storage.service';
import { Observable } from 'rxjs/internal/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subscriber } from 'rxjs/internal/Subscriber';
import { ErrorHandlerService } from 'src/app/common/services/error-handler.service';
import { mergeMap } from 'rxjs/operators';
import { of} from 'rxjs';
import { AuthStorageService } from './auth.storage.service';


@Injectable({
    providedIn: 'root'
  })
export class AuthRequestService {

    private jwt = new JwtHelperService();

    constructor(
        private http: HttpClient, private sessionStrgSrvc: SessionStorageService, private authStgSrvc:AuthStorageService,
        private errorSrvc: ErrorHandlerService, public sessionsrvc: SessionService
    ) {
    }




    /**
     * Maneja una autenticación exitoso
     * @param user 
     */
    private handleSuccessfullAuth(user: any, observer: Subscriber<any>) {
        this.authStgSrvc.setUser(user);
        observer.next('ok');
        observer.complete();
    }

    /**
     * Guarda el token para que el back nos identifique 
     * @param token 
     */
    private setToken(token:string){
        this.sessionsrvc.setSessionMode(true);
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
                    (response: any) => {
                        this.setToken(response.token);
                        this.handleSuccessfullAuth(response.user, observer);
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
                if(data.img){
                    return this.uploadImage(data.img)
                }
                return of();
            })
        )
                .subscribe(
                    () => {
                        this.handleSuccessfullAuth(user, observer);
                    },
                    (error: any) => {
                        this.errorSrvc.handleUniversalError(error, observer);
                    })
        })
    }

}
