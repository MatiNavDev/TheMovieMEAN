import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment'
import { SessionStorageService } from 'src/app/common/services/session.storage.service';
import { DecodedToken } from '../models/decodedToken.model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subscription } from 'rxjs/internal/Subscription';
import { Observable } from 'rxjs/internal/Observable';

const jwt = new JwtHelperService();


@Injectable()
export class SessionService {

    private decodedTokenStore = new BehaviorSubject<any>(new DecodedToken())
    private decodedTokenObservable= this.decodedTokenStore.asObservable()

    constructor(private sessionStrgSrvc: SessionStorageService) {
        const decodedToken = this.sessionStrgSrvc.getDecodedToken() ||  new DecodedToken();     
        this.setDecodedToken(decodedToken);
    }

    /**
     * Obtiene la expiracion del token
     */
    private getExpiration() {
        this.getDecodedToken()
        .subscribe(
            decodedToken => {
                return moment.unix(decodedToken.exp);
        });
    }


    public setDecodedToken(token){
        this.decodedTokenStore.next(token);
    }

    public getDecodedToken(): Observable<any>{
        return this.decodedTokenObservable;
    }

    
    /**
     * Devuelve si esta autenticado
     */
    public isAuthenticated() {
        return moment().isBefore(this.getExpiration());
    }


    /**
     * Se desloguea y setea un nuevo decodedToken vacio
     */
    public logout() {
        this.sessionStrgSrvc.removeTokens();
        this.decodedTokenStore.next(new DecodedToken());
    }


}
