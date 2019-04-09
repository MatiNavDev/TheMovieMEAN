import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient){}

  public async getLikePromise(url): Promise<any>{
    const result = await this.http.get(url).toPromise()
    return result;
  }
}
