import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as moment from 'moment'
import { DecodedToken } from 'src/app/auth/models/decodedToken.model';
import { SessionStorageService } from 'src/app/common/services/session.storage.service';

const jwt = new JwtHelperService();


@Injectable()
export class SessionService {

    decodedToken

    constructor( private sessionStrgSrvc: SessionStorageService) {

        this.decodedToken = this.sessionStrgSrvc.getSessionDecodedToken() || new DecodedToken()
        

    }

    private getExpiration(){
        return moment.unix(this.decodedToken.exp)
    }

    isAuthenticated(){
        return moment().isBefore(this.getExpiration())
    }

    logout(){
        this.sessionStrgSrvc.removeToken()
        this.decodedToken = new DecodedToken()
    }


}
