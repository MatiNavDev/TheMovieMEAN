import { Injectable } from '@angular/core';
import * as moment from 'moment'
import { DecodedToken } from '../models/decodedToken.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { SessionStorageService } from './session.storage.service';


@Injectable()
export class SessionService {

    private decodedTokenStore = new BehaviorSubject<any>(new DecodedToken());
    private decodedTokenObservable= this.decodedTokenStore.asObservable();
    private sessionModeStore = new BehaviorSubject<any>(false);
    private sessionModeObservable = this.sessionModeStore.asObservable();

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

    public setSessionMode(sessionMode){
        this.sessionModeStore.next(sessionMode);
    }

    public getSessionMode(){
        return this.sessionModeObservable;
    }

    public getDecodedToken(): Observable<any>{
        return this.decodedTokenObservable;
    }

    
    /**
     * Devuelve si esta autenticado
     */
    public isAuthenticated() {
        const sessionMode = moment().isBefore(this.getExpiration());
        this.setSessionMode(sessionMode);
        return sessionMode;
    }


    /**
     * Se desloguea y setea un nuevo decodedToken vacio
     */
    public logout() {
        this.setSessionMode(false);
        this.sessionStrgSrvc.removeTokens();
        this.decodedTokenStore.next(new DecodedToken());
    }


}
