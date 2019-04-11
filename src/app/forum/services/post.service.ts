import { ImageService } from './../../common/services/image.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from '../../common/services/error-handler.service';
import { LoadingService } from 'src/app/common/services/loading.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private http: HttpClient,
    private errorSrvc: ErrorHandlerService,
    private imgSrvc: ImageService
  ) {}

  /**
   * Maneja el enviarle anadir un post en el servidor
   * @param data
   */
  public addPost(post) {
    return this.http.post(environment.url + 'posts', post).pipe(
      switchMap((response: any) => {
        debugger;
        const { post } = response.result;
        return of(post);
      }),
      // una vez que el post se guardo, veo si hay que agregarle la imagen
      switchMap(post => {
        debugger;
        if (post.img) {
          return this.imgSrvc.uploadImage(post.img, 'post').pipe(
            switchMap(updatedPost => {
              return of(updatedPost);
            })
          );
        }
        return of(post);
      }),
      catchError(error => {
        debugger;
        const errorToShow = this.errorSrvc.handleUniversalError(error);
        throw errorToShow;
      })
    );
  }
}
