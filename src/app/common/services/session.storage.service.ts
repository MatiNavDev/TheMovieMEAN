import { DecodedToken } from './../models/decodedToken.model';
import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';


@Injectable({
    providedIn: 'root'
  })
export class SessionStorageService {

  private TOKEN_KEY = 'TOKEN_KEY'
  private DECODED_TOKEN_KEY = 'DECODED_TOKEN_KEY'

  constructor(private storageSrvc: StorageService) { }


  // ----------------- Sets ----------------------


  public setToken(token: string) {
      this.storageSrvc.saveToStorage(this.TOKEN_KEY, token);
  }

  public setDecodedToken(decodedToken: DecodedToken) {
      this.storageSrvc.saveToStorage(this.DECODED_TOKEN_KEY, decodedToken);
  }


  // ----------------- Gets ----------------------


  public getToken() {
      return this.storageSrvc.getFromStorage(this.TOKEN_KEY);
  }


  public getDecodedToken() {
      return this.storageSrvc.getFromStorage(this.DECODED_TOKEN_KEY);
  }


  // ----------------- Removes ----------------------


  removeTokens(){
    this.storageSrvc.removeFromStorage(this.TOKEN_KEY);
    this.storageSrvc.removeFromStorage(this.DECODED_TOKEN_KEY);
    }


}
