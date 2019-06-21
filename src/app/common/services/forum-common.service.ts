import { ErrorHandlerService } from 'src/app/common/services/error-handler.service';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForumCommonService {
  constructor(private http: HttpClient, private errorSrvc: ErrorHandlerService) {}

  /**
   * Envia al server un post o un comentario para eliminar
   * @param itemId
   * @param type
   */
  public deletePostOrComment(itemId, type): Observable<any> {
    return this.http.delete(`${environment.url}/${type}/${itemId}`).pipe(
      catchError(error => {
        throw this.errorSrvc.handleRequestError(error);
      })
    );
  }

  /**
   * Maneja el editar un comentario
   * @param itemId
   * @param type
   */
  public editComment(itemId, params): Observable<any> {
    return this.http.patch(`${environment.url}/comments/${itemId}`, params).pipe(
      catchError(error => {
        throw this.errorSrvc.handleRequestError(error);
      })
    );
  }
}
