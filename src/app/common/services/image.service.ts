import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private http: HttpClient) {}

  /**
   * Hace el post de la img, debiendo indicar a quien corresponde
   * @param image
   * @param type
   */
  public uploadImage(image: File, type: string): Observable<any> {
    let formData: FormData = new FormData();

    formData.append('image', image);

    return this.http.post(environment.url + `image-upload?type=${type}`, formData);
  }
}
