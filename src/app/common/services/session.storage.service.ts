import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class SessionStorageService {
  private localStorage: Storage

  static get KEY_SESSIONTOKEN() { return 'KeySessionToken'; }
  static get KEY_SESSIONDECODEDTOKEN() { return 'KeySessionDecodedToken'; }

  constructor() {
    this.localStorage = window.localStorage
  }

  
  // ------------  sets -----------------

  setSessionToken(token: string){
    var tokenString = JSON.stringify(token)
     this.localStorage.setItem(SessionStorageService.KEY_SESSIONTOKEN, tokenString)
  }
  setSessionDecodedToken(token: string){
    var tokenString = JSON.stringify(token)
     this.localStorage.setItem(SessionStorageService.KEY_SESSIONDECODEDTOKEN, tokenString)
  }


  // ------------- gets ----------------


  getSessionToken() {
    return JSON.parse(this.localStorage.getItem(SessionStorageService.KEY_SESSIONTOKEN))
  }
  getSessionDecodedToken() {
    return JSON.parse(this.localStorage.getItem(SessionStorageService.KEY_SESSIONDECODEDTOKEN))
  }


  // ------------ Removes ----------------


  removeToken(){
      this.localStorage.removeItem(SessionStorageService.KEY_SESSIONTOKEN)
      this.localStorage.removeItem(SessionStorageService.KEY_SESSIONDECODEDTOKEN)
  }


}
