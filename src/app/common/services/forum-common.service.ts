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

  private editMessageSource = new BehaviorSubject('');
  editMessage = this.editMessageSource.asObservable();

  getEditMessage() {
    return this.editMessage;
  }

  setEditMessage(editMessage: string) {
    this.editMessageSource.next(editMessage);
  }

  /**
   * Envia al server un post o un comentario para eliminar
   * @param itemId
   * @param type
   */
  public deletePostOrComment(itemId, type): Observable<any> {
    debugger;
    return this.http.delete(`${environment.url}/${type}/${itemId}`).pipe(
      catchError(error => {
        throw this.errorSrvc.handleRequestError(error);
      })
    );
  }

  /**
   * Envia al server un post o un comentario para eliminar.
   * TODO: hay que ver como agregar imagenes (en el add post) y como editarlas (y aca se guardarian)
   * @param itemId
   * @param type
   */
  public editPostOrComment(itemId, type, params): Observable<any> {
    return this.http.put(`${environment.url}/${type}/${itemId}`, params).pipe(
      catchError(error => {
        throw this.errorSrvc.handleRequestError(error);
      })
    );
  }
}
