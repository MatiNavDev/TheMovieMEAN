import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment'
import { SessionStorageService } from 'src/app/common/services/session.storage.service';
import { DecodedToken } from '../models/decodedToken.model';

const jwt = new JwtHelperService();


@Injectable()
export class SessionService {

    public decodedToken;

    constructor(private sessionStrgSrvc: SessionStorageService) {
        this.decodedToken = this.sessionStrgSrvc.getDecodedToken() ||  new DecodedToken();        
    }

    private getExpiration() {
        return moment.unix(this.decodedToken.exp);
    }

    public isAuthenticated() {
        this.decodedToken = this.sessionStrgSrvc.getDecodedToken() ||  new DecodedToken();        
        return moment().isBefore(this.getExpiration());
    }

    public logout() {
        this.sessionStrgSrvc.removeTokens();
        this.decodedToken = new DecodedToken();
    }


}
