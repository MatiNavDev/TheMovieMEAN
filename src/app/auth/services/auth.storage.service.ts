import { StorageService } from 'src/app/common/services/storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  private USER_KEY = 'USER_KEY'


  constructor(
    private storageSrvc: StorageService
  ) { }


  // ----------------- Sets ----------------------


  public setUser(user: any) {
    this.storageSrvc.saveToStorage(this.USER_KEY, user);
  }


  // ----------------- Gets ----------------------


  public getUser() {
    return this.storageSrvc.getFromStorage(this.USER_KEY);
  }

}
