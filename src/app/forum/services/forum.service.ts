import { ImageService } from '../../common/services/image.service';
import { ErrorHandlerService } from '../../common/services/error-handler.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  constructor(
    private http: HttpClient,
    private errorSrvc: ErrorHandlerService,
    private imgSrvc: ImageService
  ) {}

  /**
   * Aniade un post o un comentario
   * @param postOrComment
   * @param type
   * @param postId
   */
  public addPostOrComment(postOrComment: object, type: 'comments' | 'posts', postId?: string) {
    let urlPart = type === 'posts' ? type : `${type}/${postId}`;
    urlPart += `?amountPerPage=${environment.pageSize}`;
    return this.http.post(environment.url + urlPart, postOrComment).pipe(
      // una vez que el post se guardo, veo si hay que agregarle la imagen
      switchMap((response: any) => {
        const { newElement: postOrCommentFromServer, lastPage } = response.result;
        if (postOrCommentFromServer.img && type === 'posts') {
          return this.imgSrvc
            .uploadImage(postOrCommentFromServer.img, 'post', postOrCommentFromServer._id)
            .pipe(
              switchMap(() => {
                return of(lastPage);
              })
            );
        }
        return of(lastPage);
      }),
      catchError(error => {
        throw this.errorSrvc.handleRequestError(error);
      })
    );
  }

  /**
   * Maneja el obtener un post con toda la data necesaria desde el back
   * @param postId
   */
  public getFullPost(postId): Observable<any> {
    return this.http.get(environment.url + `posts/${postId}`).pipe(
      switchMap((response: any) => {
        const { fullPost } = response.result;
        return of(fullPost);
      }),
      catchError(error => {
        throw this.errorSrvc.handleRequestError(error);
      })
    );
  }

  /**
   * Obtiene los ultimos posts definidos en el amount
   * @param amount
   */
  public getLastestPosts(amount: number): Observable<any> {
    return this.http.get(environment.url + `posts/latest/${amount}`).pipe(
      switchMap((response: any) => {
        const { latestPosts } = response.result;
        return of(latestPosts);
      }),
      catchError(error => {
        throw this.errorSrvc.handleRequestError(error);
      })
    );
  }

  /**
   * Obtiene los ultimos posts definidos en el amount
   * @param amount
   */
  public getMostCommentedPosts(amount: number): Observable<any> {
    return this.http.get(environment.url + `posts/mostCommented/${amount}`).pipe(
      switchMap((response: any) => {
        const { latestPosts } = response.result;
        return of(latestPosts);
      }),
      catchError(error => {
        throw this.errorSrvc.handleRequestError(error);
      })
    );
  }

  /**
   * Obtiene el comentario con los detalles del servidor
   * @param commentId
   */
  public getFullComment(commentId: string) {
    const route = environment.url + `comments/${commentId}/detailed`;
    return this.http.get(route).pipe(
      switchMap((response: any) => {
        const { messageFromFullComment } = response.result;
        return of(messageFromFullComment);
      }),
      catchError(error => {
        throw this.errorSrvc.handleRequestError(error);
      })
    );
  }
}
