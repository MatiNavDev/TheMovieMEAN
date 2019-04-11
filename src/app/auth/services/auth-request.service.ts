import { ImageService } from './../../common/services/image.service';
import { Subscriber } from 'rxjs/internal/Subscriber';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { JwtHelperService } from '@auth0/angular-jwt';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { SessionStorageService } from 'src/app/common/services/session.storage.service';
import { SessionService } from 'src/app/common/services/session.service';
import { ErrorHandlerService } from 'src/app/common/services/error-handler.service';
import { AuthStorageService } from './auth.storage.service';
import { DecodedToken } from '../../common/models/decodedToken.model';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthRequestService {
  private jwt = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private sessionStrgSrvc: SessionStorageService,
    private authStgSrvc: AuthStorageService,
    private errorSrvc: ErrorHandlerService,
    public sessionsrvc: SessionService,
    private imgSrvc: ImageService
  ) {}

  /**
   * Maneja un registro o inicio exitoso
   * @param response
   */
  private handleSuccessfullLoginOrRegister(response) {
    const { user, token } = response.result;
    this.setToken(token);
    this.authStgSrvc.setUser(user);
  }

  /**
   * Guarda el token para que el back nos identifique
   * @param token
   */
  private setToken(token: string) {
    this.sessionsrvc.setSessionMode(true);
    const decodedtoken: DecodedToken = this.jwt.decodeToken(token);
    this.sessionStrgSrvc.setToken(token);
    this.sessionStrgSrvc.setDecodedToken(decodedtoken);
  }

  /**
   * Loguea un usuario
   * @param data
   */
  public userLogin(data): Observable<any> {
    return this.http.post(environment.url + 'auth/login', data).pipe(
      switchMap((response: any) => {
        this.handleSuccessfullLoginOrRegister(response);
        return of([]);
      }),
      catchError(error => {
        throw this.errorSrvc.handleUniversalError(error);
      })
    );
  }

  /**
   * Registra un usuario
   */
  public userRegister(data) {
    /**Switch map lo que hace es agarrar un observable, manejar el resultado y hacer que retorne otro observable,
     * luego si te subscribis al switchMap, agarras el valor que devolvio ese segundo observable. La gracia es que switchMap
     * se encargo de manejar la desuscripcion al primer observable.
     */
    return this.http.post(environment.url + 'auth/register', data).pipe(
      switchMap((response: any) => {
        this.handleSuccessfullLoginOrRegister(response);
        return of([]);
      }),
      // una vez que el usuario se registro, veo si hay que agregarle la imagen
      switchMap(() => {
        if (data.img) {
          return this.imgSrvc.uploadImage(data.img, 'user').pipe(
            switchMap(updatedUser => {
              this.authStgSrvc.setUser(updatedUser.result);
              return of([]);
            })
          );
        } else {
          return of([]);
        }
      }),
      catchError(error => {
        throw this.errorSrvc.handleUniversalError(error);
      })
    );
  }
}
